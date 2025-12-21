import ExperienceContextProvider from '@/libs/contextProviders/experienceContext'
import React from 'react'

export default function layout({children}) {
  return (
    <div className='flex w-full flex-grow h-svh overflow-hidden'>
      {children}
    </div>
  )
}
