import LandingPageCarousel from "@/components/LandingPageCarousel";

export const INITIAL_EXPERIENCE_STATE={
    landingPageCarouselPopup:true,
    disclaimerPopup:false,
    copyrightNoticePopup:false,
    termsConditionsPopup:false,
    privacyPolicyPopup:false,
}

export const ACTIONS_SITE={
    CAROUSEL_CLOSE:'CAROUSEL_CLOSE',
    DISCLAIMER_POPUP:'DISCLAIMER_POPUP',
    COPYRIGHT_NOTICE_POPUP:'COPYRIGHT_NOTICE_POPUP',
    TERMS_CONDITIONS_POPUP:'TERMS_CONDITIONS_POPUP',
    PRIVACY_POLICY_POPUP:'PRIVACY_POLICY_POPUP',
    CLOSE_ALL_POPUPS:'CLOSE_ALL_POPUPS',
}

export const reducerSiteFunction=(state,action)=>{
      if (!state || !action) {
        console.warn('reducerExperience: Invalid state or action', { state, action });
        return state || INITIAL_EXPERIENCE_STATE;
    }
    switch (action.type) {
        case 'CAROUSEL_CLOSE':
            return {
                ...state,
                landingPageCarouselPopup:false,
            }
        case 'CAROUSEL_OPEN':
            return {
                ...state,
                landingPageCarouselPopup:true,
            }
        case 'DISCLAIMER_POPUP':
            return {
                ...state,
                disclaimerPopup:true,
            }
        case 'COPYRIGHT_NOTICE_POPUP':
            return {
                ...state,
                copyrightNoticePopup:true,
            }
        case 'TERMS_CONDITIONS_POPUP':
            return {
                ...state,
                termsConditionsPopup:true,
            }
        case 'PRIVACY_POLICY_POPUP':
            return {
                ...state,
                privacyPolicyPopup:true,
            }
        case 'CLOSE_ALL_POPUPS':
            return {
                ...state,
                privacyPolicyPopup:false,
                termsConditionsPopup:false,
                copyrightNoticePopup:false,
                disclaimerPopup:false,
            }
        default:
            return state;
    }
}
