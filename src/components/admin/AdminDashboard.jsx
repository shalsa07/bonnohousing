'use client';

import { useState, useEffect } from 'react';
import AdminPageWrapper from './AdminPageWrapper';
import StatsCard from './dashboard/StatsCard';
import RecentActivityCard from './dashboard/RecentActivityCard';
import QuickActionsCard from './dashboard/QuickActionsCard';
import ProjectTypesCard from './dashboard/ProjectTypesCard';
import UserActivityCard from './dashboard/UserActivityCard';
import {
  MdFolder,
  MdTrendingUp,
  MdPeople,
  MdCloudUpload,
  MdRefresh
} from 'react-icons/md';

export default function AdminDashboard({ session }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/stats');

      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }

      const data = await response.json();
      setStats(data);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <AdminPageWrapper title="Dashboard" showBreadcrumb={false}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, {session?.user?.name || 'Admin'}!
            </p>
          </div>
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <MdRefresh className={`text-lg ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm">Refresh</span>
          </button>
        </div>
        {lastRefresh && (
          <p className="text-xs text-gray-400 mt-2">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatsCard
          title="Total Projects"
          value={loading ? '...' : stats?.projects?.total || 0}
          subtitle="All building projects"
          icon={MdFolder}
          color="blue"
        />
        <StatsCard
          title="Recent Projects"
          value={loading ? '...' : stats?.projects?.recentlyAdded || 0}
          subtitle="Added in last 7 days"
          icon={MdTrendingUp}
          color="green"
        />
        <StatsCard
          title="Total Users"
          value={loading ? '...' : stats?.users?.total || 0}
          subtitle={`${stats?.users?.admins || 0} admins`}
          icon={MdPeople}
          color="purple"
        />
        <StatsCard
          title="Projects with Files"
          value={loading ? '...' : stats?.projects?.withFiles || 0}
          subtitle="Have uploaded media"
          icon={MdCloudUpload}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <QuickActionsCard />
          <RecentActivityCard
            activities={stats?.recentActivity || []}
            loading={loading}
          />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6 h-fit">
          <UserActivityCard
            totalUsers={stats?.users?.total || 0}
            adminUsers={stats?.users?.admins || 0}
            regularUsers={stats?.users?.regular || 0}
            currentUser={session?.user}
            loading={loading}
          />
          <ProjectTypesCard
            projectsByType={stats?.projects?.byType || []}
            loading={loading}
          />
        </div>
      </div>
    </AdminPageWrapper>
  );
}

