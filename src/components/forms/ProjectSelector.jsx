'use client';

import { useState, useEffect } from 'react';

/**
 * ProjectSelector Component
 * Allows users to select existing projects and assign them priority
 * for inclusion in a development
 */
export default function ProjectSelector({
  selectedProjects = [],
  onProjectsChange,
  disabled = false
}) {
  const [availableProjects, setAvailableProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPriority, setNewPriority] = useState(0);

  // Fetch available projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setAvailableProjects(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Filter projects based on search query
  const filteredProjects = availableProjects.filter(project => {
    const title = project.projectTitle || project.buildingTitle || '';
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Get projects that haven't been selected yet
  const unselectedProjects = filteredProjects.filter(
    project => !selectedProjects.some(sp => sp.projectId === project._id)
  );

  // Add a project to selection
  const handleAddProject = (project) => {
    const projectName = project.projectTitle || project.buildingTitle || 'Unnamed Project';
    const newProject = {
      name: projectName,
      priority: newPriority,
      projectId: project._id
    };
    onProjectsChange([...selectedProjects, newProject]);
    setNewPriority(0);
  };

  // Remove a project from selection
  const handleRemoveProject = (index) => {
    const updated = selectedProjects.filter((_, i) => i !== index);
    onProjectsChange(updated);
  };

  // Update project priority
  const handlePriorityChange = (index, priority) => {
    const updated = selectedProjects.map((proj, i) =>
      i === index ? { ...proj, priority: parseInt(priority) || 0 } : proj
    );
    onProjectsChange(updated);
  };

  // Sort selected projects by priority
  const sortedSelectedProjects = [...selectedProjects].sort((a, b) => a.priority - b.priority);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Projects in Development</h2>

      {/* Currently Selected Projects */}
      {selectedProjects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-600 mb-3">Selected Projects</h3>
          <div className="space-y-2">
            {sortedSelectedProjects.map((project, index) => {
              const originalIndex = selectedProjects.findIndex(p => p.projectId === project.projectId);
              return (
                <div
                  key={project.projectId}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-md border border-blue-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{project.name}</p>
                    <p className="text-xs text-gray-500">ID: {project.projectId}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-500">Priority:</label>
                    <input
                      type="number"
                      value={project.priority}
                      onChange={(e) => handlePriorityChange(originalIndex, e.target.value)}
                      min="0"
                      max="100"
                      disabled={disabled}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(originalIndex)}
                    disabled={disabled}
                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Project Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="text-md font-medium text-gray-600 mb-3">Add Project</h3>

        {/* Search Input */}
        <div className="mb-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title..."
            disabled={disabled || loading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}

        {/* Loading State */}
        {loading && (
          <p className="text-sm text-gray-500 mb-3">Loading projects...</p>
        )}

        {/* Available Projects List */}
        {!loading && unselectedProjects.length > 0 && (
          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
            {unselectedProjects.map((project) => (
              <div
                key={project._id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {project.projectTitle || project.buildingTitle || 'Unnamed'}
                  </p>
                  <p className="text-xs text-gray-500">{project.buildingType || 'No type'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={newPriority}
                    onChange={(e) => setNewPriority(parseInt(e.target.value) || 0)}
                    min="0"
                    placeholder="Priority"
                    disabled={disabled}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddProject(project)}
                    disabled={disabled}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Projects Available */}
        {!loading && unselectedProjects.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            {searchQuery ? 'No matching projects found' : 'No more projects available to add'}
          </p>
        )}
      </div>
    </div>
  );
}

