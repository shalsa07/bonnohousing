'use client';

import PlaceholderPage from '@/components/admin/PlaceholderPage';
import { MdPhotoLibrary } from 'react-icons/md';

export default function MediaLibraryPage() {
  return (
    <PlaceholderPage
      title="Media Library"
      description="Browse, organize, and manage all uploaded media files including images, 3D models, and documents."
      icon={MdPhotoLibrary}
      features={[
        'Grid/list view of all uploaded files',
        'Search and filter by file type',
        'Bulk upload capabilities',
        'File organization with folders/tags',
        'Image preview and editing',
        '3D model preview',
        'Storage usage monitoring',
        'Batch delete and move operations',
        'Direct link copying'
      ]}
      expectedDate="Q1 2024"
    />
  );
}

