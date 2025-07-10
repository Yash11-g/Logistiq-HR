'use client';

import { useRouter } from 'next/navigation';
import useAuthRedirect from '../../hooks/useAuthRedirect';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import { useState } from 'react';
import { FaUsers, FaCheckCircle, FaHourglassHalf, FaEye } from 'react-icons/fa';

export default function HomeDashboard() {
  useAuthRedirect();

  const router = useRouter();

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const mockCandidates = [
    { name: 'Pratham Gupta', rounds: 3, status: 'Hired', role: 'SDE II - Frontend' },
    { name: 'Vidhi kulshrestha', rounds: 2, status: 'Not Hired', role: 'Product Manager' },
    { name: 'Ajay Sharma', rounds: 1, status: 'Pending', role: 'QA Engineer' },
    { name: 'Rohit Verma', rounds: 4, status: 'Hired', role: 'Backend Developer' },
    { name: 'Sneha Iyer', rounds: 2, status: 'Pending', role: 'UI/UX Designer' },
    { name: 'Amitabh Singh', rounds: 3, status: 'Not Hired', role: 'DevOps Engineer' },
    { name: 'Priya Nair', rounds: 4, status: 'Hired', role: 'Data Scientist' },
    { name: 'Vikram Patel', rounds: 1, status: 'Pending', role: 'Business Analyst' },
    { name: 'Meera Joshi', rounds: 2, status: 'Not Hired', role: 'HR Manager' },
    { name: 'Siddharth Rao', rounds: 3, status: 'Pending', role: 'Mobile Developer' }
  ];

  // Summary metrics
  const total = mockCandidates.length;
  const hired = mockCandidates.filter(c => c.status === 'Hired').length;
  const pending = mockCandidates.filter(c => c.status === 'Pending').length;
  const totalRounds = 4; // Assume 4 total rounds for all candidates

  // Filtered and sorted candidates
  let filtered = mockCandidates.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase()) ||
    c.status.toLowerCase().includes(search.toLowerCase())
  );
  if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      if (a[sortKey] < b[sortKey]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortKey] > b[sortKey]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <main className="min-h-screen bg-[#2E65F3] flex flex-col items-center p-0 text-black relative">
      {/* Top Bar with Logo and Logout */}
      <div className="w-full flex items-center justify-between px-8 pt-8">
        <img src="/Landmark.png" alt="Logistiq HR Logo" className="h-10" />
        <button
          onClick={() => signOut(auth)}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full shadow-lg text-base font-bold transition-colors"
          title="Logout"
        >
          Logout
        </button>
      </div>

      {/* Interview Overview Title */}
      <div className="w-full flex flex-col items-center mt-2 mb-4">
        <h1 className="text-4xl font-extrabold text-white text-center mb-2">Interview Overview</h1>
      </div>

      <div className="w-full max-w-5xl mx-auto pb-32"> {/* Add bottom padding to prevent underlap */}
        {/* Stat Cards */}
        <div className="flex gap-4 justify-center mb-8 mt-0 w-full">
          <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center min-w-[90px] max-w-[100px]">
            <FaUsers className="text-xl text-blue-500 mb-1" />
            <div className="text-xl font-extrabold text-blue-700">{total}</div>
            <div className="text-gray-600 text-xs font-semibold mt-0.5 text-center">Total</div>
          </div>
          <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center min-w-[90px] max-w-[100px]">
            <FaCheckCircle className="text-xl text-green-500 mb-1" />
            <div className="text-xl font-extrabold text-green-600">{hired}</div>
            <div className="text-gray-600 text-xs font-semibold mt-0.5 text-center">Hired</div>
          </div>
          <div className="bg-white rounded-xl shadow p-3 flex flex-col items-center min-w-[90px] max-w-[100px]">
            <FaHourglassHalf className="text-xl text-orange-400 mb-1" />
            <div className="text-xl font-extrabold text-orange-500">{pending}</div>
            <div className="text-gray-600 text-xs font-semibold mt-0.5 text-center">Pending</div>
          </div>
        </div>

        {/* Search Bar and New Interview Button Row */}
        <div className="flex items-center mb-6 gap-4 w-full max-w-5xl px-2">
          <input
            type="text"
            placeholder="Search by name, role, or status…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="px-4 py-2 rounded-full border border-gray-200 w-64 shadow-inner bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200 text-base"
          />
          <div className="flex-1" />
          <button
            onClick={() => router.push('/')}
            className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 font-semibold shadow"
          >
            New Interview
          </button>
        </div>

        {/* Candidate List Header Tile - pill shape */}
        <div className="grid grid-cols-5 gap-4 font-semibold bg-white/90 text-blue-700 px-8 py-4 rounded-full shadow text-center mb-4 w-full max-w-5xl">
          <div>Name</div>
          <div>Rounds</div>
          <div>Status</div>
          <div>Role</div>
          <div>Progress</div>
        </div>

        {/* Candidate Cards - pill shape */}
        <div className="flex flex-col gap-4 w-full max-w-5xl">
          {filtered.map((candidate, idx) => (
            <div key={idx} className="bg-white px-8 py-6 rounded-full shadow flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-1 grid grid-cols-5 gap-4 items-center w-full">
                <div className="text-center font-semibold text-lg">{candidate.name}</div>
                <div className="text-center">{candidate.rounds}</div>
                <div className="flex justify-center">
                  <span className={
                    candidate.status === 'Hired' ? 'bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold' :
                    candidate.status === 'Not Hired' ? 'bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold' :
                    'bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold'
                  }>
                    {candidate.status}
                  </span>
                </div>
                <div className="text-center">{candidate.role}</div>
                <div>
                  <div className="w-full bg-gray-200 rounded h-3">
                    <div
                      className="bg-blue-600 h-3 rounded"
                      style={{ width: `${(candidate.rounds / totalRounds) * 100}%` }}
                    />
                  </div>
                  <div className="text-xs text-center mt-1">{candidate.rounds} / {totalRounds} rounds</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}