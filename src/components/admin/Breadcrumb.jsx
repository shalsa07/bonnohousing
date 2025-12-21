'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdChevronRight, MdHome } from 'react-icons/md';

const pathNameMap = {
  'admin': 'Dashboard',
  'projects': 'Projects',
  'developments': 'Developments',
  'products': 'Products',
  'users': 'Users',
  'media': 'Media Library',
  'analytics': 'Analytics',
  'settings': 'Settings',
  'add-project': 'Add Project',
  'add-development': 'Add Development',
  'add': 'Add New',
};

export default function Breadcrumb({ customTitle }) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const isLast = index === pathSegments.length - 1;
    
    // Check if it's an ID (MongoDB ObjectId pattern)
    const isId = /^[a-f0-9]{24}$/i.test(segment);
    
    let label = pathNameMap[segment] || segment;
    
    // If it's the last segment and we have a custom title, use it
    if (isLast && customTitle) {
      label = customTitle;
    } else if (isId) {
      label = 'Edit';
    }

    return { href, label, isLast };
  });

  return (
    <nav className="flex items-center text-sm text-gray-500 mb-4">
      <Link 
        href="/admin" 
        className="flex items-center hover:text-blue-600 transition-colors"
      >
        <MdHome className="text-lg" />
      </Link>
      
      {breadcrumbs.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center">
          <MdChevronRight className="mx-2 text-gray-400" />
          {crumb.isLast ? (
            <span className="text-gray-700 font-medium">{crumb.label}</span>
          ) : (
            <Link 
              href={crumb.href}
              className="hover:text-blue-600 transition-colors capitalize"
            >
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}

