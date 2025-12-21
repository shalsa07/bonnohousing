'use client'
import React from 'react'
import { IoBedOutline, IoCarOutline } from "react-icons/io5";
import { LuBath } from "react-icons/lu";
import { settings } from '@/libs/settings'
import { TbArrowAutofitHeight, TbArrowAutofitWidth } from "react-icons/tb";
import { SiLevelsdotfyi } from "react-icons/si";

export default function ExperienceInfoWrapper({data,options}) {
    const icons='w-5 h-5'
    const summary=[
        {img:{on:'/assets/360_btn_on.png',off:'/assets/360_btn_off.png'},name:'length',icon:<TbArrowAutofitWidth className={icons} />},
        {img:{on:'/assets/360_btn_off.png',off:'/assets/360_btn_off.png'},name:'width',icon:<TbArrowAutofitHeight className={icons} />},
        {img:{on:'/assets/360_btn_off.png',off:'/assets/360_btn_off.png'},name:'baths',icon:<IoBedOutline className={icons}/>},
        {img:{on:'/assets/360_btn_off.png',off:'/assets/360_btn_off.png'},name:'levels',icon:<SiLevelsdotfyi className={icons}/>}, 
        {img:{on:'/assets/360_btn_off.png',off:'/assets/360_btn_off.png'},name:'cars',icon:<LuBath className={icons}/>}, 
        {img:{on:'/assets/360_btn_off.png',off:'/assets/360_btn_off.png'},name:'beds',icon:<IoCarOutline className={icons}/>}
    ]
  return (
    <div className='flex flex-col h-fit text-xs w-full py-2 gap-2 mb-4'>
        <p className='uppercase underline'>
            {data?.buildingType}
        </p>
        <p className='text-sm'>{data?.desc}</p>
        <p className='text-xs'>{data?.features}</p>
        <div className='flex flex-col w-full gap-1 px-3 py-1'>
            {data?.buildingHighlights?.map((i,index)=>
                <div key={index}>
                    <h1 className='uppercase underline text-sm'>{i?.title}</h1>
                    <p className='text-xs'>{i?.desc}</p>
                </div>
            )}
        </div>
        <p className='text-xs md:mb-5 mb-8'>{data?.outroSection}</p>
    </div>
  )
}
