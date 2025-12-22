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

// Direct database access for Server Component
import clientPromise from '@/libs/db';
import { ObjectId } from 'mongodb';

const getData = async (id) => {
  try {
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      console.error('Invalid building ID format:', id);
      return [];
    }

    const client = await clientPromise;
    const db = client.db("bonnohousing");
    
    const building = await db.collection('buildings').findOne({ _id: new ObjectId(id) });
    
    if (!building) {
      return [];
    }

    // Serialize ObjectId and dates for Client Components if needed, 
    // though passing to ExperienceWorldClient (likely client component) might require it.
    // Ensure _id and dates are strings/numbers if passed to client components.
    // However, the original fetch returned JSON which converts dates to strings automatically.
    // We should mimic that behavior roughly or ensure the component handles it.
    // ExperienceWorldClient likely expects a plain JS object.
    
    const serializedBuilding = JSON.parse(JSON.stringify(building));
    return [serializedBuilding];

  } catch (error) {
    console.error('Error fetching building data:', error);
    return [];
  }
}

export default async function page({ params }) {
  const { id } = await params
  const dataFetched = await getData(id)
  // const dataFetched = buildingDB?.find(({ _id }) => _id == id)
  // const data = dataFetched
  const data = dataFetched[0]

  // console.log('project data:', data)

  // Handle case where building is not found
  if (!data) {
    return (
      <PagesWrapper>
        <div className='flex items-center justify-center h-full w-full'>
          <div className='text-center'>
            <h1 className='text-2xl font-bold text-gray-900 mb-4'>Building Not Found</h1>
            <p className='text-gray-600 mb-4'>The requested building could not be found.</p>
            <a
              href='/houses'
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
