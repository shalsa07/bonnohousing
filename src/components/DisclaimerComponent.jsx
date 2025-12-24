import React from 'react'
import LegalPageWrapperPopup from './LegalPageWrapperPopup'

export default function DisclaimerComponent() {
  return (
    <LegalPageWrapperPopup title="Disclaimer">
        <section className="flex flex-col gap-4">
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md flex items-start gap-3">
            <span className="font-bold text-yellow-800 underline">Notice:</span>
            <p className="text-yellow-900 text-sm">
            Property listings and pricing are subject to change based on market conditions and government policy updates.
            </p>
        </div>

        <h2 className="text-xl font-semibold text-blue-900">No Binding Offer</h2>
        <p>The content on <strong>bonnohousing.co.bw</strong> is for informational purposes. A final sale is only valid upon the execution of a formal Sale Agreement signed by all relevant parties.</p>

        <h2 className="text-xl font-semibold text-blue-900">Visual Representations</h2>
        <p>Images and virtual tours are artist impressions. Final finishes and landscaping may vary upon completion of construction.</p>
        </section>
    </LegalPageWrapperPopup>
  )
}
