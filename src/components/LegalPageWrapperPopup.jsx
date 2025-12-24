import React from 'react'

export default function LegalPageWrapperPopup({title, children}) {
  return (
    <div className='flex flex-col min-h-screen overflow-y-auto py-6 px-6 lg:px-24'>
      <div className='flex flex-col max-w-4xl mx-auto bg-gray-200 shadow-sm rounded-xl px-8 lg:p-12'>
        <h1 className="text-3xl font-bold text-gray-900 border-b pb-6 mb-8">{title}</h1>
        <div className="flex flex-col gap-6 text-gray-700 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
    // <div className="flex flex-col min-h-screen bg-gray-50 py-12 px-6 lg:px-24">
    //   <div className="flex flex-col max-w-4xl mx-auto bg-white shadow-sm rounded-xl p-8 lg:p-12">
    //     <h1 className="text-3xl font-bold text-gray-900 border-b pb-6 mb-8">{title}</h1>
    //     <div className="flex flex-col gap-6 text-gray-700 leading-relaxed">
    //       {children}
    //     </div>
    //   </div>
    // </div>
  )
}
