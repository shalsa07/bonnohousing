'use client'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import React, { useEffect, useState } from 'react'
import ExperienceTechnical from './ExperienceTechnical'
import { settingsBtns } from '@/libs/settings'
import LeftPanelUi from './LeftPanelUI'
import RightPanelUI from './RightPanelUI'
import { GoChevronUp } from 'react-icons/go'
import Block from '@uiw/react-color-block';
import { IoClose } from 'react-icons/io5'
import LoadApplicationForm from '@/components/forms/LoadApplicationForm'
import ShareComponent from '@/components/ShareComponent'
import LikeComponent from '@/components/LikeComponent'

// Detect if user is on iOS device
const isIOS = () => {
  if (typeof window === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
}

// iOS AR Warning Popup Component
function IOSARWarningPopup({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative mx-4 max-w-md rounded-2xl bg-gradient-to-b from-gray-800 to-gray-900 p-6 shadow-2xl border border-gray-700">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors"
        >
          <IoClose className="text-xl" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h3 className="mb-3 text-center text-xl font-bold text-white">
          iOS AR Limitation
        </h3>

        {/* Message */}
        <p className="mb-4 text-center text-gray-300 text-sm leading-relaxed">
          AR sessions are not natively supported by iOS Safari. However, you can enable limited AR capabilities by downloading the <span className="font-semibold text-blue-400">WebXR Viewer</span> app.
        </p>

        {/* Link */}
        <a
          href="https://apps.apple.com/us/app/webxr-viewer/id1295998056"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-6 py-3 text-white font-semibold hover:bg-blue-600 transition-colors"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Download WebXR Viewer
        </a>

        {/* Close text */}
        <button
          onClick={onClose}
          className="w-full text-center text-gray-400 text-sm hover:text-gray-300 transition-colors"
        >
          Continue without AR
        </button>
      </div>
    </div>
  )
}

function IconSwapperHover({ data }) {
  const [hover, setHover] = useState(true)
  // console.log('IconSwapper:',hover)
  return (
    <>
      {hover ?
        <div onMouseEnter={() => setHover(!hover)} className='relative'>
          <img src={data?.default} className='w-full h-auto' alt="" />
        </div>
        : <div onMouseLeave={() => setHover(!hover)} className='relative'>
          <img src={data?.hover} className='w-full h-auto' alt="" />
        </div>}
    </>
  )
}

function IconSwapperState({ data }) {
  // console.log('IconSwapper:',hover)
  return (
    <>
      {data?.state ?
        <div className='relative'>
          <img src={data?.default} className='w-full h-auto' alt="" />
        </div>
        : <div className='relative'>
          <img src={data?.hover} className='w-full h-auto' alt="" />
        </div>}
    </>
  )
}

function ModeChangeUi({ data, modeBtns, arModeBtns }) {
  const { experienceState, experienceDispatch } = useExperienceContext()
  return (
    <div className='mode-change-ui text-white flex items-center gap-1 absolute z-10 top-20 mx-auto left-0 right-0 w-fit flex-col h-fit'>
      <div className='flex relative w-fit h-fit'>
        {experienceState?.arSupported && arModeBtns?.map((i, index) =>
          <div onClick={i?.fn} key={i?.name} className='relative w-fit h-fit'>
            <IconSwapperState data={i} />
          </div>
        )}
      </div>
      <div className='bg-black/30 rounded-full wfit h-fit px-4 py-1 font-light uppercase'>
        {experienceState?.modelMode ? 'model' : '360'}
      </div>
      <div className='flex relative w-fit h-fit'>
        {modeBtns?.map((i, index) =>
          <div key={i?.name} onClick={i?.fn} className='relative w-fit h-fit'>
            <IconSwapperHover data={i} />
          </div>
        )}
      </div>
    </div>
  )
}

function ColorhangeUi({ data }) {
  const { experienceState, experienceDispatch } = useExperienceContext()
  // Track selected colors locally for UI feedback
  const [selectedColors, setSelectedColors] = useState({})

  const handleColorChange = (colorObj, index, newColor) => {
    // Debug: log the color change event
    console.log('ColorChangeUI: Color change triggered', { colorObj, newColor })

    // Update local state for UI feedback
    setSelectedColors(prev => ({
      ...prev,
      [index]: newColor.hex
    }))

    // Dispatch action to update the material color in 3D scene
    if (colorObj?.materialProperty) {
      console.log('ColorChangeUI: Dispatching MATERIAL_COLOR_CHANGE', {
        materialProperty: colorObj.materialProperty,
        color: newColor.hex
      })
      experienceDispatch({
        type: ACTIONS_EXPERIENCE.MATERIAL_COLOR_CHANGE,
        payload: {
          materialProperty: colorObj.materialProperty,
          color: newColor.hex
        }
      })
    } else {
      console.warn('ColorChangeUI: No materialProperty found for color', colorObj)
    }
  }

  return (
    <div className='color-change-ui text-gray-500 flex items-center gap-1 absolute z-10 bottom-20 mx-auto left-0 right-0 w-fit h-fit px-2 flex-wrap'>
      <div className='flex relative w-fit h-fit gap-2 p-2 rounded-md shadow bg-black/50'>
        <div
          className='flex z-10 absolute -right-3 cursor-pointer -top-3 text-white justify-center border-2 border-gray-400 bg-black/40 items-center w-8 h-8 rounded-full shadow'
          onClick={() => experienceDispatch({ type: ACTIONS_EXPERIENCE.COLOR_CLOSE })}
        >
          <IoClose className='text-2xl' />
        </div>
        {data?.colors?.length > 0 && experienceState?.colorPopup && experienceState?.modelMode && data?.colors?.map((colorObj, index) =>
          <div key={colorObj?.id || index} className='flex flex-col relative w-fit h-fit shadow rounded-b-xl'>
            {colorObj?.materialProperty && (
              <span className='text-xs text-white text-center bg-black/70 px-1 rounded-t truncate max-w-24'>
                {colorObj.materialProperty}
              </span>
            )}
            <Block
              color={selectedColors[index] || colorObj?.color || colorObj?.name || '#ffffff'}
              onChange={(newColor) => handleColorChange(colorObj, index, newColor)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ARUi({ data, store }) {
  const { experienceState, experienceDispatch } = useExperienceContext()

  // Don't render if store is not available (SSR case)
  if (!store) return null

  return (
    <div onClick={() => store.enterAR()} className={`flex absolute rounded-full bottom-14 md:bottom-14 left-0 right-0 mx-auto px-4 p-2 items-center justify-center text-xs uppercase w-fit text-white h-10 bg-black/50 font-bold cursor-pointer select-none border-1 border-gray-400 rounded-t-full`}>
      enter ar
    </div>
  )
}

function BottomPanelUi({ data }) {
  const { setCloseBtnState } = useExperienceContext()
  return (
    <div onClick={() => setCloseBtnState(prev => !prev)} className={`flex md:hidden absolute bottom-20 left-0 right-0 mx-auto w-10 items-center justify-center text-white h-10 ${settingsBtns.luyariBlue} hover:bg-gray-400 rounded-t-full`}>
      <GoChevronUp className='text-2xl mb-1' />
    </div>
  )
}

export default function ExperienceUI({ data, store, handleHideLevelClick, handleResetLevels, levelList, handle360Click, handleSnapPoint }) {
  const { experienceState, experienceDispatch } = useExperienceContext()
  const [showIOSPopup, setShowIOSPopup] = useState(false)

  // Check WebXR AR support on mount
  // iOS devices always get arSupported=true so AR buttons show (clicking shows WebXR Viewer popup)
  useEffect(() => {
    const checkARSupport = async () => {
      // Always show AR buttons on iOS devices (clicking will show WebXR Viewer popup)
      if (isIOS()) {
        experienceDispatch({ type: ACTIONS_EXPERIENCE.AR_SUPPORTED })
        return
      }

      // For non-iOS devices, check actual WebXR AR support
      try {
        if (navigator?.xr) {
          const isSupported = await navigator.xr.isSessionSupported('immersive-ar')
          if (isSupported) {
            experienceDispatch({ type: ACTIONS_EXPERIENCE.AR_SUPPORTED })
          } else {
            experienceDispatch({ type: ACTIONS_EXPERIENCE.AR_NOT_SUPPORTED })
          }
        } else {
          experienceDispatch({ type: ACTIONS_EXPERIENCE.AR_NOT_SUPPORTED })
        }
      } catch (error) {
        console.warn('WebXR AR support check failed:', error)
        experienceDispatch({ type: ACTIONS_EXPERIENCE.AR_NOT_SUPPORTED })
      }
    }
    checkARSupport()
  }, [experienceDispatch])

  const handleARModeClick = () => {
    // Check if on iOS and show warning popup
    if (isIOS()) {
      setShowIOSPopup(true)
      return
    }
    experienceDispatch({ type: ACTIONS_EXPERIENCE.AR_VIEW })
  }

  const handle360Mode = () => {
    experienceDispatch({ type: ACTIONS_EXPERIENCE._360_VIEW })
  }

  const handleModelMode = () => {
    experienceDispatch({ type: ACTIONS_EXPERIENCE.MODEL_VIEW })
    // Also reset the camera when switching to model mode
    experienceDispatch({ type: ACTIONS_EXPERIENCE.RESET_CAMERA })
  }

  const handleTechincalMode = () => {
    experienceDispatch({ type: ACTIONS_EXPERIENCE.POPUP_VIEW })
  }

  const arModeBtns = [
    { name: 'vr', default: settingsBtns.btnsImages.btnVR.default, hover: settingsBtns.btnsImages.btnVR.hover, state: experienceState?.ARMode, fn: handleARModeClick },
    { name: 'ar', default: settingsBtns.btnsImages.btnAR.default, hover: settingsBtns.btnsImages.btnAR.hover, state: !experienceState?.ARMode, fn: handleARModeClick },
  ]

  const modeBtns = [
    { name: 'doc', default: settingsBtns.btnsImages.btnDesign.default, hover: settingsBtns.btnsImages.btnDesign.hover, fn: handleTechincalMode },
    { name: '360s', default: settingsBtns.btnsImages.btn360.default, hover: settingsBtns.btnsImages.btn360.hover, fn: handle360Mode },
    { name: 'model', default: settingsBtns.btnsImages.btnModel.default, hover: settingsBtns.btnsImages.btnModel.hover, fn: handleModelMode },
  ]

  return (
    <>
      <ModeChangeUi
        arModeBtns={arModeBtns}
        modeBtns={modeBtns}
        data={data}
      />

      <LoadApplicationForm />

      <div className='flex absolute top-20 gap-2 right-2 z-50 shadow-lg p-2 rounded-full'>
        <LikeComponent 
          buildingId={data?._id}
          initialLikeCount={data?.likeCount || 0}
        />
        <ShareComponent 
          buildingId={data?._id} 
          buildingTitle={data?.name || data?.buildingTitle || 'this property'}
        />
      </div>

      <LeftPanelUi
        data={data}
        handle360Click={handle360Click}
        handleHideLevelClick={handleHideLevelClick}
        handleResetLevels={handleResetLevels}
        handleSnapPoint={handleSnapPoint}
        levelList={levelList}
      />
      {experienceState?.colorPopup && <ColorhangeUi data={data} />}
      <RightPanelUI data={data} />
      <BottomPanelUi data={data} />
      <ExperienceTechnical data={data} />
      {experienceState?.ARMode && <ARUi data={data} store={store} />}

      {/* TITLE UI */}
      <div className={`title-wrapper flex z-20 w-fit h-fit items-center justify-center absolute bottom-18 mx-auto left-0 right-0 text-white ${experienceState?._360Mode && 'bg-gray-600/85'} p-2 z-10`}>
        {experienceState?._360Mode && <span className=' uppercase font-extralight md:text-base text-sm'>
          - {experienceState?._360TextureName?.length > 0 ? experienceState?._360TextureName : data?._360sImages?.[0]?.name} -
        </span>}
      </div>
      {showIOSPopup && <IOSARWarningPopup onClose={() => setShowIOSPopup(false)} />}
    </>
  )
}
