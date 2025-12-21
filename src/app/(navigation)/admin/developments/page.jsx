'use client';

import PlaceholderPage from '@/components/admin/PlaceholderPage';
import Link from 'next/link';
import { MdArrowBack, MdBusiness } from 'react-icons/md';

export default function DevelopmentsPage() {
  return (
    <>
      <PlaceholderPage
        title="Developments"
        description="Manage property developments that group multiple building projects together."
        icon={MdBusiness}
        features={[
          'View all developments',
          'Create new developments',
          'Associate projects with developments',
          'Manage development details',
          'Track development progress',
          'Development analytics'
        ]}
        expectedDate="Q1 2024"
      />
    </>
  );
}

