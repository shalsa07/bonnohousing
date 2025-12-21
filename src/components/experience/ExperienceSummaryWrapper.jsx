'use client'
import React from 'react'
import { IoBedOutline, IoCarOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { settings } from '@/libs/settings'
import { TbArrowAutofitHeight, TbArrowAutofitWidth } from "react-icons/tb";
import { SiLevelsdotfyi } from "react-icons/si";

import { useExperienceContext } from '@/libs/contextProviders/experienceContext';
import { ACTIONS_EXPERIENCE } from '@/libs/contextProviders/reducerExperience';

export default function ExperienceSummaryWrapper({ data, options }) {
    const { experienceDispatch } = useExperienceContext()
    const icons = 'w-5 h-5'
    const summary = [
        { img: { on: '/assets/360_btn_on.png', off: '/assets/360_btn_off.png' }, name: 'length', icon: <TbArrowAutofitWidth className={icons} /> },
        { img: { on: '/assets/360_btn_off.png', off: '/assets/360_btn_off.png' }, name: 'width', icon: <TbArrowAutofitHeight className={icons} /> },
        { img: { on: '/assets/360_btn_off.png', off: '/assets/360_btn_off.png' }, name: 'baths', icon: <IoBedOutline className={icons} /> },
        { img: { on: '/assets/360_btn_off.png', off: '/assets/360_btn_off.png' }, name: 'levels', icon: <SiLevelsdotfyi className={icons} /> },
        { img: { on: '/assets/360_btn_off.png', off: '/assets/360_btn_off.png' }, name: 'cars', icon: <LuBath className={icons} /> },
        { img: { on: '/assets/360_btn_off.png', off: '/assets/360_btn_off.png' }, name: 'beds', icon: <IoCarOutline className={icons} /> }
    ]
    // console.log(data?.buildingSummary)
    return (
        <div className='flex relative flex-col h-fit text-xs w-full py-2 gap-2'>
            <div className='flex flex-col md:flex-row min-w-72 min-h-40 mt-1 gap-[2px] overflow-hidden'>
                <div className='flex flex-wrap md:w-2/3
             w-full h-full'>
                    {summary?.map((i, index) =>
                        <div key={index} className='flex flex-col items-center justify-center md:h-1/2 md:w-1/3 w-1/3 h-20 P-2 gap-1'>
                            <div
                                className=' text-xs w-full h-full text-gray-500 flex items-center border-[1.5px] border-gray-500 justify-center flex-col bg-white p-[1.25px]'
                            >
                                <div
                                    className=' text-xs w-full h-full text-gray-500 flex items-center border-[1.5px] border-gray-500 justify-center flex-col'
                                >
                                    <span className='uppercase text-xs'>{i?.name}</span>
                                    <span className='text-xs'>
                                        {data?.buildingSummary?.[i?.name] ? data?.buildingSummary?.[i?.name] : 'N/A'}
                                    </span>
                                    {i?.icon}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={`flex md:w-1/3 w-1/2 flex-col justify-center h-full md:mt-[2px]`}>
                    <div className={`uppercase flex md:h-1/2 h-20 items-center text-xs text-center justify-center ${settings.luyariBlue}`}>
                        {data?.area ? `${data.area} sqm` : 'Area N/A'}
                    </div>
                    <div
                        onClick={() => experienceDispatch({ type: ACTIONS_EXPERIENCE.TOGGLE_LOAN_FORM, payload: true })}
                        className={`uppercase md:h-1/2 h-20 text-gray-500 text-center text-xs flex items-center justify-center bg-white cursor-pointer hover:bg-gray-100 transition-colors`}
                    >
                        enquire
                    </div>
                </div>
            </div>
        </div>
    )
}
