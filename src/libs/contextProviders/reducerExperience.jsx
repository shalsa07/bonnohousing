export const INITIAL_EXPERIENCE_STATE = {
    firstPersonView: true,
    _360Mode: true,
    ARMode: false,
    modelMode: false,
    popupMode: true,
    arSupported: false,
    colorPopup: false,
    loanForm: false,
    _360TextureName: '',
    hidelevel: { nameOfObject: '', visible: true, reset: false },
    hideLevelStatus: [], // Array of hidden level names for UI state tracking
    snapPoint: '',
    resetCamera: false, // Flag to trigger camera reset to initial position
    hasClickedSnapPoint: false, // Flag to track if user has clicked any snap point
    lerpToHideLevel: false, // Flag to trigger camera lerp to hide level position
    materialColorChange: null, // {materialProperty: string, color: string, timestamp: number} - triggers material color update
    arModelPlaced: false, // Flag to track if the model has been placed in AR
    arPlacementDetected: false, // Flag to track if a hit test surface has been detected
    arModelPose: null, // { position: [x,y,z], rotation: [x,y,z] }
}

export const ACTIONS_EXPERIENCE = {
    FIRST_PERSON_VIEW: 'FIRST_PERSON_VIEW',
    _360_VIEW: '_360_VIEW',
    MODEL_VIEW: 'MODEL_VIEW',
    AR_VIEW: 'AR_VIEW',
    HIDE_LEVEL: 'HIDE_LEVEL',
    RESET: 'RESET',
    RESET_ALL: 'RESET_ALL', // Full reset to initial state (for model switching)
    RESET_CAMERA: 'RESET_CAMERA', // Reset camera to initial position
    SNAPPOINT: 'SNAPPOINT',
    _360_NAME: '_360_NAME',
    HIDE_LEVEL_STATUS: 'HIDE_LEVEL_STATUS',
    POPUP_VIEW: 'POPUP_VIEW',
    POPUP_CLOSE: 'POPUP_CLOSE',
    COLOR_VIEW: 'COLOR_VIEW',
    COLOR_CLOSE: 'COLOR_CLOSE',
    AR_NOT_SUPPORTED: 'AR_NOT_SUPPORTED',
    AR_SUPPORTED: 'AR_SUPPORTED', // Set when WebXR AR is supported
    LERP_TO_HIDE_LEVEL: 'LERP_TO_HIDE_LEVEL', // Trigger camera lerp to hide level position
    MATERIAL_COLOR_CHANGE: 'MATERIAL_COLOR_CHANGE', // Update material color in 3D scene
    AR_MODEL_PLACED: 'AR_MODEL_PLACED',
    AR_PLACEMENT_DETECTED: 'AR_PLACEMENT_DETECTED',
    SET_AR_MODEL_POSE: 'SET_AR_MODEL_POSE',
    TOGGLE_LOAN_FORM: 'TOGGLE_LOAN_FORM',
}

export const reducerExperienceFunction = (state, action) => {
    if (!state || !action) {
        console.warn('reducerExperience: Invalid state or action', { state, action });
        return state || INITIAL_EXPERIENCE_STATE;
    }
    switch (action.type) {
        case '_360_VIEW':
            return {
                ...state,
                firstPersonView: true,
                _360Mode: true,
                modelMode: false,
            }
        case '_360_NAME':
            return {
                ...state,
                _360TextureName: action.payload,
                // snapPoint:action.payload
            }
        case 'MODEL_VIEW':
            return {
                ...state,
                firstPersonView: false,
                _360Mode: false,
                modelMode: true,
            }
        case 'POPUP_VIEW':
            return {
                ...state,
                firstPersonView: false,
                popupMode: true,
                _360Mode: false,
                modelMode: false,
            }
        case 'POPUP_CLOSE':
            return {
                ...state,
                firstPersonView: true,
                popupMode: false,
                _360Mode: true,
                modelMode: false,
            }
        case 'COLOR_VIEW':
            return {
                ...state,
                colorPopup: true,
            }
        case 'COLOR_CLOSE':
            return {
                ...state,
                colorPopup: false,
            }
        case 'AR_NOT_SUPPORTED':
            return {
                ...state,
                arSupported: false,
            }
        case 'AR_SUPPORTED':
            return {
                ...state,
                arSupported: true,
            }
        case 'AR_VIEW':
            if (state.ARMode) {
                // Exiting AR mode: go back to the default 360 view
                return {
                    ...state,
                    ARMode: false,
                };
            }
            // Entering AR mode
            return {
                ...state,
                ARMode: true,
            }
        case 'HIDE_LEVEL':
            return {
                ...state,
                hidelevel: action.payload,
            }
        case 'HIDE_LEVEL_STATUS':
            return {
                ...state,
                hideLevelStatus: action.payload,
            }
        case 'RESET':
            return {
                ...state,
                firstPersonView: true,
                _360Mode: true,
                ARMode: false,
                modelMode: false,
            }
        case 'RESET_ALL':
            // Full reset to initial state (used when switching between models)
            return {
                ...INITIAL_EXPERIENCE_STATE
            }
        case 'RESET_CAMERA':
            // Toggle resetCamera flag to trigger camera reset in controls
            return {
                ...state,
                resetCamera: !state.resetCamera,
                snapPoint: '' // Clear any active snap point
            }
        case 'SNAPPOINT':
            return {
                ...state,
                firstPersonView: true,
                snapPoint: action.payload,
                hasClickedSnapPoint: action.payload && action.payload !== 'reset' ? true : state.hasClickedSnapPoint
            }
        case 'LERP_TO_HIDE_LEVEL':
            return {
                ...state,
                lerpToHideLevel: !state.lerpToHideLevel
            }
        case 'MATERIAL_COLOR_CHANGE':
            return {
                ...state,
                // Add timestamp to ensure React detects changes even for same material
                materialColorChange: { ...action.payload, timestamp: Date.now() }
            }
        case 'AR_MODEL_PLACED':
            return {
                ...state,
                arModelPlaced: action.payload
            }
        case 'AR_PLACEMENT_DETECTED':
            return {
                ...state,
                arPlacementDetected: action.payload
            }
        case 'SET_AR_MODEL_POSE':
            return {
                ...state,
                arModelPose: action.payload
            }
        case 'TOGGLE_LOAN_FORM':
            return {
                ...state,
                loanForm: action.payload !== undefined ? action.payload : !state.loanForm
            }
        default:
            return state;
    }
}
