import LandingPageCarousel from "@/components/LandingPageCarousel";

export const INITIAL_EXPERIENCE_STATE={
    landingPageCarouselPopup:true,
}

export const ACTIONS_SITE={
    CAROUSEL_CLOSE:'CAROUSEL_CLOSE',
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
        default:
            return state;
    }
}
