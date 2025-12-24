import React from 'react'
import LegalPageWrapperPopup from './LegalPageWrapperPopup'

export default function CopyrightNoticeComponent() {
  return (
    <LegalPageWrapperPopup title="Copyright Notice">
        <div className="flex flex-col items-center justify-center text-center py-10">
        <div className="text-5xl mb-4">©</div>
        <p className="text-lg font-medium">2025 PPSBluyari / Bonno Housing</p>
        <p className="mt-4 max-w-md">
            All architectural designs, 3D house renderings, brand assets, and website content are the exclusive intellectual property of <strong>PPSBluyari</strong>.
        </p>
        <p className="mt-6 text-sm text-gray-500">
            Unauthorized reproduction or distribution of these assets is strictly prohibited under Botswana Intellectual Property laws.
        </p>
        </div>
    </LegalPageWrapperPopup>
  )
}
