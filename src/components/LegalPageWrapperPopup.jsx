import React from 'react'

export default function LegalPageWrapperPopup({title, children}) {
  return (
    <div className='flex flex-col max-h-4/5 max-w-2xl overflow-y-auto'>
      <div className='flex flex-col max-w-4xl mx-auto bg-gray-200 shadow-sm rounded-xl px-2 lg:p-4'>
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-6 mb-8">{title}</h1>
        <div className="flex flex-col gap-3 text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  )
}
