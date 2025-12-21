'use client';

import Link from 'next/link';
import { 
  MdAdd, 
  MdFolder, 
  MdPeople, 
  MdPhotoLibrary,
  MdBusiness,
  MdShoppingCart
} from 'react-icons/md';

const quickActions = [
  {
    name: 'Add Project',
    description: 'Create a new building project',
    href: '/admin/projects/add-project',
    icon: MdAdd,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    name: 'View Projects',
    description: 'Manage existing projects',
    href: '/admin/projects',
    icon: MdFolder,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    name: 'Add Development',
    description: 'Create a new development',
    href: '/admin/developments/add-development',
    icon: MdBusiness,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    name: 'Manage Users',
    description: 'View and manage users',
    href: '/admin/users',
    icon: MdPeople,
    color: 'bg-orange-500 hover:bg-orange-600'
  },
  {
    name: 'Media Library',
    description: 'Browse uploaded files',
    href: '/admin/media',
    icon: MdPhotoLibrary,
    color: 'bg-pink-500 hover:bg-pink-600'
  },
  {
    name: 'Products',
    description: 'Manage product listings',
    href: '/admin/products',
    icon: MdShoppingCart,
    color: 'bg-teal-500 hover:bg-teal-600'
  }
];

export default function QuickActionsCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Link
              key={action.name}
              href={action.href}
              className={`${action.color} text-white p-4 rounded-lg transition-colors flex flex-col items-center text-center group`}
            >
              <Icon className="text-2xl mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{action.name}</span>
              <span className="text-xs opacity-80 mt-1 hidden md:block">
                {action.description}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

