'use client';

import { useState } from 'react';
import FileUpload from './FileUpload';
import RichTextEditor from './RichTextEditor';

export default function SiteLayoutForm({ initialData = {}, onSave }) {
    const [formData, setFormData] = useState({
        landingNavbarLogo: initialData.landingNavbarLogo || '',
        landingPageLogo: initialData.landingPageLogo || '',
        footerLogos: initialData.footerLogos || [],
        navbarPagesLinks: initialData.navbarPagesLinks || [],
        footerPagesLinks: initialData.footerPagesLinks || [],
        landingPageTag: initialData.landingPageTag || '',
        presidentSection: {
            image: initialData.presidentSection?.image || '',
            text: {
                title: initialData.presidentSection?.text?.title || '',
                body: initialData.presidentSection?.text?.body || ''
            }
        },
        conceptSection: {
            images: initialData.conceptSection?.images || []
        },
        buildingSection: {
            houses: initialData.buildingSection?.houses || []
        }
    });

    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Handle simple field changes
    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Handle nested field changes
    const handleNestedChange = (path, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            const keys = path.split('.');
            let current = newData;

            for (let i = 0; i < keys.length - 1; i++) {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }

            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    // Handle array field changes
    const handleArrayChange = (field, index, value) => {
        setFormData(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    };

    const addArrayItem = (field, defaultValue = '') => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], defaultValue]
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    // Handle house changes
    const addHouse = () => {
        setFormData(prev => ({
            ...prev,
            buildingSection: {
                houses: [
                    ...prev.buildingSection.houses,
                    {
                        images: [],
                        text: {
                            title: '',
                            description: ''
                        }
                    }
                ]
            }
        }));
    };

    const removeHouse = (index) => {
        setFormData(prev => ({
            ...prev,
            buildingSection: {
                houses: prev.buildingSection.houses.filter((_, i) => i !== index)
            }
        }));
    };

    const handleHouseChange = (houseIndex, field, value) => {
        setFormData(prev => {
            const newHouses = [...prev.buildingSection.houses];
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                newHouses[houseIndex] = {
                    ...newHouses[houseIndex],
                    [parent]: {
                        ...newHouses[houseIndex][parent],
                        [child]: value
                    }
                };
            } else {
                newHouses[houseIndex] = {
                    ...newHouses[houseIndex],
                    [field]: value
                };
            }
            return {
                ...prev,
                buildingSection: { houses: newHouses }
            };
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveError(null);
        setSaveSuccess(false);

        try {
            await onSave(formData);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Save error:', error);
            setSaveError(error.message || 'Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Success/Error Messages */}
            {saveSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    ✓ Settings saved successfully!
                </div>
            )}

            {saveError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    ✗ {saveError}
                </div>
            )}

            {/* Landing Navbar Logo */}
            <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Landing Navbar Logo</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                        <input
                            type="text"
                            value={formData.landingNavbarLogo}
                            onChange={(e) => handleFieldChange('landingNavbarLogo', e.target.value)}
                            placeholder="Firebase download URL or path"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {formData.landingNavbarLogo && (
                        <div className="mt-2">
                            <img
                                src={formData.landingNavbarLogo}
                                alt="Navbar Logo Preview"
                                className="h-16 object-contain border rounded p-2"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Landing Page Logo */}
            <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Landing Page Logo</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                        <input
                            type="text"
                            value={formData.landingPageLogo}
                            onChange={(e) => handleFieldChange('landingPageLogo', e.target.value)}
                            placeholder="Firebase download URL or path"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {formData.landingPageLogo && (
                        <div className="mt-2">
                            <img
                                src={formData.landingPageLogo}
                                alt="Landing Page Logo Preview"
                                className="h-20 object-contain border rounded p-2"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* Footer Logos */}
            <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Logos</h3>
                <div className="space-y-3">
                    {formData.footerLogos.map((logo, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <input
                                type="text"
                                value={logo}
                                onChange={(e) => handleArrayChange('footerLogos', index, e.target.value)}
                                placeholder="Firebase download URL or path"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {logo && (
                                <img
                                    src={logo}
                                    alt={`Footer Logo ${index + 1}`}
                                    className="h-12 object-contain border rounded p-1"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => removeArrayItem('footerLogos', index)}
                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('footerLogos', '')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        + Add Footer Logo
                    </button>
                </div>
            </section>

            {/* Navbar Pages Links */}
            <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Navbar Pages Links</h3>
                <div className="space-y-3">
                    {formData.navbarPagesLinks.map((link, index) => (
                        <div key={index} className="flex gap-3">
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => handleArrayChange('navbarPagesLinks', index, e.target.value)}
                                placeholder="Page link (e.g., 'home', 'about us')"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem('navbarPagesLinks', index)}
                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('navbarPagesLinks', '')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        + Add Navbar Link
                    </button>
                </div>
            </section>

            {/* Footer Pages Links */}
            <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Pages Links</h3>
                <div className="space-y-3">
                    {formData.footerPagesLinks.map((link, index) => (
                        <div key={index} className="flex gap-3">
                            <input
                                type="text"
                                value={link}
                                onChange={(e) => handleArrayChange('footerPagesLinks', index, e.target.value)}
                                placeholder="Page link (e.g., 'privacy policy')"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem('footerPagesLinks', index)}
                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('footerPagesLinks', '')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        + Add Footer Link
                    </button>
                </div>
            </section>

            {/* Landing Page Tag */}
            <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Landing Page Tag</h3>
                <RichTextEditor
                    value={formData.landingPageTag}
                    onChange={(value) => handleFieldChange('landingPageTag', value)}
                    placeholder="Enter landing page tagline..."
                    label="Tagline"
                />
            </section>

            {/* President Section */}
            <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">President Section</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                        <input
                            type="text"
                            value={formData.presidentSection.image}
                            onChange={(e) => handleNestedChange('presidentSection.image', e.target.value)}
                            placeholder="Firebase download URL or path"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.presidentSection.image && (
                            <div className="mt-2">
                                <img
                                    src={formData.presidentSection.image}
                                    alt="President Section Preview"
                                    className="h-32 object-cover border rounded"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                        )}
                    </div>

                    <RichTextEditor
                        value={formData.presidentSection.text.title}
                        onChange={(value) => handleNestedChange('presidentSection.text.title', value)}
                        placeholder="Enter title..."
                        label="Title"
                    />

                    <RichTextEditor
                        value={formData.presidentSection.text.body}
                        onChange={(value) => handleNestedChange('presidentSection.text.body', value)}
                        placeholder="Enter body text..."
                        label="Body"
                    />
                </div>
            </section>

            {/* Concept Section */}
            <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Concept Section Images</h3>
                <div className="space-y-3">
                    {formData.conceptSection.images.map((image, index) => (
                        <div key={index} className="flex gap-3 items-start">
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => {
                                    const newImages = [...formData.conceptSection.images];
                                    newImages[index] = e.target.value;
                                    handleNestedChange('conceptSection.images', newImages);
                                }}
                                placeholder="Firebase download URL or path"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {image && (
                                <img
                                    src={image}
                                    alt={`Concept Image ${index + 1}`}
                                    className="h-20 object-cover border rounded"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            )}
                            <button
                                type="button"
                                onClick={() => {
                                    const newImages = formData.conceptSection.images.filter((_, i) => i !== index);
                                    handleNestedChange('conceptSection.images', newImages);
                                }}
                                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            handleNestedChange('conceptSection.images', [...formData.conceptSection.images, '']);
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        + Add Concept Image
                    </button>
                </div>
            </section>

            {/* Building Section - Houses */}
            <section className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Building Section - Houses</h3>
                <div className="space-y-6">
                    {formData.buildingSection.houses.map((house, houseIndex) => (
                        <div key={houseIndex} className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-md font-semibold text-gray-800">House {houseIndex + 1}</h4>
                                <button
                                    type="button"
                                    onClick={() => removeHouse(houseIndex)}
                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                                >
                                    Remove House
                                </button>
                            </div>

                            {/* House Images */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
                                <div className="space-y-2">
                                    {(house.images || []).map((image, imgIndex) => (
                                        <div key={imgIndex} className="flex gap-2 items-start">
                                            <input
                                                type="text"
                                                value={image}
                                                onChange={(e) => {
                                                    const newImages = [...(house.images || [])];
                                                    newImages[imgIndex] = e.target.value;
                                                    handleHouseChange(houseIndex, 'images', newImages);
                                                }}
                                                placeholder="Firebase download URL or path"
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            {image && (
                                                <img
                                                    src={image}
                                                    alt={`House ${houseIndex + 1} Image ${imgIndex + 1}`}
                                                    className="h-16 object-cover border rounded"
                                                    onError={(e) => { e.target.style.display = 'none'; }}
                                                />
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const newImages = (house.images || []).filter((_, i) => i !== imgIndex);
                                                    handleHouseChange(houseIndex, 'images', newImages);
                                                }}
                                                className="px-2 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newImages = [...(house.images || []), ''];
                                            handleHouseChange(houseIndex, 'images', newImages);
                                        }}
                                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        + Add Image
                                    </button>
                                </div>
                            </div>

                            {/* House Title */}
                            <div className="mb-4">
                                <RichTextEditor
                                    value={house.text?.title || ''}
                                    onChange={(value) => handleHouseChange(houseIndex, 'text.title', value)}
                                    placeholder="Enter house title..."
                                    label="Title"
                                />
                            </div>

                            {/* House Description */}
                            <div>
                                <RichTextEditor
                                    value={house.text?.description || ''}
                                    onChange={(value) => handleHouseChange(houseIndex, 'text.description', value)}
                                    placeholder="Enter house description..."
                                    label="Description"
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addHouse}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                        + Add House
                    </button>
                </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                    type="submit"
                    disabled={saving}
                    className={`px-6 py-3 rounded-md font-semibold text-white transition-colors ${saving
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                >
                    {saving ? 'Saving...' : 'Save Site Layout Settings'}
                </button>
            </div>
        </form>
    );
}
