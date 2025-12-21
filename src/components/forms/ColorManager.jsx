'use client';

export default function ColorManager({
  colors = [],
  onAddColor,
  onRemoveColor,
  onColorChange,
  disabled = false
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Project Colors</h2>
      <p className="text-sm text-gray-500 mb-4">
        Add colors with hex values and material property names to map to 3D scene materials.
      </p>

      {/* Add New Color Button */}
      <div className="flex gap-3 mb-4">
        <button
          type="button"
          onClick={onAddColor}
          disabled={disabled}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
        >
          Add Color
        </button>
      </div>

      {/* Color List */}
      <div className="space-y-2">
        {colors && colors.length > 0 ? (
          colors.map((color, index) => (
            <div
              key={color.id || index}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-md bg-gray-50"
            >
              {/* Color ID Badge */}
              <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                {color.id}
              </span>

              {/* Color Picker Input */}
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color.color || color.name || '#ffffff'}
                  onChange={(e) => onColorChange(index, {
                    ...color,
                    color: e.target.value
                  })}
                  className="w-14 h-10 border border-gray-300 rounded-md cursor-pointer disabled:opacity-50"
                  disabled={disabled}
                />
                {/* Hex Value Display */}
                <input
                  type="text"
                  value={color.color || color.name || '#ffffff'}
                  onChange={(e) => {
                    let hexValue = e.target.value;
                    if (!hexValue.startsWith('#')) {
                      hexValue = '#' + hexValue;
                    }
                    if (/^#[0-9A-Fa-f]{0,6}$/.test(hexValue)) {
                      onColorChange(index, {
                        ...color,
                        color: hexValue
                      });
                    }
                  }}
                  placeholder="#ffffff"
                  className="w-20 px-2 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  disabled={disabled}
                />
              </div>

              {/* Material Property Name Input */}
              <input
                type="text"
                value={color.materialProperty || ''}
                onChange={(e) => onColorChange(index, {
                  ...color,
                  materialProperty: e.target.value
                })}
                placeholder="Material name (from 3D scene)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 bg-white"
                disabled={disabled}
              />

              {/* Remove Button */}
              <button
                type="button"
                onClick={() => onRemoveColor(index)}
                disabled={disabled}
                className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-sm italic p-4 border border-gray-200 rounded-md bg-gray-50">
            No colors added yet. Add colors to define the available options for this project.
          </div>
        )}
      </div>

      {/* Color Count */}
      {colors && colors.length > 0 && (
        <p className="text-sm text-gray-500 mt-3">
          Total colors: {colors.length}
        </p>
      )}
    </div>
  );
}

