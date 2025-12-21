import { auth } from '@/auth';

export default async function AdminLayout({ children }) {
  const session = await auth();
  // console.log('AdminLayout session:', session);

  if (!session || session.user.role !== 'admin') {
    return (
      <div className='flex text-gray-500 flex-col h-screen w-full items-center justify-center'>
        <h1 className='text-3xl font-bold mb-2'>Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  return <div>{children}</div>;
}
