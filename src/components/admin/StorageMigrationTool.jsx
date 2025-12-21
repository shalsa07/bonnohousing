'use client';

import { useState } from 'react';
import { storage } from '@/libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes, getMetadata } from 'firebase/storage';

export default function StorageMigrationTool() {
    const [sourcePath, setSourcePath] = useState('ppsbluyari');
    const [destinationPath, setDestinationPath] = useState('bonnohousing/houses');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState({ current: 0, total: 0 });

    // Copy a single file
    const copyFile = async (sourceRef, destinationPath) => {
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
    };

    // Migrate entire folder recursively
    const migrateFolder = async (sourcePath, destinationPath, updateProgress = true) => {
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

                if (updateProgress) {
                    setProgress(prev => ({ ...prev, current: prev.current + 1 }));
                }
            }

            // Recursively process subfolders
            for (const folderRef of listResult.prefixes) {
                const folderName = folderRef.name;
                const subResults = await migrateFolder(
                    `${sourcePath}/${folderName}`,
                    `${destinationPath}/${folderName}`,
                    updateProgress
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
    };

    // List files in a folder
    const listFiles = async (path) => {
        try {
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

            return {
                path: path,
                files: files,
                folders: folders,
                totalFiles: files.length,
                totalFolders: folders.length
            };
        } catch (error) {
            throw new Error(`Failed to list files: ${error.message}`);
        }
    };

    // Preview migration (dry run)
    const handlePreview = async () => {
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const sourceRef = ref(storage, sourcePath);
            const listResult = await listAll(sourceRef);

            const fileList = listResult.items.map(item => ({
                path: item.fullPath,
                name: item.name,
                willMigrateTo: `${destinationPath}/${item.name}`
            }));

            setResults({
                dryRun: true,
                totalFiles: fileList.length,
                files: fileList,
                message: 'This is a dry run. No files were copied.'
            });
        } catch (err) {
            console.error('Preview error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Execute migration
    const handleMigrate = async () => {
        if (!confirm('Are you sure you want to migrate these files? This will copy all files from source to destination.')) {
            return;
        }

        setLoading(true);
        setError(null);
        setResults(null);
        setProgress({ current: 0, total: 0 });

        try {
            // First, count total files
            const sourceRef = ref(storage, sourcePath);
            const listResult = await listAll(sourceRef);
            setProgress({ current: 0, total: listResult.items.length });

            // Execute migration
            const migrationResults = await migrateFolder(sourcePath, destinationPath);

            setResults({
                success: true,
                message: 'Migration completed',
                results: migrationResults
            });
        } catch (err) {
            console.error('Migration error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
            setProgress({ current: 0, total: 0 });
        }
    };

    // List source files
    const handleListSource = async () => {
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const fileList = await listFiles(sourcePath);
            setResults({ fileList });
        } catch (err) {
            console.error('List files error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // List destination files
    const handleListDestination = async () => {
        setLoading(true);
        setError(null);
        setResults(null);

        try {
            const fileList = await listFiles(destinationPath);
            setResults({ fileList });
        } catch (err) {
            console.error('List files error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Firebase Storage Migration Tool</h1>

            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm">
                    <strong>⚠️ Important:</strong> This tool copies files from one Firebase Storage location to another.
                    Always preview first to see what will be copied.
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
                <p className="text-sm mb-2">
                    <strong>📋 Firebase Storage Rules Required:</strong>
                </p>
                <p className="text-sm">
                    Make sure your Firebase Storage rules allow access. For testing, use:
                </p>
                <code className="block bg-blue-100 text-blue-900 p-2 rounded mt-2 text-xs">
                    allow read, write: if true;
                </code>
                <p className="text-xs mt-2 text-blue-700">
                    Go to Firebase Console → Storage → Rules → Publish
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Source Path
                    </label>
                    <input
                        type="text"
                        value={sourcePath}
                        onChange={(e) => setSourcePath(e.target.value)}
                        placeholder="e.g., ppsbluyari"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        The folder path to copy files from
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Destination Path
                    </label>
                    <input
                        type="text"
                        value={destinationPath}
                        onChange={(e) => setDestinationPath(e.target.value)}
                        placeholder="e.g., bonnohousing/houses"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        The folder path to copy files to
                    </p>
                </div>

                {progress.total > 0 && (
                    <div className="w-full">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Migrating files...</span>
                            <span>{progress.current} / {progress.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(progress.current / progress.total) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                <div className="flex gap-3 pt-4 flex-wrap">
                    <button
                        onClick={handlePreview}
                        disabled={loading || !sourcePath || !destinationPath}
                        className="px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : 'Preview Migration'}
                    </button>

                    <button
                        onClick={handleMigrate}
                        disabled={loading || !sourcePath || !destinationPath}
                        className="px-6 py-2 rounded-md font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Execute Migration
                    </button>

                    <button
                        onClick={handleListSource}
                        disabled={loading || !sourcePath}
                        className="px-6 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        List Source Files
                    </button>

                    <button
                        onClick={handleListDestination}
                        disabled={loading || !destinationPath}
                        className="px-6 py-2 rounded-md font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        List Destination Files
                    </button>
                </div>
            </div>

            {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    <p className="font-semibold">Error:</p>
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {results && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Results</h2>

                    {results.dryRun && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-4">
                            <p className="text-sm font-semibold">Preview - No files were copied</p>
                            <p className="text-sm mt-1">Total files that would be migrated: {results.totalFiles}</p>
                        </div>
                    )}

                    {results.results && (
                        <div className="space-y-2 mb-4">
                            <p className="text-sm">
                                <strong>Total Files:</strong> {results.results.total}
                            </p>
                            <p className="text-sm text-green-600">
                                <strong>Successful:</strong> {results.results.successful}
                            </p>
                            <p className="text-sm text-red-600">
                                <strong>Failed:</strong> {results.results.failed}
                            </p>
                        </div>
                    )}

                    {results.fileList && (
                        <div className="space-y-2 mb-4">
                            <p className="text-sm">
                                <strong>Path:</strong> {results.fileList.path}
                            </p>
                            <p className="text-sm">
                                <strong>Total Files:</strong> {results.fileList.totalFiles}
                            </p>
                            <p className="text-sm">
                                <strong>Total Folders:</strong> {results.fileList.totalFolders}
                            </p>
                        </div>
                    )}

                    {(results.files || results.fileList?.files) && (
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Files:</h3>
                            <div className="max-h-96 overflow-y-auto border rounded">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                File Name
                                            </th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                Source Path
                                            </th>
                                            {results.files && (
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Destination Path
                                                </th>
                                            )}
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {(results.files || results.fileList?.files || []).map((file) => (
                                            <tr key={file.fullPath || file.path || file.sourcePath} className="hover:bg-gray-50">
                                                <td className="px-4 py-2 text-sm text-gray-900">
                                                    {file.name || file.sourcePath?.split('/').pop()}
                                                </td>
                                                <td className="px-4 py-2 text-xs text-gray-600 font-mono">
                                                    {file.sourcePath || file.fullPath}
                                                </td>
                                                {results.files && (
                                                    <td className="px-4 py-2 text-xs text-gray-600 font-mono">
                                                        {file.destinationPath || file.willMigrateTo}
                                                    </td>
                                                )}
                                                <td className="px-4 py-2 text-sm">
                                                    {file.success === true && (
                                                        <span className="text-green-600">✓ Success</span>
                                                    )}
                                                    {file.success === false && (
                                                        <span className="text-red-600">✗ Failed</span>
                                                    )}
                                                    {file.success === undefined && results.fileList && (
                                                        <span className="text-gray-500">-</span>
                                                    )}
                                                    {file.success === undefined && !results.fileList && (
                                                        <span className="text-blue-600">Will migrate</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
