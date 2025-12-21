import { storage } from '@/libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes, getMetadata } from 'firebase/storage';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

/**
 * Firebase Storage Migration Utility
 * Copies files from ppsbluyari folder to bonnohousing/houses folder
 */

async function copyFile(sourceRef, destinationPath) {
    try {
        // Get the file's download URL
        const downloadURL = await getDownloadURL(sourceRef);

        // Fetch the file content
        const response = await fetch(downloadURL);
        const blob = await response.blob();

        // Get metadata to preserve content type
        const metadata = await getMetadata(sourceRef);

        // Create destination reference
        const destRef = ref(storage, destinationPath);

        // Upload to new location with same metadata
        await uploadBytes(destRef, blob, {
            contentType: metadata.contentType,
            customMetadata: {
                migratedFrom: sourceRef.fullPath,
                migratedAt: new Date().toISOString()
            }
        });

        const newDownloadURL = await getDownloadURL(destRef);

        return {
            success: true,
            sourcePath: sourceRef.fullPath,
            destinationPath: destinationPath,
            newDownloadURL: newDownloadURL
        };
    } catch (error) {
        console.error(`Error copying file ${sourceRef.fullPath}:`, error);
        return {
            success: false,
            sourcePath: sourceRef.fullPath,
            error: error.message
        };
    }
}

async function migrateFolder(sourcePath, destinationPath) {
    const results = {
        total: 0,
        successful: 0,
        failed: 0,
        files: []
    };

    try {
        const sourceRef = ref(storage, sourcePath);
        const listResult = await listAll(sourceRef);

        results.total = listResult.items.length;

        // Process files
        for (const itemRef of listResult.items) {
            const fileName = itemRef.name;
            const destPath = `${destinationPath}/${fileName}`;

            const result = await copyFile(itemRef, destPath);
            results.files.push(result);

            if (result.success) {
                results.successful++;
            } else {
                results.failed++;
            }
        }

        // Recursively process subfolders
        for (const folderRef of listResult.prefixes) {
            const folderName = folderRef.name;
            const subResults = await migrateFolder(
                `${sourcePath}/${folderName}`,
                `${destinationPath}/${folderName}`
            );

            results.total += subResults.total;
            results.successful += subResults.successful;
            results.failed += subResults.failed;
            results.files.push(...subResults.files);
        }

    } catch (error) {
        console.error(`Error migrating folder ${sourcePath}:`, error);
        results.error = error.message;
    }

    return results;
}

export async function POST(request) {
    try {
        // Check authentication - only admins should run migrations
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { sourcePath, destinationPath, dryRun = false } = await request.json();

        if (!sourcePath || !destinationPath) {
            return NextResponse.json(
                { error: 'sourcePath and destinationPath are required' },
                { status: 400 }
            );
        }

        if (dryRun) {
            // Dry run - just list files without copying
            const sourceRef = ref(storage, sourcePath);
            const listResult = await listAll(sourceRef);

            const fileList = listResult.items.map(item => ({
                path: item.fullPath,
                name: item.name,
                willMigrateTo: `${destinationPath}/${item.name}`
            }));

            return NextResponse.json({
                dryRun: true,
                totalFiles: fileList.length,
                files: fileList,
                message: 'This is a dry run. No files were copied.'
            });
        }

        // Actual migration
        const results = await migrateFolder(sourcePath, destinationPath);

        return NextResponse.json({
            success: true,
            message: 'Migration completed',
            results: results,
            executedBy: session.user.email || session.user.name,
            executedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('Migration error:', error);
        return NextResponse.json(
            { error: 'Migration failed', details: error.message },
            { status: 500 }
        );
    }
}

// GET endpoint to check migration status or list files
export async function GET(request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const path = searchParams.get('path');

        if (!path) {
            return NextResponse.json(
                { error: 'path parameter is required' },
                { status: 400 }
            );
        }

        const folderRef = ref(storage, path);
        const listResult = await listAll(folderRef);

        const files = await Promise.all(
            listResult.items.map(async (item) => {
                try {
                    const url = await getDownloadURL(item);
                    const metadata = await getMetadata(item);
                    return {
                        name: item.name,
                        fullPath: item.fullPath,
                        url: url,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        updated: metadata.updated
                    };
                } catch (error) {
                    return {
                        name: item.name,
                        fullPath: item.fullPath,
                        error: error.message
                    };
                }
            })
        );

        const folders = listResult.prefixes.map(folder => ({
            name: folder.name,
            fullPath: folder.fullPath
        }));

        return NextResponse.json({
            path: path,
            files: files,
            folders: folders,
            totalFiles: files.length,
            totalFolders: folders.length
        });

    } catch (error) {
        console.error('Error listing files:', error);
        return NextResponse.json(
            { error: 'Failed to list files', details: error.message },
            { status: 500 }
        );
    }
}
