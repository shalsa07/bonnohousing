import React from 'react'

export default function ImageNotFoundPlaceholder() {
  return (
    <div className='flex w-full h-full items-center bg-gray-600 justify-center'>
      <img className='w-full h-auto object-cover' src="/assets/luyari_logo.webp" alt="place holder icon for missing images" />
    </div>
  )
}
