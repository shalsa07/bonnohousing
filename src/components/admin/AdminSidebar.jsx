'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MdDashboard,
  MdFolder,
  MdPeople,
  MdSettings,
  MdAnalytics,
  MdPhotoLibrary,
  MdBusiness,
  MdShoppingCart,
  MdSwapHoriz
} from 'react-icons/md';

const navItems = [
  { name: 'Dashboard', href: '/admin', icon: MdDashboard },
  { name: 'Projects', href: '/admin/projects', icon: MdFolder },
  { name: 'Developments', href: '/admin/developments', icon: MdBusiness },
  // { name: 'Products', href: '/admin/products', icon: MdShoppingCart },
  { name: 'Users', href: '/admin/users', icon: MdPeople },
  { name: 'Media Library', href: '/admin/media', icon: MdPhotoLibrary },
  { name: 'Analytics', href: '/admin/analytics', icon: MdAnalytics },
  { name: 'Settings', href: '/admin/settings', icon: MdSettings },
  // { name: 'Storage Migration', href: '/admin/migrate-storage', icon: MdSwapHoriz },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="admin-sidebar relative bg-gray-800 overflow-y-auto text-white w-64 min-h-full flex-shrink-0">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold text-blue-400">Admin Panel</h2>
        <p className="text-xs text-gray-400 mt-1">PPSB Luyari Management</p>
      </div>

      <nav className="mt-4 overflow-y-auto h-full">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  <Icon className="text-xl" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-0 mb-10 right-0 px-4 w-full">
        <div className="bg-gray-700 rounded-lg p-3">
          <p className="text-xs text-gray-400">Need help?</p>
          <Link
            href="/admin/settings"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            View Documentation
          </Link>
        </div>
      </div>
    </aside>
  );
}

