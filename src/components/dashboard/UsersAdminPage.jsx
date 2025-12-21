import { auth } from '@/auth'
import clientPromise from '@/libs/db'
import React from 'react'

export default async function UsersAdminPage() {
  const session = await auth()
  const client = await clientPromise;
  const db = client.db();
  const users = await db.collection('users').find({}).toArray();
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1>Admin Page</h1>
      <p>Welcome, {session?.user?.name}!</p>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
