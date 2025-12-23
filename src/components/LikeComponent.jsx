'use client';

import { useState, useEffect } from 'react';
import { IoHeart, IoHeartOutline } from 'react-icons/io5';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * LikeComponent
 * Displays a like button with count for buildings
 * Uses browser fingerprinting to prevent duplicate votes
 * 
 * @param {string} buildingId - Required. The ID of the building to like
 * @param {number} initialLikeCount - Optional. Server-rendered initial count
 */
export default function LikeComponent({ buildingId, initialLikeCount = 0 }) {
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);
  const [visitorId, setVisitorId] = useState(null);
  const [mounted, setMounted] = useState(false);

  // Initialize FingerprintJS and check like status
  useEffect(() => {
    setMounted(true);

    const initializeFingerprint = async () => {
      try {
        // Load FingerprintJS
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const fingerprintId = result.visitorId;
        
        setVisitorId(fingerprintId);
        console.log('Visitor fingerprint loaded:', fingerprintId.substring(0, 8) + '...');

        // Check localStorage first for instant UX
        const localStorageKey = `liked_${buildingId}`;
        const likedInStorage = localStorage.getItem(localStorageKey) === 'true';
        
        if (likedInStorage) {
          setHasLiked(true);
        }

        // Verify with server
        const response = await fetch(`/api/like?buildingId=${buildingId}&visitorId=${fingerprintId}`);
        if (response.ok) {
          const data = await response.json();
          setHasLiked(data.hasLiked);
          setLikeCount(data.likeCount);
          
          // Sync localStorage with server truth
          localStorage.setItem(localStorageKey, data.hasLiked.toString());
        }
      } catch (error) {
        console.error('Error initializing fingerprint:', error);
      }
    };

    initializeFingerprint();
  }, [buildingId]);

  // Handle like button click
  const handleLike = async () => {
    if (loading || !visitorId) return;

    setLoading(true);

    try {
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buildingId,
          visitorId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();

      // Update UI optimistically
      setHasLiked(data.liked);
      setLikeCount(data.likeCount);

      // Update localStorage
      const localStorageKey = `liked_${buildingId}`;
      localStorage.setItem(localStorageKey, data.liked.toString());

      console.log(data.message);
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert optimistic update on error
      const localStorageKey = `liked_${buildingId}`;
      const previousState = localStorage.getItem(localStorageKey) === 'true';
      setHasLiked(previousState);
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`
        relative flex items-center gap-2 p-2 rounded-full
        transition-all duration-200
        ${hasLiked 
          ? 'bg-red-500 text-white hover:bg-red-600' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        shadow-md hover:shadow-lg
      `}
      aria-label={hasLiked ? 'Unlike this building' : 'Like this building'}
    >
      {hasLiked ? (
        <IoHeart className="text-2xl" />
      ) : (
        <IoHeartOutline className="text-2xl" />
      )}
      <span className="absolute text-lg z-10 text-gray-500 -top-2 -right-1 font-medium">
        {likeCount}
      </span>
    </button>
  );
}
