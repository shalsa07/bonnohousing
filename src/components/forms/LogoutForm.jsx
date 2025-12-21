
'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutForm() {
  const router=useRouter()

  return (
    <form className='flex flex-col items-center w-full p-4 gap-2' >
      <span>Are you sure you want to sign out?</span>
      <button type="button" className='flex text-gray-500 items-center justify-center underline cursor-pointer p-2 w-full' onClick={() => router.back()}>
        Click here to go back !
      </button>
      <button type="button" className='flex bg-gray-400 items-center justify-center text-white cursor-pointer p-2 w-full' onClick={() => signOut({ callbackUrl: '/' })}>
        Click here to sign out
      </button>
    </form>
  );
}
