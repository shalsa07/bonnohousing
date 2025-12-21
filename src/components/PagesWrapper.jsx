import React from 'react'

export default function PagesWrapper({ children }) {
  return (
    <div className='pages-wrapper flex w-full h-[calc(100vh-144px)] mt-20 flex-grow justify-center overflow-hidden'>
      {children}
    </div>
  )
}