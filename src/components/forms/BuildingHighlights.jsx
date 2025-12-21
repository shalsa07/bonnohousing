'use client';

import { useState } from 'react';

export default function BuildingHighlights({ 
  buildingHighlights, 
  onAddHighlight, 
  onRemoveHighlight, 
  disabled = false 
}) {
  const [highlightTitle, setHighlightTitle] = useState('');
  const [highlightDesc, setHighlightDesc] = useState('');

  const handleAddHighlight = () => {
    if (highlightTitle.trim() && highlightDesc.trim()) {
      onAddHighlight({
        title: highlightTitle.trim(),
        desc: highlightDesc.trim()
      });
      setHighlightTitle('');
      setHighlightDesc('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Building Highlights</h2>
      
      <div className="space-y-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Highlight Title
          </label>
          <input
            type="text"
            value={highlightTitle}
            onChange={(e) => setHighlightTitle(e.target.value)}
            placeholder="Enter highlight title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={disabled}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Highlight Description
          </label>
          <textarea
            value={highlightDesc}
            onChange={(e) => setHighlightDesc(e.target.value)}
            placeholder="Enter highlight description"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={disabled}
          />
        </div>
        
        <button
          type="button"
          onClick={handleAddHighlight}
          disabled={disabled || !highlightTitle.trim() || !highlightDesc.trim()}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add Highlight
        </button>
      </div>
      
      <div className="space-y-3">
        {buildingHighlights && buildingHighlights.length > 0 ? (
          buildingHighlights.map((highlight, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-800">{highlight.title}</h3>
                <button
                  type="button"
                  onClick={() => onRemoveHighlight(index)}
                  disabled={disabled}
                  className="text-red-500 hover:text-red-700 px-2 py-1 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Remove
                </button>
              </div>
              <p className="text-gray-600 text-sm">{highlight.desc}</p>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm italic p-4 border border-gray-200 rounded-md bg-gray-50">
            No highlights added yet. Add highlights to showcase key features of your building.
          </div>
        )}
      </div>
    </div>
  );
}
