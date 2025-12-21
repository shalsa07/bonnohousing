
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FcGoogle } from "react-icons/fc";
import { FaGoogle } from "react-icons/fa";
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn('email', { email });
  };

  return (
    <form className='flex flex-col w-full p-4' onSubmit={handleSubmit}>
      <button className='flex bg-gray-300 items-center justify-center text-white cursor-pointer p-2 w-full' onClick={() => signIn('google')}>
        Sign in with Google
        <FaGoogle className='ml-2 text-xl' />
      </button>
      <hr className='w-full border-gray-300 my-4' />
      <div className='flex w-full h-fit flex-col gap-2'>
        {/* <label htmlFor="email">Email</label> */}
        <input
          className='border-2 border-gray-300 p-2 w-full'
          id="email"
          type="email"
          placeholder='Enter your email here...'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className='bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer p-2 w-full font-semibold' type="submit">Sign in with Email</button>
        <Link href={'/register'}>click here to register</Link>
      </div>
    </form>
  );
}
