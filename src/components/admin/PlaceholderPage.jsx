'use client';

import AdminPageWrapper from './AdminPageWrapper';
import { MdConstruction, MdArrowBack } from 'react-icons/md';
import Link from 'next/link';

export default function PlaceholderPage({ 
  title, 
  description, 
  icon: Icon = MdConstruction,
  features = [],
  expectedDate = 'Coming Soon'
}) {
  return (
    <AdminPageWrapper title={title}>
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Icon className="text-4xl text-blue-600" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          
          {/* Status Badge */}
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4">
            <MdConstruction className="text-lg" />
            Under Development
          </span>

          {/* Description */}
          <p className="text-gray-600 mb-6">{description}</p>

          {/* Expected Features */}
          {features.length > 0 && (
            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-700 mb-3">Planned Features:</h3>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-blue-500 mt-1">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Expected Date */}
          <p className="text-sm text-gray-500 mb-6">
            Expected: <span className="font-medium">{expectedDate}</span>
          </p>

          {/* Back Button */}
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MdArrowBack />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </AdminPageWrapper>
  );
}

