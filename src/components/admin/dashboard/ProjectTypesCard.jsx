'use client';

import { MdBusiness } from 'react-icons/md';

const colorPalette = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-red-500',
];

export default function ProjectTypesCard({ projectsByType = [], loading = false }) {
  const total = projectsByType.reduce((sum, item) => sum + item.count, 0);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Projects by Type</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex justify-between mb-1">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-8"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <MdBusiness className="text-xl text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-700">Projects by Type</h3>
      </div>
      
      {projectsByType.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No projects yet</p>
      ) : (
        <div className="space-y-4">
          {projectsByType.map((item, index) => {
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
            const barColor = colorPalette[index % colorPalette.length];
            
            return (
              <div key={item._id || index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {item._id || 'Uncategorized'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.count} ({percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${barColor} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Total Projects</span>
              <span className="font-bold text-gray-900">{total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

