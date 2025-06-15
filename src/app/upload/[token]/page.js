'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function UploadPage() {
  const { token } = useParams();
  const [interviewer, setInterviewer] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {
    try {
      const safeToken = decodeURIComponent(token);
      const decoded = JSON.parse(atob(safeToken));
      setInterviewer(decoded.interviewer);
      setValue(decoded.value);
    } catch (err) {
      console.error("❌ Token decoding failed:", err);
    }
  }, [token]);

  const pdfFile = value ? `/questions/${value}_Template.pdf` : null;

  return (
    <div className="min-h-screen bg-[#2E65F3] p-6 text-white">
      <div className="flex items-center mb-6">
        <img src="/Landmark.png" alt="Logo" className="h-12" />
      </div>

      <div className="bg-white text-black max-w-xl mx-auto p-6 rounded-xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-800">Transcript Upload Page</h1>

        {interviewer && value ? (
          <>
            <p className="mb-2 font-semibold">Interviewer: <span className="text-gray-800">{interviewer}</span></p>
            <p className="mb-6 font-semibold">Assigned Value: <span className="text-gray-800">{value}</span></p>

            {pdfFile && (
              <a
                href={pdfFile}
                download
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                📄 Download {value} Questions
              </a>
            )}
          </>
        ) : (
          <p className="text-red-600 font-semibold">Invalid or expired link.</p>
        )}
      </div>
    </div>
  );
}