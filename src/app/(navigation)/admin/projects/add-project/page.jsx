'use client';

import { useState } from 'react';
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
import { MdArrowBack } from 'react-icons/md';

export default function AddProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    projectTitle: '',
    buildingTitle: '',
    buildingType: '',
    area: '',
    desc: '',
    position: '',
    arPosition: '',
    minDistance: '',
    maxDistance: '',
    siteSection: [],
    colors: [],
  });
  
  const [buildingSummary, setBuildingSummary] = useState({
    length: '',
    width: '',
    baths: '',
    levels: '',
    cars: '',
    beds: ''
  });

  const [buildingHighlights, setBuildingHighlights] = useState([]);

  // Hero state with structure: { heroImages: [], drawings: [], heroFeatured: [] }
  const [hero, setHero] = useState({
    heroImages: [],
    drawings: [],
    heroFeatured: []
  });

  // File upload states (all managed in one object)
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
    hideLevel: false,
    modelsFiles: false,
    supportFiles: false,
    roomSnaps: false,
    _360sImages: false,
    renders: false,
    drawings: false,
    constructionDrawings: false,
    presentationDrawings: false
  });

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

  const handleSummaryChange = (e) => {
    const { name, value } = e.target;
    setBuildingSummary(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddSiteSection = (section) => {
    setFormData(prev => ({
      ...prev,
      siteSection: [...prev.siteSection, section]
    }));
  };

  const handleRemoveSiteSection = (index) => {
    setFormData(prev => ({
      ...prev,
      siteSection: prev.siteSection.filter((_, i) => i !== index)
    }));
  };

  const handleAddHighlight = (highlight) => {
    setBuildingHighlights(prev => [...prev, highlight]);
  };

  const handleRemoveHighlight = (index) => {
    setBuildingHighlights(prev => prev.filter((_, i) => i !== index));
  };

  // Handle adding a new color with new structure
  const handleAddColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, { color: '#ffffff', materialProperty: '', id: prev.colors.length + 1 }]
    }));
  };

  // Handle removing a color by index
  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  // Handle updating a color (supports both old string format and new object format)
  const handleColorChange = (index, colorData) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) =>
        i === index ? { ...color, ...colorData } : color
      )
    }));
  };

  // Handle hero content changes
  const handleHeroChange = (updatedHero) => {
    setHero(updatedHero);
  };

  // Handle saving a specific file field to database
  const handleSaveField = async (fieldName, files) => {
    // For add-project page, we just mark the field as saved locally
    // The actual save happens when the form is submitted
    setSavedFields(prev => ({
      ...prev,
      [fieldName]: true
    }));

    // Update the file states with the saved files
    setFileStates(prev => ({
      ...prev,
      [fieldName]: files.map(f => ({ ...f, pendingSave: false }))
    }));

    console.log(`Field ${fieldName} marked as saved with ${files.length} files`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.projectTitle || !formData.buildingTitle || !formData.buildingType) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');

      // Clean hero data - remove file objects before sending to API
      const cleanHero = {
        heroImages: hero.heroImages.map(({ file, ...rest }) => rest),
        drawings: hero.drawings.map(({ file, ...rest }) => rest),
        heroFeatured: hero.heroFeatured.map(({ file, ...rest }) => rest)
      };

      // Helper to clean file arrays - only include files that have been uploaded to Firebase
      const cleanFileArray = (arr, withPriority = false) =>
        (Array.isArray(arr) ? arr : [])
          .filter(item => item.url && !item.uploading && !item.uploadFailed) // Only include uploaded files
          .map(({ file, preview, uploading, uploadFailed, ...rest }) => ({
            name: rest.name || '',
            url: rest.url || '',
            ...(withPriority && { priority: parseInt(rest.priority) || 0 })
          }));

      const buildingData = {
        ...formData,
        buildingSummary,
        buildingHighlights,
        hero: cleanHero,
        // File arrays with priority
        hideLevel: cleanFileArray(fileStates.hideLevel, true),
        modelsFiles: cleanFileArray(fileStates.modelsFiles, true),
        supportFiles: cleanFileArray(fileStates.supportFiles, true),
        roomSnaps: cleanFileArray(fileStates.roomSnaps, true),
        _360sImages: cleanFileArray(fileStates._360sImages, true),
        renders: cleanFileArray(fileStates.renders, true),
        drawings: cleanFileArray(fileStates.drawings, true),
        // File arrays without priority
        presentationDrawings: cleanFileArray(fileStates.presentationDrawings),
        constructionDrawings: cleanFileArray(fileStates.constructionDrawings),
      };

      const response = await fetch('/api/buildings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const newBuilding = await response.json();
      setSuccessMessage('Project created successfully!');
      
      // Redirect to edit page after 2 seconds
      setTimeout(() => {
        router.push(`/admin/projects/${newBuilding._id}`);
      }, 2000);
    } catch (err) {
      setError(err.message);
      console.error('Error creating project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminPageWrapper title="Add Project">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Project</h1>
          <p className="text-gray-600 mt-1">Create a new building project</p>
        </div>
        <Link
          href="/admin/projects"
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <MdArrowBack />
          Back to Projects
        </Link>
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

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto">
          {/* Basic Information */}
          <BuildingBasicInfo 
            formData={formData}
            handleChange={handleInputChange}
            disabled={loading}
          />

          {/* Building Summary */}
          <BuildingSummary 
            buildingSummary={buildingSummary}
            handleSummaryChange={handleSummaryChange}
            disabled={loading}
          />

          {/* Site Sections */}
          <SiteSections 
            siteSection={formData.siteSection}
            onAddSection={handleAddSiteSection}
            onRemoveSection={handleRemoveSiteSection}
            disabled={loading}
          />

          {/* Building Highlights */}
          <BuildingHighlights
            buildingHighlights={buildingHighlights}
            onAddHighlight={handleAddHighlight}
            onRemoveHighlight={handleRemoveHighlight}
            disabled={loading}
          />

          {/* Project Colors */}
          <ColorManager
            colors={formData.colors}
            onAddColor={handleAddColor}
            onRemoveColor={handleRemoveColor}
            onColorChange={handleColorChange}
            disabled={loading}
          />

          {/* Hero Content Section */}
          <HeroSection
            hero={hero}
            onHeroChange={handleHeroChange}
            projectTitle={formData.projectTitle}
            disabled={loading}
          />

          {/* File Uploads Section */}
          <ProjectFileUploads
            fileStates={fileStates}
            onFileStatesChange={setFileStates}
            onSaveField={handleSaveField}
            projectTitle={formData.projectTitle}
            disabled={loading}
            savedFields={savedFields}
          />

          {/* Submit Button */}
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
              disabled={loading}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
    </AdminPageWrapper>
  );
}
