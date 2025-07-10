"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Registration successful! Redirecting to homepage...');
      setTimeout(() => router.push('/home'), 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-blue-600 p-4 relative">
      <div className="absolute top-6 right-6">
        <img src="/Landmark.png" alt="Logitiq HR Logo" className="h-12" />
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md w-full text-black">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded text-black bg-gray-50 focus:outline-blue-600"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded text-black bg-gray-50 focus:outline-blue-600"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">Register</button>
          {error && <div className="text-red-600 text-center text-sm">{error}</div>}
          {success && <div className="text-green-600 text-center text-sm">{success}</div>}
        </form>
      </div>
    </main>
  );
} 