import { settingsBtns } from '@/libs/settings'
import React from 'react'
import { GoChevronUp } from 'react-icons/go'


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

function ModeChangeUi({ data, modeBtns, arModeBtns, experienceState, experienceDispatch }) {
  return (
    <div className='mode-change-ui text-white flex items-center gap-1 absolute z-10 top-2 mx-auto left-0 right-0 w-fit flex-col h-fit'>
      <div className='flex relative w-fit h-fit'>
        {arModeBtns?.map((i, index) =>
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
  // function ModeChangeUi ... (existing code)
}

function PlaceModelUi({ experienceState, experienceDispatch }) {
  if (!experienceState?.arPlacementDetected || experienceState?.arModelPlaced || !experienceState?.modelMode) return null

  return (
    <div className='absolute bottom-20 left-0 right-0 mx-auto w-fit z-50'>
      <button
        className='bg-white text-black px-6 py-2 rounded-full font-bold shadow-lg uppercase tracking-wider'
        onClick={() => {
          experienceDispatch({
            type: 'AR_MODEL_PLACED',
            payload: true
          })
        }}
      >
        Place Model
      </button>
    </div>
  )
}

function BottomPanelUi({ data }) {
  // ...
  return (
    <div className={`flex md:hidden absolute bottom-0 left-0 right-0 mx-auto w-10 items-center justify-center text-white h-10 ${settingsBtns.luyariBlue} hover:bg-gray-400 rounded-t-full`}>
      <GoChevronUp className='text-2xl' />
    </div>
  )
}

export default function ExperienceUIAR({ data, experienceState, experienceDispatch }) {
  return (
    <>
      <BottomPanelUi data={data} experienceDispatch={experienceDispatch} experienceState={experienceState} />
      <ModeChangeUi data={data} experienceDispatch={experienceDispatch} experienceState={experienceState} />
      <PlaceModelUi experienceState={experienceState} experienceDispatch={experienceDispatch} />
    </>
  )
}
