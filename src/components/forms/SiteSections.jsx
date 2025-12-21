'use client';

import { useState } from 'react';

export default function SiteSections({ 
  siteSection, 
  onAddSection, 
  onRemoveSection, 
  disabled = false 
}) {
  const [siteSectionInput, setSiteSectionInput] = useState('');

  const handleAddSection = () => {
    if (siteSectionInput.trim()) {
      onAddSection(siteSectionInput.trim());
      setSiteSectionInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSection();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Site Sections</h2>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={siteSectionInput}
          onChange={(e) => setSiteSectionInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter site section"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          disabled={disabled}
        />
        <button
          type="button"
          onClick={handleAddSection}
          disabled={disabled || !siteSectionInput.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>
      
      <div className="space-y-2">
        {siteSection && siteSection.length > 0 ? (
          siteSection.map((section, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
              <span className="text-gray-700">{section}</span>
              <button
                type="button"
                onClick={() => onRemoveSection(index)}
                disabled={disabled}
                className="text-red-500 hover:text-red-700 px-2 py-1 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm italic p-3 border border-gray-200 rounded-md bg-gray-50">
            No site sections added yet. Add sections to organize your building locations.
          </div>
        )}
      </div>
    </div>
  );
}
