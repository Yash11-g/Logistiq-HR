'use client';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const valueOptions = ['Integrity', 'Listen', 'Empower', 'ADAPT', 'Deliver'];

export default function AssignPage() {
  useAuthRedirect();
  const [assignments, setAssignments] = useState([
    { round: 'Round 1', interviewer: '', email: '', values: [], link: '' },
  ]);

  const router = useRouter();

  const handleChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const handleValueChange = (index, value) => {
    const updated = [...assignments];
    const current = updated[index].values;
    if (current.includes(value)) {
      updated[index].values = current.filter((v) => v !== value);
    } else {
      updated[index].values = [...current, value];
    }
    setAssignments(updated);
  };

  const encodeToken = (data) => {
    const json = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return base64;
  };

  const handleGenerate = (index) => {
    const { interviewer, email, values } = assignments[index];
    if (!interviewer || !email || values.length === 0) {
      alert('Please fill all fields and select at least one value.');
      return;
    }

    const token = encodeToken({ interviewer, email, values });
    const link = `${window.location.origin}/upload/${token}`;

    const updated = [...assignments];
    updated[index].link = link;
    setAssignments(updated);
    localStorage.setItem('assignments', JSON.stringify(updated)); // Save to localStorage
  };

  const handleAddInterviewer = () => {
    setAssignments([
      ...assignments,
      {
        round: `Round ${assignments.length + 1}`,
        interviewer: '',
        email: '',
        values: [],
        link: '',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#2E65F3] p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <img src="/Landmark.png" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-white text-center w-full -ml-12">
          Assign Interviewers to ILEAD Values
        </h1>
      </div>

      <div className="space-y-6 max-w-5xl mx-auto">
        {assignments.map((item, index) => (
          <div key={index} className="bg-white text-black rounded-xl p-5 shadow space-y-3">
            <input
              type="text"
              placeholder="Round"
              value={item.round}
              readOnly
              className="w-full p-2 border rounded font-semibold text-blue-700 bg-gray-100 cursor-not-allowed"
            />
            <input
              type="text"
              placeholder="Interviewer Name"
              value={item.interviewer}
              onChange={(e) => handleChange(index, 'interviewer', e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Interviewer Email"
              value={item.email}
              onChange={(e) => handleChange(index, 'email', e.target.value)}
              className="w-full p-2 border rounded"
            />

            <label className="block font-semibold">Select Values</label>
            <div className="flex flex-wrap gap-2">
              {valueOptions.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleValueChange(index, val)}
                  className={`px-3 py-1 rounded-full border ${
                    item.values.includes(val)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>

            <button
              onClick={() => handleGenerate(index)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-3"
            >
              Generate Upload Link
            </button>

            {item.link && (
              <div className="text-sm break-words">
                <strong>Link:</strong>{' '}
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {item.link}
                </a>
              </div>
            )}
          </div>
        ))}

        <button
          onClick={handleAddInterviewer}
          className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 border"
        >
          + Add Interviewer
        </button>

        <div className="text-center mt-10">
          <button
            onClick={() => router.push('/dashboard')} // ✅ NOW GOES TO DASHBOARD
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded hover:bg-blue-100"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}