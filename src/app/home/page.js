'use client';

import { useRouter } from 'next/navigation';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

export default function HomeDashboard() {
  useAuthRedirect();

  const router = useRouter();

  const mockCandidates = [
    { name: 'Pratham Gupta', rounds: 3, status: 'Hired' },
    { name: 'Jane Doe', rounds: 2, status: 'Not Hired' },
    { name: 'Ajay Sharma', rounds: 1, status: 'Pending' }
  ];

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-700">Interview Summary</h1>
        <button
          onClick={() => router.push('/assign')}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          New Interview
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 font-semibold bg-white p-4 rounded shadow">
        <div>Name</div>
        <div>Rounds</div>
        <div>Status</div>
      </div>

      {mockCandidates.map((candidate, idx) => (
        <div key={idx} className="grid grid-cols-3 gap-4 bg-white mt-2 p-4 rounded shadow">
          <div>{candidate.name}</div>
          <div>{candidate.rounds}</div>
          <div className={
            candidate.status === 'Hired' ? 'text-green-600' :
            candidate.status === 'Not Hired' ? 'text-red-600' : 'text-yellow-600'
          }>
            {candidate.status}
          </div>
        </div>
      ))}

      <div className="mt-12 flex justify-center">
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </main>
  );
}