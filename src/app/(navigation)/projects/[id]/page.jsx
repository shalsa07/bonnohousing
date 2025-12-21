// import ExperienceModel from '@/components/experience/ExperienceModel'
// import ExperienceWorld from '@/components/experience-new/ExperienceWorld';
import PagesWrapper from '@/components/PagesWrapper'
// import dynamic from 'next/dynamic'
import React from 'react'

import ExperienceWorldClient from '@/components/experience-new/ExperienceWorldClient'
import { buildingDB } from '@/libs/blgDB';

// The ExperienceWorldClient is a client component that dynamically loads the heavy AR experience
// with `ssr: false` to avoid server‑side rendering issues in XRViewer.
// It will be rendered below with the fetched `data` prop.

const getData = async (id) => {
  try {
    const protocol = process.env.NODE_ENV === 'development' ? 'https' : 'http';
    // Fetch building data from API endpoint
    const response = await fetch(`${protocol}://localhost:3004/api/buildings/${id}`, {
      cache: 'no-store' // Ensure fresh data on each request
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Building not found');
      }
      throw new Error('Failed to fetch building data');
    }

    const data = await response.json();
    return [data]; // Return as array to match original format
  } catch (error) {
    console.error('Error fetching building data:', error);
    // Return empty array if fetch fails to prevent page crash
    return [];
  }
}

export default async function page({ params }) {
  const { id } = await params
  // const dataFetched = await getData(id)
  const dataFetched = buildingDB?.find(({_id})=>_id==id)
  const data = dataFetched
  // const data = dataFetched[0]

  // console.log('project data:', id)

  // Handle case where building is not found
  if (!data) {
    return (
      <PagesWrapper>
        <div className='flex items-center justify-center h-full w-full'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Building Not Found</h1>
            <p className='text-gray-600 mb-4'>The requested building could not be found.</p>
            <a
              href='/projects'
              className='inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              Back to Projects
            </a>
          </div>
        </div>
      </PagesWrapper>
    )
  }

  return (
    <div className='experience-world absolute top-0 left-0 w-full h-full flex-grow overflow-hidden'>
      <ExperienceWorldClient data={data} />
    </div>
  )
}
