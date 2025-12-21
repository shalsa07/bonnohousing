'use client';

import { MdPeople, MdAdminPanelSettings, MdPerson } from 'react-icons/md';

export default function UserActivityCard({
  totalUsers = 0,
  adminUsers = 0,
  regularUsers = 0,
  currentUser,
  loading = false
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">User Overview</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <MdPeople className="text-xl text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-700">User Overview</h3>
      </div>

      {/* Current User Card */}
      {currentUser && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 mb-4 text-white">
          <div className="flex items-center gap-3">
            {currentUser.image ? (
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="w-12 h-12 rounded-full border-2 border-white/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <MdPerson className="text-2xl" />
              </div>
            )}
            <div>
              <p className="font-medium">{currentUser.name}</p>
              <p className="text-sm opacity-80">{currentUser.email}</p>
              <span className="inline-flex items-center gap-1 text-xs bg-white/20 px-2 py-0.5 rounded-full mt-1">
                <MdAdminPanelSettings className="text-sm" />
                {currentUser.role || 'User'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-3 text-center mb-10">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
          <p className="text-xs text-gray-500">Total Users</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-blue-600">{adminUsers}</p>
          <p className="text-xs text-gray-500">Admins</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-2xl font-bold text-green-600">{regularUsers}</p>
          <p className="text-xs text-gray-500">Regular</p>
        </div>
      </div>
    </div>
  );
}

