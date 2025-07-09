'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('loggedIn', 'true');
      router.push('/home');
    } catch (err) {
      console.error('❌ Login failed:', err.message);
      setError('Invalid email or password.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-600 p-4 relative">
      <div className="absolute top-6 right-6">
        <img src="/Landmark.png" alt="Logitiq HR Logo" className="h-12" />
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-black">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Logitiq HR Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Log In
          </button>
        </form>
        <div className="text-center mt-4">
          <span className="text-gray-700">Don't have an account? </span>
          <a href="/register" className="text-blue-700 underline hover:text-blue-900">Register</a>
        </div>
      </div>
    </main>
  );
}