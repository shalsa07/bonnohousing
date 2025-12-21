'use client';

import { useState, useEffect, useRef } from 'react';
import { storage } from '@/libs/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function FileUpload({
  label,
  files,
  setFiles,
  isImage = false,
  withPriority = false,
  withDescription = false,
  accept,
  disabled = false,
  projectTitle = 'untitled',
  fieldName = 'files',
  onSaveToDatabase,
  savedToDatabase = false
}) {
  const [uploadError, setUploadError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [localFiles, setLocalFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const dropZoneRef = useRef(null);

  // Ref to track if we should sync to parent (to avoid infinite loops)
  const shouldSyncToParent = useRef(false);

  // Sync localFiles with files prop (only when files prop changes externally)
  useEffect(() => {
    if (Array.isArray(files) && !shouldSyncToParent.current) {
      setLocalFiles(files);
    }
    shouldSyncToParent.current = false;
  }, [files]);

  // Sync local changes to parent state (after render, not during)
  useEffect(() => {
    if (shouldSyncToParent.current && setFiles) {
      setFiles(localFiles);
      shouldSyncToParent.current = false;
    }
  }, [localFiles, setFiles]);

  // Check if there are unsaved uploads
  const hasUnsavedUploads = localFiles.some(f =>
    f.url && !f.uploading && f.pendingSave !== false && !savedToDatabase
  );

  // Check if any file has been uploading for more than 4 days (for notification)
  const hasExpiringSoonUploads = localFiles.some(f => {
    if (f.uploadedAt && !savedToDatabase) {
      const uploadDate = new Date(f.uploadedAt);
      const now = new Date();
      const daysDiff = (now - uploadDate) / (1000 * 60 * 60 * 24);
      return daysDiff > 3; // Show warning after 3 days
    }
    return false;
  });

  // Update local files and mark for sync to parent
  const updateLocalFiles = (updater) => {
    shouldSyncToParent.current = true;
    setLocalFiles(prev => {
      const newFiles = typeof updater === 'function' ? updater(prev) : updater;
      return newFiles;
    });
  };

  // Upload a single file to Firebase Storage
  const uploadToFirebase = async (file, index) => {
    // Validate image size
    if (isImage && file.size > 3 * 1024 * 1024) {
      setUploadError(`File ${file.name} is too large. Max size is 3MB.`);
      return null;
    }

    const sanitizedProjectTitle = (projectTitle || 'untitled').replace(/[^a-zA-Z0-9-_ ]/g, '');
    const sanitizedFieldName = (fieldName || 'files').replace(/[^a-zA-Z0-9-_ ]/g, '');
    const storagePath = `bonnohousing/houses/${sanitizedProjectTitle}/${sanitizedFieldName}/${file.name}`;

    console.log('Uploading to Firebase path:', storagePath);

    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // Update progress in local file state
          updateLocalFiles(prev => {
            const updated = Array.isArray(prev) ? [...prev] : [];
            if (updated[index]) {
              updated[index] = { ...updated[index], progress };
            }
            return updated;
          });
        },
        (error) => {
          console.error('Upload error:', error);
          setUploadError(`Failed to upload ${file.name}: ${error.message}`);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('Upload successful, URL:', downloadURL);
            resolve(downloadURL);
          } catch (err) {
            console.error('Failed to get download URL:', err);
            reject(err);
          }
        }
      );
    });
  };

  // Process files for upload (shared by both input change and drag/drop)
  const processFilesForUpload = async (selectedFiles) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploadError(null);
    const fileArray = Array.from(selectedFiles);

    // Filter files by accept type if specified
    const acceptedTypes = accept ? accept.split(',').map(t => t.trim().toLowerCase()) : null;
    const validFiles = acceptedTypes
      ? fileArray.filter(file => {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        const mimeType = file.type.toLowerCase();
        return acceptedTypes.some(type =>
          type === ext ||
          type === mimeType ||
          (type.endsWith('/*') && mimeType.startsWith(type.replace('/*', '/')))
        );
      })
      : fileArray;

    if (validFiles.length === 0) {
      setUploadError(`No valid files selected. Accepted types: ${accept}`);
      return;
    }

    if (validFiles.length !== fileArray.length) {
      setUploadError(`Some files were skipped. Accepted types: ${accept}`);
    }

    // Get current files length to calculate correct indices
    const startIndex = localFiles.length;

    // Create initial file entries with temporary preview for images
    const newFileEntries = validFiles.map((file, i) => ({
      file,
      name: file.name.replace(/\.[^/.]+$/, ''),
      preview: isImage ? URL.createObjectURL(file) : null,
      url: '',
      progress: 0,
      uploading: true,
      pendingSave: true,
      uploadedAt: null,
      ...(withPriority && { priority: startIndex + i })
    }));

    // Add new entries to local state immediately (shows uploading state)
    updateLocalFiles(prev => [...(Array.isArray(prev) ? prev : []), ...newFileEntries]);

    // Upload each file to Firebase
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const fileIndex = startIndex + i;

      try {
        const downloadURL = await uploadToFirebase(file, fileIndex);

        if (downloadURL) {
          // Update the file entry with the Firebase URL
          updateLocalFiles(prev => {
            const updated = Array.isArray(prev) ? [...prev] : [];
            if (updated[fileIndex]) {
              // Revoke blob URL if it exists
              if (updated[fileIndex].preview && updated[fileIndex].preview.startsWith('blob:')) {
                URL.revokeObjectURL(updated[fileIndex].preview);
              }
              updated[fileIndex] = {
                ...updated[fileIndex],
                url: downloadURL,
                preview: isImage ? downloadURL : null,
                progress: 100,
                uploading: false,
                pendingSave: true,
                uploadedAt: new Date().toISOString(),
                file: null
              };
            }
            return updated;
          });
        }
      } catch (err) {
        console.error(`Failed to upload ${file.name}:`, err);
        updateLocalFiles(prev => {
          const updated = Array.isArray(prev) ? [...prev] : [];
          if (updated[fileIndex]) {
            updated[fileIndex] = {
              ...updated[fileIndex],
              uploading: false,
              uploadFailed: true,
              progress: 0
            };
          }
          return updated;
        });
      }
    }
  };

  const handleFileChange = async (e) => {
    await processFilesForUpload(e.target.files);
    e.target.value = '';
  };

  // Drag and drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if leaving the drop zone entirely
    if (e.currentTarget === dropZoneRef.current && !e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer?.files;
    if (droppedFiles && droppedFiles.length > 0) {
      await processFilesForUpload(droppedFiles);
    }
  };

  const handleNameChange = (index, name) => {
    updateLocalFiles(prev => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      if (updated[index]) {
        updated[index] = { ...updated[index], name };
      }
      return updated;
    });
  };

  const handlePriorityChange = (index, priority) => {
    updateLocalFiles(prev => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      if (updated[index]) {
        updated[index] = { ...updated[index], priority };
      }
      return updated;
    });
  };

  const handleRemoveFile = (index) => {
    updateLocalFiles(prev => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      const removedFile = updated[index];
      if (removedFile?.preview && removedFile.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return updated.filter((_, i) => i !== index);
    });
  };

  // Handle save to database
  const handleSaveToDatabase = async () => {
    if (!onSaveToDatabase) return;

    setSaving(true);
    try {
      // Pass the local files to the parent for saving
      await onSaveToDatabase(localFiles);
      // Mark files as saved
      updateLocalFiles(prev =>
        prev.map(f => ({ ...f, pendingSave: false }))
      );
    } catch (error) {
      console.error('Failed to save to database:', error);
      setUploadError('Failed to save files to database. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Helper to count words
  const countWords = (str) => {
    if (!str) return 0;
    return str.trim().split(/\s+/).length;
  };

  const handleDescriptionChange = (index, description) => {
    updateLocalFiles(prev => {
      const updated = Array.isArray(prev) ? [...prev] : [];
      if (updated[index]) {
        updated[index] = { ...updated[index], description };
      }
      return updated;
    });
  };

  useEffect(() => {
    return () => {
      if (Array.isArray(localFiles)) {
        localFiles.forEach(file => {
          if (file.preview && file.preview.startsWith('blob:')) {
            URL.revokeObjectURL(file.preview);
          }
        });
      }
    };
  }, [localFiles]);

  return (
    <div className={`py-2 px-4 my-1 flex flex-col gap-2 border rounded-md shadow-sm ${hasUnsavedUploads ? 'border-red-300 bg-red-50' : 'border-gray-200'
      }`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {hasUnsavedUploads && (
          <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full font-medium animate-pulse">
            ⚠️ Unsaved uploads
          </span>
        )}
      </div>

      {/* Warning for expiring uploads */}
      {hasExpiringSoonUploads && (
        <div className="text-xs text-red-700 bg-red-100 px-3 py-2 rounded border border-red-200">
          ⚠️ <strong>Warning:</strong> Some uploads will be deleted in less than 24 hours if not saved to database!
        </div>
      )}

      <p className="text-xs text-gray-500">
        Allowed types: {accept}. {isImage && 'Max size: 3MB'} • Files upload to Firebase automatically
      </p>

      {uploadError && (
        <div className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded">
          {uploadError}
        </div>
      )}

      {/* Drag and Drop Zone */}
      <div
        ref={dropZoneRef}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${isDragOver
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <div className="flex flex-col items-center gap-2">
          <svg
            className={`w-10 h-10 ${isDragOver ? 'text-blue-500' : 'text-gray-400'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className={`text-sm ${isDragOver ? 'text-blue-600' : 'text-gray-600'}`}>
            {isDragOver ? 'Drop files here...' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-gray-500">or</p>
          <label className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-colors ${disabled
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 cursor-pointer'
            }`}>
            <span>Browse Files</span>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              accept={accept}
              disabled={disabled}
            />
          </label>
        </div>
      </div>

      {Array.isArray(localFiles) && localFiles.map((item, index) => {
        // Handle both new uploads and existing data from API
        const fileName = item.file?.name || item.name || decodeURIComponent(item.url?.split('/').pop()?.split('?')[0] || 'Unknown file');
        // Only show image preview for image files, and only if we have a valid URL
        const previewUrl = isImage ? (item.preview || item.url || null) : null;
        const isUploading = item.uploading;
        const isUploaded = item.url && !item.uploading;
        const uploadFailed = item.uploadFailed;
        const isPendingSave = item.pendingSave && !savedToDatabase;

        const currentDesc = item.description || '';
        const wordCount = countWords(currentDesc);
        const isOverLimit = wordCount > 300;

        return (
          <div key={index} className={`shadow rounded-md mt-2 p-3 border ${uploadFailed ? 'bg-red-50 border-red-200' :
            isPendingSave ? 'bg-yellow-50 border-yellow-200' :
              'bg-gray-50 border-gray-200'
            }`}>
            {/* File Info Row */}
            <div className="flex items-center gap-3 mb-3">
              {/* Show image preview only for image files */}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded border flex-shrink-0"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              {/* Show file icon for non-image files */}
              {!isImage && (
                <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded border flex-shrink-0">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{fileName}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {isUploading && (
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Uploading...</span>
                  )}
                  {isUploaded && !isPendingSave && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">✓ Saved</span>
                  )}
                  {isUploaded && isPendingSave && (
                    <span className="text-xs text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded">⚠️ Pending Save</span>
                  )}
                  {uploadFailed && (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">Upload Failed</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 text-sm font-medium rounded transition-colors"
                disabled={disabled || isUploading}
              >
                Remove
              </button>
            </div>

            {/* Progress Bar - show during upload */}
            {isUploading && item.progress >= 0 && (
              <div className="w-full mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Uploading to Firebase...</span>
                  <span>{Math.round(item.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Input Fields Row - only show after upload or for existing files */}
            {(isUploaded || (!isUploading && !uploadFailed)) && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Display Name</label>
                    <input
                      type="text"
                      placeholder="Enter display name"
                      value={item.name || ''}
                      onChange={(e) => handleNameChange(index, e.target.value)}
                      className="w-full h-9 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      disabled={disabled}
                    />
                  </div>
                  {withPriority && (
                    <div className="w-24">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
                      <input
                        type="number"
                        placeholder="0-10"
                        value={item.priority ?? ''}
                        onChange={(e) => handlePriorityChange(index, e.target.value)}
                        className="w-full h-9 px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={disabled}
                        min="0"
                        max="10"
                      />
                    </div>
                  )}
                </div>

                {withDescription && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-medium text-gray-600">Description</label>
                      <span className={`text-[10px] ${isOverLimit ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                        {wordCount}/300 words
                      </span>
                    </div>
                    <textarea
                      placeholder="Enter description (max 300 words)..."
                      value={currentDesc}
                      onChange={(e) => handleDescriptionChange(index, e.target.value)}
                      rows={3}
                      className={`w-full px-3 py-1.5 border rounded-md shadow-sm text-sm focus:outline-none focus: ring-1 ${isOverLimit
                        ? 'border-red-500 ring-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                        }`}
                      disabled={disabled}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Save to Database Button */}
      {localFiles.length > 0 && onSaveToDatabase && (
        <div className="mt-4 flex items-center justify-between border-t pt-4">
          <p className="text-xs text-gray-500">
            {hasUnsavedUploads
              ? `${localFiles.filter(f => f.pendingSave).length} file(s) pending save. Files will be auto-deleted in 4 days if not saved.`
              : 'All files saved to database.'
            }
          </p>
          <button
            type="button"
            onClick={handleSaveToDatabase}
            disabled={disabled || saving || !hasUnsavedUploads}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${hasUnsavedUploads && !saving
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
          >
            {saving ? 'Saving...' : hasUnsavedUploads ? 'Save to Database' : '✓ Saved'}
          </button>
        </div>
      )}
    </div>
  );
}
