'use client';

export default function BuildingSummary({ 
  buildingSummary, 
  handleSummaryChange, 
  disabled = false 
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Building Summary</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Length
          </label>
          <input
            type="text"
            name="length"
            value={buildingSummary.length || ''}
            onChange={handleSummaryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={disabled}
            placeholder="e.g., 12m"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Width
          </label>
          <input
            type="text"
            name="width"
            value={buildingSummary.width || ''}
            onChange={handleSummaryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={disabled}
            placeholder="e.g., 8m"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bathrooms
          </label>
          <input
            type="text"
            name="baths"
            value={buildingSummary.baths || ''}
            onChange={handleSummaryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={disabled}
            placeholder="e.g., 2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Levels
          </label>
          <input
            type="text"
            name="levels"
            value={buildingSummary.levels || ''}
            onChange={handleSummaryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={disabled}
            placeholder="e.g., 2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Car Spaces
          </label>
          <input
            type="text"
            name="cars"
            value={buildingSummary.cars || ''}
            onChange={handleSummaryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={disabled}
            placeholder="e.g., 1"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bedrooms
          </label>
          <input
            type="text"
            name="beds"
            value={buildingSummary.beds || ''}
            onChange={handleSummaryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            disabled={disabled}
            placeholder="e.g., 3"
          />
        </div>
      </div>
    </div>
  );
}
