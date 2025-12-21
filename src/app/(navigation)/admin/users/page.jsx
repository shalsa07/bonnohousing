import { auth } from '@/auth';
import clientPromise from '@/libs/db';
import UsersPageClient from '@/components/admin/UsersPageClient';

export default async function UsersPage() {
  const session = await auth();
  const client = await clientPromise;
  const db = client.db("bonnohousing");

  const users = await db.collection('users')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  // Serialize users for client component
  const serializedUsers = users.map(user => ({
    id: user._id.toString(),
    name: user.name || 'Unknown',
    email: user.email || '',
    image: user.image || null,
    role: user.role || 'user',
    createdAt: user.createdAt ? user.createdAt.toISOString() : null
  }));

  return <UsersPageClient users={serializedUsers} currentUser={session?.user} />;
}
