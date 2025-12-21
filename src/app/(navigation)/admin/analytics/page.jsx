'use client';

import PlaceholderPage from '@/components/admin/PlaceholderPage';
import { MdAnalytics } from 'react-icons/md';

export default function AnalyticsPage() {
  return (
    <PlaceholderPage
      title="Analytics"
      description="View detailed analytics and insights about your projects, user engagement, and system performance."
      icon={MdAnalytics}
      features={[
        'Project view statistics',
        'User engagement metrics',
        'File upload/download tracking',
        'Popular projects analysis',
        'Traffic sources overview',
        'Performance monitoring',
        'Custom date range reports',
        'Export reports as PDF/CSV'
      ]}
      expectedDate="Q1 2024"
    />
  );
}

