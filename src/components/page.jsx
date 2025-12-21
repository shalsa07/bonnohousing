'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    // Redirect to the homepage after sign-out is complete
    router.push('/');
    router.refresh(); // Ensures the client-side cache is cleared
  };

  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='flex w-10/12 max-w-md flex-col items-center rounded-lg border border-gray-200 p-8 text-center shadow-lg'>
        <h1 className='text-2xl font-bold text-gray-700'>Sign Out</h1>
        <p className='mt-4 text-gray-600'>Are you sure you want to sign out?</p>
        <button onClick={handleSignOut} className='mt-6 w-full rounded-md bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600'>
          Sign Out
        </button>
        <button onClick={() => router.back()} className='mt-2 w-full rounded-md bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300'>
          Cancel
        </button>
      </div>
    </div>
  );
}