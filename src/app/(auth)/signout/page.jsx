
import LoginForm from '@/components/forms/LoginForm';
import LogoutForm from '@/components/forms/LogoutForm';

export default function LoginPage() {
  return (
    <div className='login-wrapper flex h-screen w-full'>
      <div className='flex md:w-1/3 w-10/12 m-auto flex-col items-center border-[1px] border-gray-200 h-fit shadow-lg p-4'>
        <h1 className='text-3xl font-bold mt-2 text-center text-gray-500'>Sign Out</h1>
        <LogoutForm />
      </div>
    </div>
  );
}
