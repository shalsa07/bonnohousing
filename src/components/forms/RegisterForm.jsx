
'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function RegisterForm() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signIn('email', { email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button type="submit">Register with Email</button>
      <button onClick={() => signIn('google')}>Register with Google</button>
    </form>
  );
}
