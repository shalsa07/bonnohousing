'use client'
import React from 'react'
import LegalPageWrapperPopup from './LegalPageWrapperPopup'
import DisclaimerComponent from './DisclaimerComponent'
import TermsConditionsComponent from './TermsConditionsComponent'
import PrivacyPolicyComponent from './PrivacyPolicyComponent'
import CopyrightNoticeComponent from './CopyrightNoticeComponent'
import { useSiteContext } from '@/libs/contextProviders/siteContext'
import { ACTIONS_SITE } from '@/libs/contextProviders/reducerSite'
import { settings } from '@/libs/settings'

export default function LegalPopups() {
    const {siteState,siteDispatch}=useSiteContext()
  return (
    (siteState.disclaimerPopup || siteState.termsConditionsPopup || siteState.privacyPolicyPopup || siteState.copyrightNoticePopup) && <div className='legal-popup flex fixed top-0 left-0 right-0 bottom-0 z-[100] justify-center items-center bg-black bg-opacity-50 w-full h-full overflow-y-auto'>
        <LegalPageWrapperPopup>
            {siteState.disclaimerPopup && <DisclaimerComponent/>}
            {siteState.termsConditionsPopup && <TermsConditionsComponent/>}
            {siteState.privacyPolicyPopup && <PrivacyPolicyComponent/>}
            {siteState.copyrightNoticePopup && <CopyrightNoticeComponent/>}
            <button className={`flex fixed bottom-2 left-0 right-0 mx-auto w-lg h-12 mt-10 items-center rounded-full text-gray-100 uppercase justify-center ${settings.bonnoBlue}`} onClick={()=>siteDispatch({type:ACTIONS_SITE.CLOSE_ALL_POPUPS})}>close</button>
        </LegalPageWrapperPopup>
    </div>)
}
