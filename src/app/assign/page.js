'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const valueOptions = ['Integrity', 'Listen', 'Empower', 'ADAPT', 'Deliver'];

export default function AssignPage() {
  const [assignments, setAssignments] = useState(
    Array(5).fill({ interviewer: '', value: '', link: '' })
  );

  const router = useRouter();

  const handleChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index] = { ...updated[index], [field]: value };
    setAssignments(updated);
  };

  const encodeToken = (data) => {
    const json = JSON.stringify(data);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return base64;
  };

  const handleGenerate = (index) => {
    const { interviewer, value } = assignments[index];
    if (!interviewer || !value) {
      alert("Please fill all fields.");
      return;
    }

    const token = encodeToken({ interviewer, value });
    const link = `${window.location.origin}/upload/${token}`;

    const updated = [...assignments];
    updated[index] = { ...updated[index], link };
    setAssignments(updated);
  };

  return (
    <div className="min-h-screen bg-[#2E65F3] p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <img src="/Landmark.png" alt="Logo" className="h-12" />
        <h1 className="text-2xl font-bold text-white text-center w-full -ml-12">
          Assign Interviewers to ILEAD Values
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {assignments.map((assignment, index) => (
          <div key={index} className="bg-white text-black rounded-lg shadow p-4 text-sm space-y-3">
            <label className="block mb-2 font-medium">Interviewer Name</label>
            <input
              type="text"
              className="w-full border rounded p-2 mb-4"
              value={assignment.interviewer}
              onChange={(e) => handleChange(index, 'interviewer', e.target.value)}
            />

            <label className="block mb-2 font-medium">Select Value</label>
            <select
              className="w-full border rounded p-2 mb-4"
              value={assignment.value}
              onChange={(e) => handleChange(index, 'value', e.target.value)}
            >
              <option value="">-- Select --</option>
              {valueOptions.map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>

            <button
              onClick={() => handleGenerate(index)}
              className="bg-blue-600 text-white py-1.5 px-3 rounded w-full text-sm hover:bg-blue-700"
            >
              Generate Upload Link
            </button>

            {assignment.link && (
              <div className="mt-2 text-xs break-words">
                <span className="font-semibold text-gray-700">Link:</span>{' '}
                <a
                  href={assignment.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {assignment.link}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}