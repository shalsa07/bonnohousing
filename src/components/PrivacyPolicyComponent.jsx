import React from 'react'
import LegalPageWrapperPopup from './LegalPageWrapperPopup'

export default function PrivacyPolicyComponent() {
  return (
    <LegalPageWrapperPopup title="Privacy Policy">
        <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-blue-900">1. Data Protection Commitment</h2>
        <p>In accordance with the <strong>Botswana Data Protection Act</strong>, Bonno Housing (PPSBluyari) ensures that all personal information is processed lawfully and transparently.</p>
        </section>

        <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-blue-900">2. Collection of Personal Data</h2>
        <p>We collect data required for housing eligibility, including:</p>
        <ul className="list-disc ml-6 flex flex-col gap-1">
            <li>Identity Documents (Omang)</li>
            <li>Financial Records (Payslips and Bank Statements)</li>
            <li>Contact Information</li>
        </ul>
        </section>

        <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold text-blue-900">3. Purpose of Processing</h2>
        <p>Data is used strictly to facilitate home ownership under the Bonno National Housing Programme and may be shared with authorized financial partners like NDB or BHC.</p>
        </section>
    </LegalPageWrapperPopup>
  )
}
