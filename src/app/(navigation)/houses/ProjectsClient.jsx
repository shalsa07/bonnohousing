'use client';

import { useState, useEffect, useCallback } from 'react';
import PagesWrapper from '@/components/PagesWrapper';
import BuildingList from '@/components/BuildingList';

export default function ProjectsClient({ initialBuildings = [] }) {
  // State management
  const [allBuildings, setAllBuildings] = useState(initialBuildings);
  const [filteredBuildings, setFilteredBuildings] = useState(initialBuildings);
  const [loading, setLoading] = useState(false); // Default to false as we have initial data
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    buildingTypes: [],
    levels: [],
    baths: [],
    beds: [],
    areas: [],
    lengths: [],
    widths: []
  });

  // Search function
  const searchBuildings = useCallback((buildings, searchTerm) => {
    if (!searchTerm.trim()) return buildings;

    const term = searchTerm.toLowerCase();

    return buildings.filter(building => {
      // Search across multiple fields
      const searchFields = [
        building.buildingTitle,
        building.projectTitle,
        building.desc,
        building.buildingType,
        building.position // location-like field
      ];

      return searchFields.some(field =>
        field && field.toString().toLowerCase().includes(term)
      );
    });
  }, []);

  // Filter function
  const filterBuildings = useCallback((buildings, filters) => {
    return buildings.filter(building => {
      // Building type filter
      if (filters.buildingTypes.length > 0) {
        const buildingType = building.buildingType?.toLowerCase() || '';
        const matchesType = filters.buildingTypes.some(type => {
          if (type === 'single-storey') return buildingType.includes('single');
          if (type === 'multi-storey') return buildingType.includes('multi') || buildingType.includes('double');
          if (type === 'commercial') return buildingType.includes('commercial');
          return false;
        });
        if (!matchesType) return false;
      }

      // Specifications filters
      const summary = building.buildingSummary || {};

      // Levels filter
      if (filters.levels.length > 0) {
        const levels = parseInt(summary.levels || summary.level || '1');
        const matchesLevels = filters.levels.some(level => {
          if (level === '1') return levels === 1;
          if (level === '2') return levels === 2;
          if (level === '3') return levels >= 3;
          return false;
        });
        if (!matchesLevels) return false;
      }

      // Baths filter
      if (filters.baths.length > 0) {
        const baths = parseInt(summary.baths || '0');
        const matchesBaths = filters.baths.some(bath => {
          if (bath === '4+') return baths >= 4;
          return baths === parseInt(bath);
        });
        if (!matchesBaths) return false;
      }

      // Beds filter
      if (filters.beds.length > 0) {
        const beds = parseInt(summary.beds || '0');
        const matchesBeds = filters.beds.some(bed => {
          if (bed === '5+') return beds >= 5;
          return beds === parseInt(bed);
        });
        if (!matchesBeds) return false;
      }

      // Area filter
      if (filters.areas.length > 0) {
        const area = parseInt(summary.area || '0');
        const matchesArea = filters.areas.some(areaRange => {
          if (areaRange === '0-150') return area < 150;
          if (areaRange === '150-250') return area >= 150 && area < 250;
          if (areaRange === '250-350') return area >= 250 && area < 350;
          if (areaRange === '350+') return area >= 350;
          return false;
        });
        if (!matchesArea) return false;
      }

      // Length filter
      if (filters.lengths.length > 0) {
        const length = parseInt(summary.length || '0');
        const matchesLength = filters.lengths.some(lengthRange => {
          if (lengthRange === '0-15') return length < 15;
          if (lengthRange === '15-25') return length >= 15 && length < 25;
          if (lengthRange === '25-35') return length >= 25 && length < 35;
          if (lengthRange === '35+') return length >= 35;
          return false;
        });
        if (!matchesLength) return false;
      }

      // Width filter
      if (filters.widths.length > 0) {
        const width = parseInt(summary.width || '0');
        const matchesWidth = filters.widths.some(widthRange => {
          if (widthRange === '0-10') return width < 10;
          if (widthRange === '10-15') return width >= 10 && width < 15;
          if (widthRange === '15-20') return width >= 15 && width < 20;
          if (widthRange === '20+') return width >= 20;
          return false;
        });
        if (!matchesWidth) return false;
      }

      return true;
    });
  }, []);

  // Apply search and filters whenever they change
  useEffect(() => {
    let result = allBuildings;

    // Apply search first
    result = searchBuildings(result, searchTerm);

    // Then apply filters
    result = filterBuildings(result, filters);

    setFilteredBuildings(result);
  }, [allBuildings, searchTerm, filters, searchBuildings, filterBuildings]);

  // Handle search changes
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Handle filter changes
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  // Get active filters count
  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((total, filterArray) => total + filterArray.length, 0);
  };

//   console.log('filteredBuildings:', filteredBuildings);

  return (
    <PagesWrapper>
      <div className="flex flex-col text-gray-600 h-full w-full md:px-10 px-4 py-6">
        {/* Building List */}
        <div className="flex-1 overflow-y-auto">
          <BuildingList
            buildings={filteredBuildings}
            loading={loading}
            error={error}
            searchTerm={searchTerm}
            activeFiltersCount={getActiveFiltersCount()}
          />
        </div>
      </div>
    </PagesWrapper>
  );
}
