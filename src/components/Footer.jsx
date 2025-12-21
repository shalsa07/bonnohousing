import { settings, siteLauyout } from '@/libs/settings'
import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <div className='flex fixed text-white bottom-0 overflow-hidden right-0 mx-auto z-50 justify-between w-full h-16 items-center'>
      <div className={`flex relative items-center bg-[#0099FF]/75- ${settings.bonnoBlueFaint} w-1/2 h-full`}>
        {siteLauyout?.footerPagesLinks?.map(i =>
          <div key={i} className='text-sm'>
            <div className='h-full w-[2px] bg-white uppercase'> </div>
            <Link className='text-[10px] border-l-1 border-white px-2 uppercase' href={`/`}>{i}</Link>
            <div className='h-full w-[2px] bg-white uppercase'> </div>
          </div>
        )}
      </div>

      <div className='fixed z-10 bottom-16 right-2 text-[10px]'>powered by <span className='text-sm tracking-wide'>luyari.</span></div>

      <div className={`flex w-1/2 h-full ${settings.bonnoGreenFaint} items-end absolute bottom-0 text-xs right-0 flex-1 gap-2 p-4 justify-end`}>
        {siteLauyout?.footerLogos?.map((i, index) => <img key={index} className='w-auto h-full' src={i} alt="" />)}
        {/* <img className='w-7 h-fit' src={settings.btnsImages.logoFooter.default} alt="" /> */}
      </div>
    </div>
  )
}
