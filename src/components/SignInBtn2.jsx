'use client'
import { settings } from '@/libs/settings'
import React from 'react'
import RollOverStateWrapper from './RollOverStateWrapper'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SignInBtn2() {
    const { data: session } = useSession()
    const pathname = usePathname()
    // console.log('signin btn',session?.user)

    // Don't render the sign-in link if we are already on the sign-in page.
    if (pathname === '/signin') return null;

  return (
    <div className='sign-in max-w-fit max-h-fit'>
      {session?.user
        ? <Link href="/signout" className='flex w-fit h-fit cursor-pointer -p-[2px] relative bg-white rounded-l-full items-center'>
            <div className='flex w-full gap-2 h-14 items-center'>
              <div className='flex w-12 h-12 ml-1 rounded-full overflow-hidden'>
                <img src={session?.user?.image} alt="" />
              </div>
              <div className='flex flex-col gap-1 w-fit h-fit'>
                <span className='w-fit text-center text-gray-500 capitalize mr-4 font-bold'>sign out</span>
              </div>
            </div>
            <div className='absolute right-0 my-auto flex w-fit h-fit invisible'>
              <RollOverStateWrapper src={settings.btnsImages.signin_2} />
            </div>
          </Link>
        : <Link href={`/signin?callbackUrl=${encodeURIComponent(pathname)}`}>
            <RollOverStateWrapper 
              src={settings.btnsImages.signin_2}
            />
          </Link>
      }
    </div>
  )
}
