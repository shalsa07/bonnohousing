import { settings, siteLauyout } from '@/libs/settings'
import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className='flex fixed text-white bottom-0 overflow-hidden right-0 mx-auto z-30 justify-between w-full h-16 items-center'>
      <div className={`flex flex-row relative flex-wrap px-2 items-center ${settings.bonnoBlueFaint} w-1/2 h-full`}>
        {siteLauyout?.footerPagesLinks?.map(i =>
          <Link key={i} className='md:text-xs text-[10px] border-l-1 text-wrap border-white px-2 max-w-fit uppercase' href={`/`}>{i}</Link>
        )}
      </div>

      <Link href={'/luyari.com'} className='fixed z-10 text-right cursor-pointer bottom-18 right-1 md:right-2 text-[10px]'>developed by <span className='text-xs tracking-wide'>PPSBluyari</span> <br />powered by <span className='text-xs tracking-wide'>luyari.</span></Link>

      <div className={`flex w-1/2 h-full ${settings.bonnoGreenFaint} items-end absolute bottom-0 text-xs right-0 flex-1 gap-2 p-4 justify-end`}>
        {siteLauyout?.footerLogos?.map((i, index) => <img key={index} className='w-auto h-full' src={i} alt="" />)}
        {/* <img className='w-7 h-fit' src={settings.btnsImages.logoFooter.default} alt="" /> */}
      </div>
    </footer>
  )
}
