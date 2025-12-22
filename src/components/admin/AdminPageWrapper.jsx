'use client';

import AdminSidebar from './AdminSidebar';
import Breadcrumb from './Breadcrumb';

export default function AdminPageWrapper({ children, title, showBreadcrumb = true }) {
  return (
    <div className="admin-page-wrapper flex h-screen w-full bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Main Content */}
      <main className="flex-1 h-[calc(100%-144px)] mt-20 overflow-y-auto">
        <div className="p-6">
          {showBreadcrumb && <Breadcrumb customTitle={title} />}
          {children}
        </div>
      </main>
    </div>
  );
}

