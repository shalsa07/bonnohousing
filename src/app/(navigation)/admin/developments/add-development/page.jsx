'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PagesWrapper from '@/components/PagesWrapper';
import Link from 'next/link';
import HeroSection from '@/components/forms/HeroSection';
import ProjectSelector from '@/components/forms/ProjectSelector';

export default function AddDevelopmentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  // Hero state with structure: { heroImages: [], drawings: [], heroFeatured: [] }
  const [hero, setHero] = useState({
    heroImages: [],
    drawings: [],
    heroFeatured: []
  });

  // Projects array: [{ name, priority, projectId }]
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleHeroChange = (updatedHero) => {
    setHero(updatedHero);
  };

  const handleProjectsChange = (updatedProjects) => {
    setProjects(updatedProjects);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      setError('Please enter a development title');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a development description');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      // Clean hero data - remove file objects and upload state before sending
      const cleanHero = {
        heroImages: hero.heroImages.map(({ file, uploading, uploadProgress, uploadError, ...rest }) => rest),
        drawings: hero.drawings.map(({ file, uploading, uploadProgress, uploadError, ...rest }) => rest),
        heroFeatured: hero.heroFeatured.map(({ file, uploading, uploadProgress, uploadError, ...rest }) => rest)
      };

      // Check if any hero files are still uploading
      const isUploading = [
        ...hero.heroImages,
        ...hero.drawings,
        ...hero.heroFeatured
      ].some(item => item.uploading);

      if (isUploading) {
        setError('Please wait for all files to finish uploading');
        setLoading(false);
        return;
      }

      const developmentData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        hero: cleanHero,
        projects: projects.map(({ name, priority, projectId }) => ({
          name,
          priority: parseInt(priority) || 0,
          projectId
        }))
      };

      const response = await fetch('/api/developments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(developmentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create development');
      }

      const newDevelopment = await response.json();
      setSuccessMessage('Development created successfully!');

      // Redirect to developments list after 2 seconds
      setTimeout(() => {
        router.push('/admin/developments');
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error('Error creating development:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PagesWrapper>
      <div className="admin-add-development flex flex-col text-gray-500 h-full w-full px-10 py-5">
        <div className="flex w-full justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-500">Add New Development</h1>
          <Link
            href="/admin/developments"
            className="text-sm bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Back to Developments
          </Link>
        </div>

        <hr className="border-gray-300 mb-4 w-full" />

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto">
          {/* Basic Information */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Development Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter development title"
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter development description"
                  rows={4}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Hero Content Section */}
          <HeroSection
            hero={hero}
            onHeroChange={handleHeroChange}
            projectTitle={formData.title || 'development'}
            disabled={loading}
          />

          {/* Projects Section */}
          <ProjectSelector
            selectedProjects={projects}
            onProjectsChange={handleProjectsChange}
            disabled={loading}
          />

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pb-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Development'}
            </button>
          </div>
        </form>
      </div>
    </PagesWrapper>
  );
}

