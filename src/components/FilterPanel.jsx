'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function FilterPanel({ onFiltersChange, disabled = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    buildingTypes: [],
    levels: [],
    baths: [],
    beds: [],
    areas: [],
    lengths: [],
    widths: []
  });

  // Filter options
  const filterOptions = {
    buildingTypes: [
      { value: 'single-storey', label: 'Single Storey Residential' },
      { value: 'multi-storey', label: 'Multi-Storey Residential' },
      { value: 'commercial', label: 'Commercial' }
    ],
    levels: [
      { value: '1', label: '1 Level' },
      { value: '2', label: '2 Levels' },
      { value: '3', label: '3+ Levels' }
    ],
    baths: [
      { value: '1', label: '1 Bath' },
      { value: '2', label: '2 Baths' },
      { value: '3', label: '3 Baths' },
      { value: '4+', label: '4+ Baths' }
    ],
    beds: [
      { value: '1', label: '1 Bed' },
      { value: '2', label: '2 Beds' },
      { value: '3', label: '3 Beds' },
      { value: '4', label: '4 Beds' },
      { value: '5+', label: '5+ Beds' }
    ],
    areas: [
      { value: '0-150', label: 'Under 150 sqm' },
      { value: '150-250', label: '150-250 sqm' },
      { value: '250-350', label: '250-350 sqm' },
      { value: '350+', label: 'Over 350 sqm' }
    ],
    lengths: [
      { value: '0-15', label: 'Under 15m' },
      { value: '15-25', label: '15-25m' },
      { value: '25-35', label: '25-35m' },
      { value: '35+', label: 'Over 35m' }
    ],
    widths: [
      { value: '0-10', label: 'Under 10m' },
      { value: '10-15', label: '10-15m' },
      { value: '15-20', label: '15-20m' },
      { value: '20+', label: 'Over 20m' }
    ]
  };

  const handleFilterChange = (category, value) => {
    const newFilters = { ...filters };
    
    if (newFilters[category].includes(value)) {
      // Remove filter if already selected
      newFilters[category] = newFilters[category].filter(item => item !== value);
    } else {
      // Add filter if not selected
      newFilters[category] = [...newFilters[category], value];
    }
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      buildingTypes: [],
      levels: [],
      baths: [],
      beds: [],
      areas: [],
      lengths: [],
      widths: []
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

  const FilterSection = ({ title, category, options }) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-gray-700 mb-2">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center">
            <input
              type="checkbox"
              checked={filters[category].includes(option.value)}
              onChange={() => handleFilterChange(category, option.value)}
              disabled={disabled}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            />
            <span className="ml-2 text-sm text-gray-600">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 
          bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none 
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span className="flex items-center">
          Filters
          {getActiveFilterCount() > 0 && (
            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {getActiveFilterCount()}
            </span>
          )}
        </span>
        {isOpen ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filter Buildings</h3>
            {getActiveFilterCount() > 0 && (
              <button
                onClick={clearAllFilters}
                disabled={disabled}
                className="flex items-center text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Clear All
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            <FilterSection 
              title="Building Type" 
              category="buildingTypes" 
              options={filterOptions.buildingTypes} 
            />
            <FilterSection 
              title="Levels" 
              category="levels" 
              options={filterOptions.levels} 
            />
            <FilterSection 
              title="Bathrooms" 
              category="baths" 
              options={filterOptions.baths} 
            />
            <FilterSection 
              title="Bedrooms" 
              category="beds" 
              options={filterOptions.beds} 
            />
            <FilterSection 
              title="Area" 
              category="areas" 
              options={filterOptions.areas} 
            />
            <FilterSection 
              title="Length" 
              category="lengths" 
              options={filterOptions.lengths} 
            />
            <FilterSection 
              title="Width" 
              category="widths" 
              options={filterOptions.widths} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
