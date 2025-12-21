import ImageNotFoundPlaceholder from '@/components/ImageNotFoundPlaceholder'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import { settings, settingsBtns } from '@/libs/settings'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { GoChevronLeft } from 'react-icons/go'

function _360sBtns({ data, handle360Click }) {
  // console.log('_360sBtns:',data)
  const [active360, setActive360] = useState(0)

  const handleActive360Click = (index, i) => {
    setActive360(index)
    handle360Click(i?.name)
  }
  return (
    <>
      {data?._360sImages?.sort((a, b) => a.name.localeCompare(b.name)).map((i, index) =>
        <div onClick={() => handleActive360Click(index, i)} key={index} className={`_360_btns flex ${active360 == index ? 'bg-gray-300' : 'bg-white'} items-center justify-start cursor-pointer shadow w-full px-2 py-1 gap-1 md:min-h-14 min-h-10 relative`}>
          {i?.url?.length > 0 ? <img className='w-4/5 md:max-w-1/2 h-full rounded-md' src={i?.url} alt="360 images" /> : <ImageNotFoundPlaceholder />}
          <div className='flex w-1/5 md:w-1/2 items-center justify-start relative'>
            <span className={`hidden ml-1 md:flex w-full font-bold text-xl ${active360 == index ? `border-b-4 ${settings.luyariBlueBorder}` : 'border-none'}`}>360</span>
            {active360 !== index && <span className='mt-4 md:mr-1 font-medium text-xs'>{index + 1}</span>}
          </div>
        </div>
      )}
    </>
  )
}

function BtnTypeLevels({ data }) {
  const btnStates = ['on', 'off']
  return (
    <div className='flex relative shadow cursor-pointer items-center rounded-r-full justify-start bg-white min-h-10 font-medium w-full md:w-[calc(100%-44px)]'>
      <span className='ml-2 text-[10px] md:text-sm font-bold w-full text-xs uppercase leading-3'>
        {data}
      </span>
      <div className='abosulte flex justify-between -left-10 top-0 bottom-0 my-auto min-w-[72px] p-1 h-full rounded-full bg-gray-700'>
        <div className='flex items-center justify-center relative w-full h-full'>
          {btnStates?.map((i, index) =>
            <button
              key={i}
              onClick={() => data?.fn(i)}
              className={`text-[10px] md:text-xs w-8 h-8 uppercase ${index !== 0 ? 'rounded-full bg-white text-gray-500' : 'text-white'}`}
            >{i}</button>)}
        </div>
      </div>
    </div>
  )
}

function HideLevelBtns({ data, handleHideLevelClick, handleResetLevels }) {
  const { experienceState } = useExperienceContext()

  const handleActiveLevelHideClick = (i, index) => {
    handleHideLevelClick(i?.name, index)
  }

  const isLevelHidden = (name) => {
    const hiddenList = experienceState?.hideLevelStatus || []
    if (!Array.isArray(hiddenList)) return false
    return hiddenList.includes(name)
  }

  // Check if any levels are currently hidden
  const hasHiddenLevels = () => {
    const hiddenList = experienceState?.hideLevelStatus || []
    return Array.isArray(hiddenList) && hiddenList.length > 0
  }

  return (
    <>
      {data?.hideLevel?.sort((a, b) => a.name.localeCompare(b.name)).map((i, index) => {
        const isHidden = isLevelHidden(i?.name)
        return (
          <div
            onClick={() => handleActiveLevelHideClick(i, index)}
            key={index}
            className={`hide-level-btn flex relative items-center justify-start cursor-pointer shadow rounded-r-full w-32 md:w-48 min-h-10 ${isHidden ? 'bg-gray-200' : 'bg-white'}`}
          >
            <div className='flex md:max-w-32 w-28 h-full items-center'>
              <span className='ml-2 h-fit text-wrap font-bold uppercase'>
                {i?.name}
              </span>
            </div>
            <div className='absolute shadow right-0 w-fit h-full flex bg-gray-600 items-center text-xs uppercase rounded-full p-1'>
              <div className={`flex items-center justify-center h-full rounded-full px-1 ${!isHidden ? 'bg-white text-gray-500' : 'bg-gray-600 text-white'}`}>
                <span className='ml-1'>on</span>
              </div>
              <div className={`flex items-center justify-center h-full rounded-full px-1 ${!isHidden ? 'bg-gray-600 text-white' : 'bg-white text-gray-500'}`}>
                <span className='mr-1'>off</span>
              </div>
            </div>
          </div>
        )
      })}
      {/* Reset Levels Button - only show when levels are hidden */}
      {/* {hasHiddenLevels() && (
        <div
          onClick={handleResetLevels}
          className='hide-level-reset-btn flex relative items-center justify-center cursor-pointer shadow bg-blue-500 hover:bg-blue-600 text-white rounded-r-full w-32 md:w-48 min-h-10'
        >
          <span className='font-bold uppercase text-[10px] md:text-xs'>
            Reset Levels
          </span>
        </div>
      )} */}
    </>
  )
}

function BtnType1({ data, fn }) {
  // console.log('BtnType1:',data)
  return (
    <div onClick={() => fn(data)} className={`flex shadow items-center cursor-pointer font-medium justify-start bg-white min-h-10 w-full md:w-[calc(100%-30px)] ${settingsBtns.luyariTextBlue} hover:bg-gray-300 hover:text-gray-400`}>
      <span className='ml-2 font-bold uppercase leading-3'>
        {data}
      </span>
    </div>
  )
}

function BtnType2({ data, fn }) {
  return (
    <div onClick={() => fn(data)} className={`flex shadow items-center cursor-pointer font-medium justify-start bg-white min-h-10 w-full md:w-[calc(100%-30px)] ${settingsBtns.luyariTextBlue} hover:bg-gray-300 hover:text-gray-400`}>
      <span className='ml-2 font-bold uppercase leading-3'>
        {data}
      </span>
    </div>
  )
}

export default function LeftPanelUi({ data, handleHideLevelClick, handleResetLevels, levelList, handle360Click, handleSnapPoint }) {
  const { experienceState, experienceDispatch } = useExperienceContext()
  const router = useRouter()

  return (
    <div className='absolute text-gray-500 flex justify-between left-0 top-1/3 my-auto w-16 flex-col h-2/3'>
      <div className='gap-1 h-full flex flex-col relative w-32 md:w-60'>
        <div className='w-16 md:w-32 h-fit items-end flex-col gap-1 flex'>
          <div onClick={() => router.back()} className='flex items-center justify-center h-16 w-16 bg-white p-[1.5px]'>
            <div className='border-1 flex items-center justify-center cursor-pointer h-full w-full border-gray-400'>
              <GoChevronLeft className='text-4xl' />
            </div>
          </div>
          <div className='relative shadow h-16 md:w-32 overflow-hidden'>
            {data?.hero?.heroImages?.length > 0
              ? <img className='w-full h-full object-cover' src={data?.hero?.heroImages?.[0]?.url} alt="" />
              : <ImageNotFoundPlaceholder />
            }
          </div>
        </div>
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
        <div className='flex bar tex-xs flex-col w-full h-full gap-1 overflow-y-auto no-scrollbar text-wrap text-[10px] md:text-xs'>
          {experienceState?._360Mode
            ? data?._360sImages?.length > 0 && (
              <div className='flex flex-col w-16 md:w-32 h-12 gap-1'>
                <_360sBtns data={data} handle360Click={handle360Click} />
              </div>
            )
            : <>
              {data?.colors?.length > 0 && (
                <div className='max-w-16 md:max-w-40'>
                  <BtnType1 fn={() => experienceDispatch({ type: ACTIONS_EXPERIENCE.COLOR_VIEW })} data={'color swatch'} />
                </div>
              )}
              {/* Hide Level Buttons with proper state tracking */}
              {data?.hideLevel?.length > 0 && (
                <HideLevelBtns
                  data={data}
                  handleHideLevelClick={handleHideLevelClick}
                  handleResetLevels={handleResetLevels}
                />
              )}
              <div className='flex flex-col w-16 md:w-40 h-12 gap-1'>
                {/* Room Snap Point Buttons */}
                {data?.roomSnaps?.sort((a, b) => a.name.localeCompare(b.name)).map((i, index) => (
                  <BtnType1 fn={handleSnapPoint} key={index} data={i?.name} />
                ))}
                {/* Reset Camera Button - only appears after user has clicked at least one snap point */}
                {/* {data?.roomSnaps?.length > 0 && experienceState?.hasClickedSnapPoint && (
                      <div
                        onClick={() => experienceDispatch({type: ACTIONS_EXPERIENCE.RESET_CAMERA})}
                        className='flex relative items-center justify-center cursor-pointer shadow bg-blue-500 hover:bg-blue-600 text-white rounded-r-full w-32 md:w-48 min-h-10'
                      >
                        <span className='font-bold uppercase text-[10px] md:text-xs'>
                          Reset Camera
                        </span>
                      </div>
                    )} */}
              </div>
            </>
          }
        </div>
      </div>
    </div>
  )
}