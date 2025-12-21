'use client';
import LoginForm from '@/components/forms/LoginForm';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const errorMessages = {
  OAuthAccountNotLinked:
    'This email is already linked with another provider. Please sign in with the provider you originally used.',
  CredentialsSignin:
    'Sign in failed. Please check your credentials and try again.',
  EmailSignInError:
    'There was an issue sending the sign-in email. Please try again.',
  default: 'An unexpected error occurred. Please try again.',
};

const ErrorDisplay = ({ error }) => {
  const message = errorMessages[error] || errorMessages.default;
  if (!error) return null;

  console.log(message);
  return (
    <div
      className='p-4 text-sm text-red-800 rounded-lg bg-red-50 w-full text-center'
      role='alert'
    >
      <span className='font-medium'>Error:</span> {message}
    </div>
  );
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl');

  return (
    <div className='login-wrapper flex h-screen w-full'>
      <div className='flex md:w-1/3 w-10/12 m-auto flex-col items-center border-[1px] border-gray-200 h-fit shadow-lg p-4'>
        <h1 className='text-3xl font-bold mt-2 text-center text-gray-500'>
          Sign In
        </h1>
        <ErrorDisplay error={error} />
        <p>please try signing again or user a different email</p>
        <LoginForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
