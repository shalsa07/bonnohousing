'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPageWrapper from '@/components/admin/AdminPageWrapper';
import Link from 'next/link';
import BuildingBasicInfo from '@/components/forms/BuildingBasicInfo';
import BuildingSummary from '@/components/forms/BuildingSummary';
import SiteSections from '@/components/forms/SiteSections';
import BuildingHighlights from '@/components/forms/BuildingHighlights';
import ColorManager from '@/components/forms/ColorManager';
import HeroSection from '@/components/forms/HeroSection';
import ProjectFileUploads from '@/components/forms/ProjectFileUploads';
import { MdArrowBack, MdOpenInNew } from 'react-icons/md';
import ExperienceWorldAdmin from '@/components/experience-new/ExperienceWorldAdmin';

export default function EditProjectPage({ params }) {
  const router = useRouter();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [id, setId] = useState(null);

  const [activeTab, setActiveTab] = useState('basic');

  // Consolidated file states for ProjectFileUploads component
  const [fileStates, setFileStates] = useState({
    hideLevel: [],
    modelsFiles: [],
    supportFiles: [],
    roomSnaps: [],
    _360sImages: [],
    renders: [],
    drawings: [],
    constructionDrawings: [],
    presentationDrawings: []
  });

  // Track which file fields have been saved to database
  const [savedFields, setSavedFields] = useState({
    hideLevel: true,
    modelsFiles: true,
    supportFiles: true,
    roomSnaps: true,
    _360sImages: true,
    renders: true,
    drawings: true,
    constructionDrawings: true,
    presentationDrawings: true
  });

  // Get the ID from params
  useEffect(() => {
    const getId = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    getId();
  }, [params]);

  // Fetch building data
  useEffect(() => {
    if (!id) return;

    const fetchBuilding = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/buildings/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error('Failed to fetch project');
        }

        const data = await response.json();
        setBuilding(data);

        // Populate file states from existing building data
        setFileStates({
          hideLevel: Array.isArray(data.hideLevel) ? data.hideLevel : [],
          modelsFiles: Array.isArray(data.modelsFiles) ? data.modelsFiles : [],
          supportFiles: Array.isArray(data.supportFiles) ? data.supportFiles : [],
          roomSnaps: Array.isArray(data.roomSnaps) ? data.roomSnaps : [],
          _360sImages: Array.isArray(data._360sImages) ? data._360sImages : [],
          renders: Array.isArray(data.renders) ? data.renders : [],
          drawings: Array.isArray(data.drawings) ? data.drawings : [],
          constructionDrawings: Array.isArray(data.constructionDrawings) ? data.constructionDrawings : [],
          presentationDrawings: Array.isArray(data.presentationDrawings) ? data.presentationDrawings : []
        });
      } catch (err) {
        setError(err.message);
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilding();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBuilding(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSummaryChange = (e) => {
    const { name, value } = e.target;
    setBuilding(prev => ({
      ...prev,
      buildingSummary: {
        ...prev.buildingSummary,
        [name]: value
      }
    }));
  };

  const handleAddSiteSection = (section) => {
    setBuilding(prev => ({
      ...prev,
      siteSection: [...(prev.siteSection || []), section]
    }));
  };

  const handleRemoveSiteSection = (index) => {
    setBuilding(prev => ({
      ...prev,
      siteSection: prev.siteSection.filter((_, i) => i !== index)
    }));
  };

  const handleAddHighlight = (highlight) => {
    setBuilding(prev => ({
      ...prev,
      buildingHighlights: [...(prev.buildingHighlights || []), highlight]
    }));
  };

  const handleRemoveHighlight = (index) => {
    setBuilding(prev => ({
      ...prev,
      buildingHighlights: prev.buildingHighlights.filter((_, i) => i !== index)
    }));
  };

  // Handle adding a new color with new structure
  const handleAddColor = () => {
    setBuilding(prev => ({
      ...prev,
      colors: [...(prev.colors || []), { color: '#ffffff', materialProperty: '', id: (prev.colors || []).length + 1 }]
    }));
  };

  // Handle removing a color by index
  const handleRemoveColor = (index) => {
    setBuilding(prev => ({
      ...prev,
      colors: (prev.colors || []).filter((_, i) => i !== index)
    }));
  };

  // Handle updating a color (supports both old string format and new object format)
  const handleColorChange = (index, colorData) => {
    setBuilding(prev => ({
      ...prev,
      colors: (prev.colors || []).map((color, i) =>
        i === index ? { ...color, ...colorData } : color
      )
    }));
  };

  // Handle hero content changes
  const handleHeroChange = (updatedHero) => {
    setBuilding(prev => ({
      ...prev,
      hero: updatedHero
    }));
  };

  // Handle saving a specific file field to database
  const handleSaveField = async (fieldName, files) => {
    try {
      // Helper to clean file arrays
      const cleanFileArray = (arr, withPriority = false) =>
        (Array.isArray(arr) ? arr : [])
          .filter(item => item.url && !item.uploading && !item.uploadFailed)
          .map(({ file, preview, uploading, uploadFailed, pendingSave, uploadedAt, ...rest }) => ({
            name: rest.name || '',
            url: rest.url || '',
            ...(withPriority && { priority: parseInt(rest.priority) || 0 })
          }));

      const withPriority = ['hideLevel', 'modelsFiles', 'supportFiles', 'roomSnaps', '_360sImages', 'renders'].includes(fieldName);
      const cleanedFiles = cleanFileArray(files, withPriority);

      // Update just this field in the database
      const response = await fetch(`/api/buildings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [fieldName]: cleanedFiles }),
      });

      if (!response.ok) {
        throw new Error('Failed to save files');
      }

      // Mark field as saved
      setSavedFields(prev => ({ ...prev, [fieldName]: true }));

      // Update file states
      setFileStates(prev => ({
        ...prev,
        [fieldName]: files.map(f => ({ ...f, pendingSave: false }))
      }));

      console.log(`Field ${fieldName} saved with ${cleanedFiles.length} files`);
    } catch (err) {
      console.error('Error saving field:', err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!building) return;

    try {
      setSaving(true);
      setError(null);
      setSuccessMessage('');

      // Helper to clean file arrays - only include files that have been uploaded to Firebase
      const cleanFileArray = (arr, withPriority = false) =>
        (Array.isArray(arr) ? arr : [])
          .filter(item => item.url && !item.uploading && !item.uploadFailed) // Only include uploaded files
          .map(({ file, preview, uploading, uploadFailed, ...rest }) => ({
            name: rest.name || '',
            url: rest.url || '',
            ...(withPriority && { priority: parseInt(rest.priority) || 0 })
          }));

      // Remove _id from building data (MongoDB doesn't allow updating _id)
      const { _id, createdAt, updatedAt, ...buildingWithoutId } = building;

      // Merge building data with file states
      const buildingData = {
        ...buildingWithoutId,
        hideLevel: cleanFileArray(fileStates.hideLevel, true),
        modelsFiles: cleanFileArray(fileStates.modelsFiles, true),
        supportFiles: cleanFileArray(fileStates.supportFiles, true),
        roomSnaps: cleanFileArray(fileStates.roomSnaps, true),
        _360sImages: cleanFileArray(fileStates._360sImages, true),
        renders: cleanFileArray(fileStates.renders, true),
        constructionDrawings: cleanFileArray(fileStates.constructionDrawings),
        presentationDrawings: cleanFileArray(fileStates.presentationDrawings)
      };

      const response = await fetch(`/api/buildings/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update project');
      }

      const updatedBuilding = await response.json();
      setBuilding(updatedBuilding);
      setSuccessMessage('Project updated successfully!');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
      console.error('Error updating project:', err);
    } finally {
      setSaving(false);
    }
  };

  console.log(fileStates)

  if (loading) {
    return (
      <AdminPageWrapper title="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading project...</div>
        </div>
      </AdminPageWrapper>
    );
  }

  if (error && !building) {
    return (
      <AdminPageWrapper title="Error">
        <div className="flex flex-col items-center justify-center h-64">
          <div className="text-red-500 mb-4">Error: {error}</div>
          <Link
            href="/admin/projects"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            Back to Projects
          </Link>
        </div>
      </AdminPageWrapper>
    );
  }

  if (!building) {
    return (
      <AdminPageWrapper title="Project Not Found">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Project not found</div>
        </div>
      </AdminPageWrapper>
    );
  }

  return (
    <AdminPageWrapper title={building.buildingTitle || 'Edit Project'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Edit Project: {building.buildingTitle}
          </h1>
          <p className="text-gray-600 mt-1">Update project details and files</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MdArrowBack />
            Back to Projects
          </Link>
          <Link
            href={`/projects/${id}`}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            target="_blank"
          >
            <MdOpenInNew />
            View Live
          </Link>
        </div>
      </div>

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

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'basic', name: 'Basic Info' },
                { id: 'files', name: 'Files & Media' },
                { id: 'advanced', name: 'Advanced' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto">
          {activeTab === 'basic' && (
            <>
              {/* Basic Information */}
              <BuildingBasicInfo
                formData={building}
                handleChange={handleInputChange}
                disabled={saving}
              />

              {/* Building Summary */}
              <BuildingSummary
                buildingSummary={building.buildingSummary || {}}
                handleSummaryChange={handleSummaryChange}
                disabled={saving}
              />

              {/* Site Sections */}
              <SiteSections
                siteSection={building.siteSection || []}
                onAddSection={handleAddSiteSection}
                onRemoveSection={handleRemoveSiteSection}
                disabled={saving}
              />

              {/* Building Highlights */}
              <BuildingHighlights
                buildingHighlights={building.buildingHighlights || []}
                onAddHighlight={handleAddHighlight}
                onRemoveHighlight={handleRemoveHighlight}
                disabled={saving}
              />

              {/* Project Colors */}
              <ColorManager
                colors={building.colors || []}
                onAddColor={handleAddColor}
                onRemoveColor={handleRemoveColor}
                onColorChange={handleColorChange}
                disabled={saving}
              />

              {/* Hero Content Section */}
              <HeroSection
                hero={building.hero || { heroImages: [], drawings: [], heroFeatured: [] }}
                onHeroChange={handleHeroChange}
                projectTitle={building?.projectTitle}
                disabled={saving}
              />
            </>
          )}

          {activeTab === 'files' && (
            <ProjectFileUploads
              fileStates={fileStates}
              onFileStatesChange={setFileStates}
              onSaveField={handleSaveField}
              projectTitle={building?.projectTitle}
              disabled={saving}
              savedFields={savedFields}
            />
          )}

          {activeTab === 'advanced' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Advanced Settings</h2>
              <p className="text-gray-600">Advanced configuration options will be available here.</p>
              <div className='w-full h-full'>
                <ExperienceWorldAdmin data={building} />
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
    </AdminPageWrapper>
  );
}
