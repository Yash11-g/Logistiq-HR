'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function UploadPage() {
  const { token } = useParams();
  const [interviewer, setInterviewer] = useState('');
  const [value, setValue] = useState('');

 useEffect(() => {
  try {
    // 1. Decode the URI-encoded token
    const decodedURIComponent = decodeURIComponent(token);

    // 2. Convert to proper base64 (if needed)
    let base64 = decodedURIComponent.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }

    // 3. Decode base64 and parse JSON
    const decodedStr = atob(base64);
    const parsed = JSON.parse(decodedStr);

    setInterviewer(parsed.interviewer || '');
    setValue(parsed.value || '');
  } catch (err) {
    console.error("❌ Token decoding failed:", err);
  }
}, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Uploaded file:', file.name);
    }
  };

  return (
    <div className="min-h-screen bg-[#2E65F3] p-6">
      <img
        src="/Landmark.png"
        alt="Logistiq Logo"
        className="h-14 mb-6 ml-2"
      />

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-xl font-bold text-center text-blue-700 mb-4">
          Transcript Upload Page
        </h1>

        <p className="text-sm text-gray-700 mb-1">
          <strong>Interviewer:</strong> {interviewer || 'N/A'}
        </p>
        <p className="text-sm text-gray-700 mb-4">
          <strong>Assigned Value:</strong> {value || 'N/A'}
        </p>

        {value && (
          <a
            href={`/questions/${value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}_Template.pdf`}
            download
            className="block bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 mb-4"
          >
            Download {value} Question Set
          </a>
        )}

        <label className="block text-gray-700 text-sm mb-2">
          Upload your transcript here
        </label>
        <input
          type="file"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded p-2"
        />
      </div>
    </div>
  );
}