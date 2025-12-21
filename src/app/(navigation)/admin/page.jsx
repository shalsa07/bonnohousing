import { auth } from '@/auth';
import AdminDashboard from '@/components/admin/AdminDashboard';
import PagesWrapper from '@/components/PagesWrapper';

export default async function AdminPage() {
  const session = await auth();

  return (<PagesWrapper>
    <AdminDashboard session={session} />
  </PagesWrapper>);
}
