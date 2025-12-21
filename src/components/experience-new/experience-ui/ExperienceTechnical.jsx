import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience'
import { settingsBtns } from '@/libs/settings'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ExperienceTechnical() {
    const {experienceState,experienceDispatch}=useExperienceContext()
    const router=useRouter()

    const handleCLoseButton = (params) => {
      experienceDispatch({type:ACTIONS_EXPERIENCE.TECHNICAL_CLOSE})
    }
    
  return (
    (experienceState?.techicalMode && <div className='flex duration-300 ease-linear absolute shadow-md z-20 w-full h-screen p-2 bg-black/50 md:p-10'>
      <div className='relative flex flex-col bg-gray-300 w-full overflow-y-auto'>
        <div className='technical-btns-ui flex text-white justify-between w-full h-fit p-2 md:p-5'>
          <button onClick={()=>router.back()} className={`${settingsBtns.luyariBlue} rounded-full cursor-pointer p-2`}>back</button>
          <button onClick={handleCLoseButton} className={`${settingsBtns.luyariBlue} rounded-full p-2`}>close</button>
        </div>
        <div className='w-full flex-3'>renders</div>
        <div className='w-full flex-1'>tecthincal</div>
        <div className='w-full flex-1'>features</div>
      </div>
    </div>)
  )
}
