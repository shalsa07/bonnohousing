'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import RollOverStateWrapper from './RollOverStateWrapper'
import { settings, siteLauyout } from '@/libs/settings'
import { usePathname } from 'next/navigation'
import { useExperienceContext } from '@/libs/contextProviders/experienceContext'
import { IoIosMenu } from "react-icons/io";
import { IoIosClose } from "react-icons/io";
import SignInBtn2 from './SignInBtn2'
import { useSession } from 'next-auth/react'

// Helper function to create URL-friendly slugs
const createSlug = (text) => text.replace(/\s+/g, '-').toLowerCase();

const NavLinks = ({ links, className, linkClassName, onItemClick }) => (
  <>
    {links?.map((link, index) => (
      <div className={`flex items-center ${index == 0 && 'border-l-1'} border-r-1 h-full border-white/35 `} key={index}>
        <Link onClick={onItemClick} className={`${link == 'buy' && settings.bonnoTextBlue || link == 'rent' && settings.bonnoTextBlue} ${settings.bonnoHoverTextGreen} ${settings.bonnoHoverBorderGreen} hover:border-b-6 outline-offset-[16px] h-full flex uppercase items-center`} key={link} href={link === 'home' ? '/' : `/${createSlug(link)}`}>
          <span className='text-nowrap px-4'>{link}</span>
        </Link>
      </div>
    ))}
  </>
);

const MobileMenu = ({ links, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="nabar-popup fixed z-50 top-0 left-0 w-full text-white h-svh bg-black/90 shadow-sm py-6 md:hidden">
      <div className="flex flex-col items-center mt-20 gap-5">
        <NavLinks
          links={links}
          linkClassName={`hover:border-b-4 h-11 ${settings.luyariBlueBorder} text-sm cursor-pointer uppercase py-2`}
          onItemClick={onClose}
        />
      </div>
    </div>
  );
};


export default function Navbar() {

  const linkClassName = `hover:border-b-4 ${settings.luyariBlueBorder} h-5 uppercase`
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSelection, setActiveSelection] = useState(false);
  const pathname = usePathname()
  const { closeBtnState, setCloseBtnState, experienceState } = useExperienceContext()
  // I've removed the empty item from the array to prevent rendering issues.
  const links = siteLauyout?.navbarPagesLinks
  const { data: session } = useSession()
  const user = session?.user
  // console.log('Navbar:',user)

  return (
    <nav 
      className={`navbar-wrapper flex text-white fixed from-gray-600 bg-gradient-to-b top-0 mx-auto z-20 justify-between w-full h-20 items-start`}
      // className={`navbar-wrapper flex text-white fixed ${pathname?.length > 2 && 'from-gray-600 bg-gradient-to-b'} top-0 mx-auto z-20 justify-between w-full h-20 items-start`}
    >
      <div className='absolute bottom-0 w-full border-white/20 border-1 border-b'></div>

      {/* Logo */}
      <Link className='flex flex-1 py-2 items-center h-fit z-50' href={'/'}>
        <img className='ml-2 w-auto h-full' src={siteLauyout?.landingNavbarLogo} alt="" />
      </Link>

      {/* Desktop Menu */}
      <div className='md:flex hidden h-full items-center justify-center text-xs flex-2'>
        <NavLinks links={links} linkClassName={`hover:border-b-4 ${settings.bonnoTextGreen} h-full px-4 uppercase`} />
        {user?.role === 'admin' && <Link className={`hover:border-b-4 ${settings.bonnoBorderGreen} h-fit px-4 uppercase`} href={'/admin'}>dashboard</Link>}
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        links={links}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className={`flex-1 flex justify-end`}></div>

      {/* OPEN BTN */}
      {(!closeBtnState && pathname?.split('/').length >= 3) &&
        // <div
        //   onClick={() => setCloseBtnState(!closeBtnState)}
        //   className={`open-btn hidden absolute ${session?.user ? 'right-20' : 'right-0'} md:flex top-[11px] w-fit max-h-10 duration-700 ease-linear ${closeBtnState ? 'mr-[70px]' : 'mr-0'}`}
        // >
        //   <RollOverStateWrapper src={settings.btnsImages.btnOpen} />
        // </div>
        <div 
          onClick={() => setCloseBtnState(!closeBtnState)}
          className={`close-btn flex font-bold text-xs mt-2 shadow uppercase absolute z-20 ${settings.bonnoBlue} hover:bg-gray-400 cursor-pointer top-0 w-fit pl-6 pr-10 rounded-l-full min-h-12 items-center justify-center ${session?.user ? 'right-28' : 'right-0'} ${closeBtnState ? 'mr-[70px]' : 'mr-0'}`}
        >
          open
        </div>
      }

      {/* SIGN BTN */}
      {session?.user && <div className='sign-in-btn flex absolute right-0 z-50 top-2 w-fit h-fit'>
        <SignInBtn2 />
      </div>}

      {/* Mobile Menu Button */}
      <div className='mobile-sign-in h-full absolute md:hidden flex items-center justify-center my-auto  right-0 min-w-fit z-50'>
        {!mobileMenuOpen
          ? <IoIosMenu
            className='md:hidden text-4xl mr-2 cursor-pointer'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          : <IoIosClose
            className='md:hidden text-5xl mr-1 cursor-pointer'
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
        }

        {/* SIGN BUTTON */}
        <div className='w-fit h-fit'>
          {session?.user && (<SignInBtn2 />)}
        </div>
      </div>
    </nav>
  )
}
