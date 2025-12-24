import React from 'react'
import LegalPageWrapperPopup from './LegalPageWrapperPopup'
import DisclaimerComponent from './DisclaimerComponent'
import TermsConditionsComponent from './TermsConditionsComponent'
import PrivacyPolicyComponent from './PrivacyPolicyComponent'
import CopyrightNoticeComponent from './CopyrightNoticeComponent'
import { useSiteContext } from '@/libs/contextProviders/siteContext'
import { ACTIONS_SITE } from '@/libs/contextProviders/reducerSite'

export default function LegalPopups() {
    const {siteState,siteDispatch}=useSiteContext()
  return (
    (siteState.disclaimerPopup || siteState.termsConditionsPopup || siteState.privacyPolicyPopup || siteState.copyrightNoticePopup) && <div className='legal-popup flex fixed top-0 left-0 right-0 bottom-0 z-[100] justify-center items-center bg-black bg-opacity-50 w-full h-full overflow-y-auto'>
        <LegalPageWrapperPopup>
            {siteState.disclaimerPopup && <DisclaimerComponent/>}
            {siteState.termsConditionsPopup && <TermsConditionsComponent/>}
            {siteState.privacyPolicyPopup && <PrivacyPolicyComponent/>}
            {siteState.copyrightNoticePopup && <CopyrightNoticeComponent/>}
            <button className={`flex w-fit px-6 h-12 my-10 items-center justify-center ${settings.bonnoBlue}`} onClick={()=>siteDispatch({type:ACTIONS_SITE.CLOSE_ALL_POPUPS})}>close</button>
        </LegalPageWrapperPopup>
    </div>)
}
