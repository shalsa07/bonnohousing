'use client'

import { settings } from '@/libs/settings'
import React from 'react'
import RollOverStateWrapper from './RollOverStateWrapper'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export default function SignInBtn() {
  // const session = await auth()
  const { data: session } = useSession()
  const pathname = usePathname()
  // console.log('signin btn',session)
  return (
    <Link href={`/signin?callbackUrl=${encodeURIComponent(pathname)}`} className='sign-in max-w-fit max-h-fit'>
      {/* {session 
        ? <div>
            <p>{session.user.name} </p>
            <div className='invisible'><RollOverStateWrapper src={settings.btnsImages.signin_1} /></div>
          </div> 
        : <RollOverStateWrapper src={settings.btnsImages.signin_1} />} */}
      <RollOverStateWrapper src={settings.btnsImages.signin_1} />
    </Link>
  )
}
