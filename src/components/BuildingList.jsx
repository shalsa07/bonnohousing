'use client';

import LinkCard from './LinkCard';

export default function BuildingList({ 
  buildings = [], 
  loading = false, 
  error = null, 
  searchTerm = '', 
  activeFiltersCount = 0 
}) {
  
  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500 text-lg">Loading buildings...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="text-red-500 text-center">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium mb-2">Error Loading Buildings</h3>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  // No results state
  if (buildings.length === 0) {
    const hasActiveSearch = searchTerm.trim().length > 0;
    const hasActiveFilters = activeFiltersCount > 0;
    
    return (
      <div className="flex flex-col items-center justify-center h-64 w-full">
        <div className="text-gray-500 text-center">
          <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium mb-2">No Buildings Found</h3>
          {hasActiveSearch || hasActiveFilters ? (
            <div className="text-sm text-gray-600">
              <p className="mb-2">
                No buildings match your current {hasActiveSearch && hasActiveFilters ? 'search and filters' : hasActiveSearch ? 'search' : 'filters'}.
              </p>
              {hasActiveSearch && (
                <p className="mb-1">Search term: <span className="font-medium">"{searchTerm}"</span></p>
              )}
              {hasActiveFilters && (
                <p className="mb-1">{activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied</p>
              )}
              <p className="text-blue-600 mt-2">Try adjusting your search or clearing some filters.</p>
            </div>
          ) : (
            <p className="text-sm text-gray-600">No buildings are currently available.</p>
          )}
        </div>
      </div>
    );
  }

  // Results header
  const ResultsHeader = () => {
    const hasActiveSearch = searchTerm.trim().length > 0;
    const hasActiveFilters = activeFiltersCount > 0;
    
    if (!hasActiveSearch && !hasActiveFilters) {
      return (
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-medium">{buildings.length}</span> building{buildings.length !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }

    return (
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-800 font-medium">
              Found <span className="font-bold">{buildings.length}</span> building{buildings.length !== 1 ? 's' : ''}
            </p>
            <div className="text-sm text-blue-600 mt-1">
              {hasActiveSearch && (
                <span>Search: "{searchTerm}"</span>
              )}
              {hasActiveSearch && hasActiveFilters && <span> • </span>}
              {hasActiveFilters && (
                <span>{activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} applied</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Buildings grid
  return (
    <div className="w-full">
      <ResultsHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {buildings.map((building, index) => (
          <div key={building._id || index} className="h-[460px]">
            <LinkCard 
              project={building} 
              index={index} 
            />
          </div>
        ))}
      </div>
    </div>
  );
}
