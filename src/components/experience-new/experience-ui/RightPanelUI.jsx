import ExperienceInfoWrapper from '@/components/experience/ExperienceInfoWrapper'
import ExperienceSummaryWrapper from '@/components/experience/ExperienceSummaryWrapper'
import RollOverStateWrapper from '@/components/RollOverStateWrapper'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { settings } from '@/libs/settings'
import React, { useState } from 'react'

export default function RightPanelUI({data}) {
    const {closeBtnState,setCloseBtnState}=useExperienceContext() 
    // console.log('RightPanelUI:',data)        
  return (
    (closeBtnState && <div className={`right-panel-ui select-none flex bg-slate-600 flex-col z-20 absolute top-0 h-full justify-start items-start gap-1 overflow-y-auto p-4 duration-500 ease-linear text-white ${closeBtnState ? 'md:w-1/3 w-full right-0' : 'w-0 -right-10'}`}>
        <div onClick={()=>setCloseBtnState(prev=>!prev)} className={`close-btn flex font-bold text-xs mt-2 shadow uppercase absolute z-20 ${settings.luyariBlue} hover:bg-gray-500 cursor-pointer left-0 top-0 w-fit px-6 rounded-r-full min-h-12 items-center justify-center`}>
          close
        </div>
        <div className='flex w-full flex-col gap-2 mt-7'>
        <ExperienceSummaryWrapper data={data}/>
        <ExperienceInfoWrapper data={data}/>
        </div>
    </div>)
  )
}
