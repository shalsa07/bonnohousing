import { storage } from '@/libs/firebase';
import { ref, getDownloadURL, uploadBytes, getMetadata } from 'firebase/storage';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import clientPromise from '@/libs/db';

export const maxDuration = 300; // 5 minutes timeout for Vercel/Next.js
export const dynamic = 'force-dynamic'; // Prevent build-time execution
export const runtime = 'nodejs';

/**
 * Copy file from source to destination in Firebase Storage
 */
async function copyFile(sourceURL, newPathPrefix) {
    try {
        // Extract the path from the URL
        // format: .../o/folder%2Fsubfolder%2Ffile.jpg?alt=...
        const urlObj = new URL(sourceURL);
        const pathEncoded = urlObj.pathname.split('/o/')[1];
        if (!pathEncoded) return null;
        
        const fullPath = decodeURIComponent(pathEncoded);
        
        // Only process files in 'ppsbluyari' folder
        if (!fullPath.startsWith('ppsbluyari')) {
            return null;
        }

        const sourceRef = ref(storage, fullPath);
        
        // Construct new path: ppsbluyari/ProjectName/File.jpg -> bonnohousing/houses/ProjectName/File.jpg
        // Remove 'ppsbluyari/' prefix
        const relativePath = fullPath.substring('ppsbluyari/'.length);
        const destPath = `bonnohousing/houses/${relativePath}`;

        // Get content and metadata
        const [response, metadata] = await Promise.all([
            fetch(sourceURL),
            getMetadata(sourceRef)
        ]);
        
        const blob = await response.blob();
        
        // Upload to new location
        const destRef = ref(storage, destPath);
        await uploadBytes(destRef, blob, {
            contentType: metadata.contentType,
            customMetadata: {
                migratedFrom: fullPath,
                migratedAt: new Date().toISOString()
            }
        });

        // Get new URL
        const newUrl = await getDownloadURL(destRef);
        
        return {
            originalUrl: sourceURL,
            newUrl: newUrl,
            oldPath: fullPath,
            newPath: destPath
        };

    } catch (error) {
        console.error('Copy error for URL:', sourceURL, error);
        return { error: error.message, originalUrl: sourceURL };
    }
}

/**
 * Recursively scan object for strings containing 'ppsbluyari'
 */
function findUrls(obj, urls = new Set()) {
    if (!obj) return urls;

    if (typeof obj === 'string') {
        if (obj.includes('firebasestorage') && obj.includes('ppsbluyari')) {
            urls.add(obj);
        }
    } else if (Array.isArray(obj)) {
        obj.forEach(item => findUrls(item, urls));
    } else if (typeof obj === 'object') {
        Object.values(obj).forEach(val => findUrls(val, urls));
    }

    return urls;
}

export async function POST(request) {
    try {
        const session = await auth();
        if (!session?.user?.role === 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db();

        // 1. Scan Database for all legacy URLs
        const buildings = await db.collection('buildings').find({}).toArray();
        const urlsToMigrate = new Set();
        
        buildings.forEach(doc => findUrls(doc, urlsToMigrate));

        const urlList = Array.from(urlsToMigrate);
        console.log(`Found ${urlList.length} unique legacy URLs to migrate`);

        const results = {
            total: urlList.length,
            success: 0,
            failed: 0,
            mappings: {} // oldUrl -> newUrl
        };

        // 2. Process File Migrations concurrently (with limit)
        // Simple batch processing
        const BATCH_SIZE = 5;
        for (let i = 0; i < urlList.length; i += BATCH_SIZE) {
            const batch = urlList.slice(i, i + BATCH_SIZE);
            await Promise.all(batch.map(async (url) => {
                const result = await copyFile(url);
                if (result && result.newUrl) {
                    results.mappings[url] = result.newUrl;
                    results.success++;
                } else {
                    results.failed++;
                }
            }));
        }

        // 3. Update Database Records
        // We create a bulkWrite operation for each document
        const bulkOps = buildings.map(doc => {
            let jsonStr = JSON.stringify(doc);
            let modified = false;

            // Replace all occurrences of old URLs with new URLs
            Object.entries(results.mappings).forEach(([oldUrl, newUrl]) => {
                if (jsonStr.includes(oldUrl)) {
                    jsonStr = jsonStr.replaceAll(oldUrl, newUrl);
                    modified = true;
                }
            });

            if (modified) {
                const newDoc = JSON.parse(jsonStr);
                return {
                    updateOne: {
                        filter: { _id: doc._id },
                        update: { $set: newDoc } // Replaces the whole doc with updated URLs
                        // Ideally we'd use $set for specific fields, but structure is complex (arrays, nested objs).
                        // Since we just read it and no one else is editing concurently likely, this is acceptable for a migration script.
                    }
                };
            }
            return null;
        }).filter(op => op !== null);

        if (bulkOps.length > 0) {
            await db.collection('buildings').bulkWrite(bulkOps);
        }

        return NextResponse.json({
            success: true,
            migratedFiles: results.success,
            failedFiles: results.failed,
            documentsUpdated: bulkOps.length,
            message: `Migration complete. Moved ${results.success} files and updated ${bulkOps.length} documents.`
        });

    } catch (error) {
        console.error('Migration Master Error:', error);
        return NextResponse.json(
            { error: 'Migration failed', details: error.message },
            { status: 500 }
        );
    }
}
