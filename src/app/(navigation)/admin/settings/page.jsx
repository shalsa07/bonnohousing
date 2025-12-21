'use client';

import { useState, useEffect } from 'react';
import SiteLayoutForm from '@/components/forms/SiteLayoutForm';
import { MdSettings } from 'react-icons/md';

export default function SettingsPage() {
  const [siteLayoutData, setSiteLayoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current site layout data
  useEffect(() => {
    const fetchSiteLayout = async () => {
      try {
        const response = await fetch('/api/admin/site-layout');
        if (!response.ok) {
          throw new Error('Failed to fetch site layout');
        }
        const data = await response.json();
        setSiteLayoutData(data);
      } catch (err) {
        console.error('Error fetching site layout:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSiteLayout();
  }, []);

  // Handle save
  const handleSave = async (formData) => {
    const response = await fetch('/api/admin/site-layout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save site layout');
    }

    return response.json();
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <MdSettings className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Site Layout Management</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <MdSettings className="text-3xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Site Layout Management</h1>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          Error loading site layout: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <MdSettings className="text-3xl text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Layout Management</h1>
          <p className="text-sm text-gray-600">Configure site logos, navigation links, and content sections</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
        <p className="text-sm mb-2">
          <strong>Firebase Storage Paths:</strong>
        </p>
        <ul className="text-sm list-disc list-inside space-y-1">
          <li>
            <strong>Site assets</strong> (navbar logo, landing page logo, footer logos, president section, concept section):
            <code className="bg-blue-100 px-1 rounded ml-1">bonnohousing/site/</code>
          </li>
          <li>
            <strong>Building/house images</strong>:
            <code className="bg-blue-100 px-1 rounded ml-1">bonnohousing/houses/</code>
          </li>
        </ul>
        <p className="text-sm mt-2">
          Upload images to Firebase Storage in the appropriate folder, then paste the download URL into the form fields below.
        </p>
      </div>

      {siteLayoutData && (
        <SiteLayoutForm
          initialData={siteLayoutData}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

