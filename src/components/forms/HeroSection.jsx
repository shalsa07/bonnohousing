'use client';

import { useState } from 'react';
import HeroArraySection from './HeroArraySection';
import { storage, auth } from '@/libs/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInAnonymously } from 'firebase/auth';
import { useEffect } from 'react';

/**
 * HeroSection Component
 * Manages hero content including heroImages (max 2), drawings, and heroFeatured arrays
 * Each item has: name, url, priority
 * Files are automatically uploaded to Firebase Storage
 */
export default function HeroSection({
  hero,
  onHeroChange,
  projectTitle = 'untitled',
  disabled = false
}) {
  // Ensure we are authenticated anonymously to satisfy storage rules
  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      console.error("Failed to sign in anonymously for storage access:", error);
    });
  }, []);

  // Local state for new item inputs
  const [newHeroImage, setNewHeroImage] = useState({ name: '', url: '', priority: 0, description: '' });
  const [newDrawing, setNewDrawing] = useState({ name: '', url: '', priority: 0, description: '' });
  const [newFeatured, setNewFeatured] = useState({ name: '', url: '', priority: 0, description: '' });

  // Maximum allowed hero images
  const MAX_HERO_IMAGES = 2;
  const heroImagesCount = hero?.heroImages?.length || 0;
  const canAddHeroImage = heroImagesCount < MAX_HERO_IMAGES;

  // Upload file to Firebase Storage
  const uploadToFirebase = async (file, fieldName, setNewItem) => {
    const sanitizedProjectTitle = (projectTitle || 'untitled').replace(/[^a-zA-Z0-9-_ ]/g, '');
    const storagePath = `bonnohousing/houses/${sanitizedProjectTitle}/hero/${fieldName}/${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setNewItem(prev => ({ ...prev, uploadProgress: progress }));
        },
        (error) => {
          console.error('Upload error:', error);
          setNewItem(prev => ({ ...prev, uploadError: `Failed to upload ${file.name}`, uploading: false }));
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  };

  // Handle adding a new hero image (only if uploaded to Firebase)
  const handleAddHeroImage = () => {
    if (!canAddHeroImage) return;
    if (!newHeroImage.url || newHeroImage.uploading) return;
    // Only add if URL is a Firebase URL (not a blob URL)
    if (newHeroImage.url.startsWith('blob:')) return;

    const { file, uploading, uploadProgress, uploadError, ...cleanItem } = newHeroImage;
    const updatedHero = {
      ...hero,
      heroImages: [...(hero?.heroImages || []), cleanItem]
    };
    onHeroChange(updatedHero);
    setNewHeroImage({ name: '', url: '', priority: 0, description: '' });
  };

  // Handle removing a hero image
  const handleRemoveHeroImage = (index) => {
    const updatedHero = {
      ...hero,
      heroImages: hero.heroImages.filter((_, i) => i !== index)
    };
    onHeroChange(updatedHero);
  };

  // Handle adding a new drawing (only if uploaded to Firebase)
  const handleAddDrawing = () => {
    if (!newDrawing.url || newDrawing.uploading) return;
    if (newDrawing.url.startsWith('blob:')) return;

    const { file, uploading, uploadProgress, uploadError, ...cleanItem } = newDrawing;
    const updatedHero = {
      ...hero,
      drawings: [...(hero?.drawings || []), cleanItem]
    };
    onHeroChange(updatedHero);
    setNewDrawing({ name: '', url: '', priority: 0, description: '' });
  };

  // Handle removing a drawing
  const handleRemoveDrawing = (index) => {
    const updatedHero = {
      ...hero,
      drawings: hero.drawings.filter((_, i) => i !== index)
    };
    onHeroChange(updatedHero);
  };

  // Handle adding a new featured item (only if uploaded to Firebase)
  const handleAddFeatured = () => {
    if (!newFeatured.url || newFeatured.uploading) return;
    if (newFeatured.url.startsWith('blob:')) return;

    const { file, uploading, uploadProgress, uploadError, ...cleanItem } = newFeatured;
    const updatedHero = {
      ...hero,
      heroFeatured: [...(hero?.heroFeatured || []), cleanItem]
    };
    onHeroChange(updatedHero);
    setNewFeatured({ name: '', url: '', priority: 0, description: '' });
  };

  // Handle removing a featured item
  const handleRemoveFeatured = (index) => {
    const updatedHero = {
      ...hero,
      heroFeatured: hero.heroFeatured.filter((_, i) => i !== index)
    };
    onHeroChange(updatedHero);
  };

  // Handle file upload for hero images with Firebase
  const handleHeroImageUpload = async (e) => {
    if (!canAddHeroImage) return;
    const file = e.target.files[0];
    if (!file) return;

    // Create preview and start upload
    const previewUrl = URL.createObjectURL(file);
    setNewHeroImage(prev => ({
      ...prev,
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: previewUrl,
      file: file,
      uploading: true,
      uploadProgress: 0
    }));

    try {
      const downloadURL = await uploadToFirebase(file, 'heroImages', setNewHeroImage);
      URL.revokeObjectURL(previewUrl);
      setNewHeroImage(prev => ({
        ...prev,
        url: downloadURL,
        uploading: false,
        file: null
      }));
    } catch (err) {
      console.error('Hero image upload failed:', err);
    }
    e.target.value = '';
  };

  // Handle file upload for drawings with Firebase
  const handleDrawingUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setNewDrawing(prev => ({
      ...prev,
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: previewUrl,
      file: file,
      uploading: true,
      uploadProgress: 0
    }));

    try {
      const downloadURL = await uploadToFirebase(file, 'drawings', setNewDrawing);
      URL.revokeObjectURL(previewUrl);
      setNewDrawing(prev => ({
        ...prev,
        url: downloadURL,
        uploading: false,
        file: null
      }));
    } catch (err) {
      console.error('Drawing upload failed:', err);
    }
    e.target.value = '';
  };

  // Handle file upload for featured with Firebase
  const handleFeaturedUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setNewFeatured(prev => ({
      ...prev,
      name: file.name.replace(/\.[^/.]+$/, ''),
      url: previewUrl,
      file: file,
      uploading: true,
      uploadProgress: 0
    }));

    try {
      const downloadURL = await uploadToFirebase(file, 'heroFeatured', setNewFeatured);
      URL.revokeObjectURL(previewUrl);
      setNewFeatured(prev => ({
        ...prev,
        url: downloadURL,
        uploading: false,
        file: null
      }));
    } catch (err) {
      console.error('Featured upload failed:', err);
    }
    e.target.value = '';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Hero Content</h2>
      <p className="text-sm text-gray-500 mb-4">
        Files upload to Firebase: <code className="bg-gray-100 px-1 rounded">bonnohousing/houses/{projectTitle || 'untitled'}/hero/</code>
      </p>

      {/* Hero Images Section */}
      <HeroArraySection
        title="Hero Images"
        items={hero?.heroImages || []}
        newItem={newHeroImage}
        setNewItem={setNewHeroImage}
        onAdd={handleAddHeroImage}
        onRemove={handleRemoveHeroImage}
        onUpdateItem={(index, updatedItem) => {
          const newItems = [...(hero?.heroImages || [])];
          newItems[index] = updatedItem;
          onHeroChange({ ...hero, heroImages: newItems });
        }}
        onFileUpload={handleHeroImageUpload}
        disabled={disabled}
        maxItems={MAX_HERO_IMAGES}
        currentCount={heroImagesCount}
        canAdd={canAddHeroImage}
        acceptTypes="image/*"
      />

      {/* Drawings Section */}
      <HeroArraySection
        title="Drawings"
        items={hero?.drawings || []}
        newItem={newDrawing}
        setNewItem={setNewDrawing}
        onAdd={handleAddDrawing}
        onRemove={handleRemoveDrawing}
        onUpdateItem={(index, updatedItem) => {
          const newItems = [...(hero?.drawings || [])];
          newItems[index] = updatedItem;
          onHeroChange({ ...hero, drawings: newItems });
        }}
        onFileUpload={handleDrawingUpload}
        disabled={disabled}
        acceptTypes="image/*,.pdf"
      />

      {/* Hero Featured Section */}
      <HeroArraySection
        title="Hero Featured"
        items={hero?.heroFeatured || []}
        newItem={newFeatured}
        setNewItem={setNewFeatured}
        onAdd={handleAddFeatured}
        onRemove={handleRemoveFeatured}
        onUpdateItem={(index, updatedItem) => {
          const newItems = [...(hero?.heroFeatured || [])];
          newItems[index] = updatedItem;
          onHeroChange({ ...hero, heroFeatured: newItems });
        }}
        onFileUpload={handleFeaturedUpload}
        disabled={disabled}
        acceptTypes="image/*"
      />
    </div>
  );
}
