'use client';

/**
 * HeroArraySection - Reusable sub-component for each hero array type
 * Handles display and management of hero images, drawings, and featured items
 * Supports Firebase Storage upload with progress indicator
 */
export default function HeroArraySection({
  title,
  items,
  newItem,
  setNewItem,
  onAdd,
  onRemove,
  onUpdateItem, // New prop for updating existing items
  onFileUpload,
  disabled,
  maxItems,
  currentCount,
  canAdd = true,
  acceptTypes = "image/*"
}) {
  const hasMaxLimit = maxItems !== undefined;
  const isUploading = newItem?.uploading;
  const uploadProgress = newItem?.uploadProgress || 0;
  const uploadError = newItem?.uploadError;
  const isReadyToAdd = newItem?.url && !newItem.url.startsWith('blob:') && !isUploading;

  // Helper to count words
  const countWords = (str) => {
    if (!str) return 0;
    return str.trim().split(/\s+/).length;
  };

  return (
    <div className="mb-6 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-md font-medium text-gray-600">{title}</h3>
        {hasMaxLimit && (
          <span className={`text-sm px-2 py-1 rounded ${currentCount >= maxItems
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-blue-100 text-blue-700'
            }`}>
            {currentCount}/{maxItems} images
          </span>
        )}
      </div>

      {/* Existing Items List */}
      {items.length > 0 && (
        <div className="space-y-4 mb-4">
          {items.map((item, index) => {
            const currentDesc = item.description || '';
            const wordCount = countWords(currentDesc);
            const isOverLimit = wordCount > 300;

            return (
              <div
                key={index}
                className="flex flex-col gap-3 p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="flex items-start gap-3">
                  {/* Preview Image */}
                  {item.url && (
                    <img
                      src={item.url}
                      alt={item.name || 'Preview'}
                      className="w-24 h-18 object-cover rounded border"
                    />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-700 truncate mb-1">
                          {item.name || 'Unnamed'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">✓ Uploaded</span>
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                            Priority: {item.priority}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(index)}
                        disabled={disabled}
                        className="text-red-500 hover:text-red-700 text-sm font-medium disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description Editing for Existing Item */}
                <div className="w-full">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-gray-500">Description</label>
                    <span className={`text-[10px] ${isOverLimit ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                      {wordCount}/300 words
                    </span>
                  </div>
                  <textarea
                    placeholder="Description..."
                    value={currentDesc}
                    onChange={(e) => onUpdateItem && onUpdateItem(index, { ...item, description: e.target.value })}
                    rows={2}
                    className={`w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-1 ${isOverLimit
                        ? 'border-red-500 ring-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }`}
                    disabled={disabled || !onUpdateItem}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add New Item Form */}
      <div className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* File Upload (Keep as is) */}
          <div className="md:col-span-4">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Upload File (auto-uploads to Firebase)
            </label>
            <input
              type="file"
              onChange={onFileUpload}
              accept={acceptTypes}
              disabled={disabled || !canAdd || isUploading}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </div>

          {/* Progress Bar (Keep as is) */}
          {isUploading && (
            <div className="md:col-span-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Uploading to Firebase...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Error */}
          {uploadError && (
            <div className="md:col-span-4 text-xs text-red-600 bg-red-50 px-3 py-2 rounded">
              {uploadError}
            </div>
          )}

          {/* Upload Success Indicator */}
          {isReadyToAdd && (
            <div className="md:col-span-4 text-xs text-green-600 bg-green-50 px-3 py-2 rounded flex items-center gap-2">
              <span>✓ File uploaded successfully!</span>
              <span className="text-gray-500">Fill in the details below and click Add.</span>
            </div>
          )}

          {/* Preview thumbnail */}
          {newItem.url && (
            <div className="md:col-span-4">
              <img
                src={newItem.url}
                alt="Preview"
                className="w-24 h-18 object-cover rounded border"
              />
            </div>
          )}

          {/* Name Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Display Name
            </label>
            <input
              type="text"
              value={newItem.name || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Display name"
              disabled={disabled || !canAdd || isUploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Priority Input */}
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Priority (0-10)
            </label>
            <input
              type="number"
              value={newItem.priority ?? 0}
              onChange={(e) => setNewItem(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              min="0"
              max="10"
              disabled={disabled || !canAdd || isUploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Description for New Item */}
          <div className="md:col-span-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-gray-500">Description</label>
              <span className={`text-[10px] ${countWords(newItem.description) > 300 ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
                {countWords(newItem.description)}/300 words
              </span>
            </div>
            <textarea
              value={newItem.description || ''}
              onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description..."
              rows={2}
              disabled={disabled || !canAdd || isUploading}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 ${countWords(newItem.description) > 300
                  ? 'border-red-500 ring-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                } disabled:bg-gray-100`}
            />
          </div>
        </div>

        {/* Add Button */}
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={onAdd}
            disabled={disabled || !canAdd || isUploading || !isReadyToAdd}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${canAdd && isReadyToAdd
                ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            {hasMaxLimit && !canAdd
              ? 'Maximum Reached'
              : isUploading
                ? 'Uploading...'
                : `Add ${title.replace(/s$/, '')}`}
          </button>
        </div>

        {/* Max Limit Warning */}
        {hasMaxLimit && !canAdd && (
          <p className="mt-2 text-xs text-yellow-600">
            Maximum of {maxItems} {title.toLowerCase()} allowed. Remove an existing item to add more.
          </p>
        )}
      </div>
    </div>
  );
}

