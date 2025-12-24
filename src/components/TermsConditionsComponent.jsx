import React from 'react'
import LegalPageWrapperPopup from './LegalPageWrapperPopup'

export default function TermsConditionsComponent() {
  return (
    <LegalPageWrapperPopup title="Terms & Conditions">
        <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-blue-900">1. Eligibility Criteria</h2>
        <p>Access to housing schemes is restricted to citizens of Botswana. Users must fall within the designated income brackets (e.g., D4 scale and below) to qualify for specific PPSBluyari initiatives.</p>
        </section>

        <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-blue-900">2. User Responsibilities</h2>
        <p>Users agree to provide accurate and truthful information. Any fraudulent submissions will result in immediate disqualification and potential legal action.</p>
        </section>

        <div className="bg-blue-50 p-4 border-l-4 border-blue-900 text-sm italic">
        By using this portal, you acknowledge that PPSBluyari acts as a facilitator for sustainable development.
        </div>
    </LegalPageWrapperPopup>
  )
}
