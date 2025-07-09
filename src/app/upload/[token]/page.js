'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function UploadPage() {
  const { token } = useParams();
  const [decodedData, setDecodedData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    try {
      const base64 = decodeURIComponent(token);
      const decodedStr = atob(base64);
      const parsed = JSON.parse(decodedStr);
      setDecodedData(parsed);
    } catch (err) {
      console.error("❌ Token decoding failed:", err);
    } finally {
      setLoading(false); // ✅ end loading
    }
  }, [token]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadStatus("✅ Transcript uploaded successfully!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2E65F3] flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );
  }

  if (!decodedData) {
    return (
      <div className="min-h-screen bg-[#2E65F3] flex items-center justify-center text-white text-lg">
        Invalid or expired link.
      </div>
    );
  }

  const { interviewer, email, values = [] } = decodedData;

  return (
    <div className="min-h-screen bg-[#2E65F3] p-8">
      <img src="/Landmark.png" alt="Logistiq HR Logo" className="h-12 mb-6 ml-2" />

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md text-black">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-800">Transcript Upload Page</h2>

        <div className="mb-4">
          <p><strong>Interviewer Name:</strong> {interviewer}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Assigned Values:</strong> {values.join(', ')}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-md font-semibold text-gray-800 mb-2">Common Question Set</h3>
          <a
            href="/questions/Common_Question_Set.pdf"
            download
            className="bg-purple-600 text-white px-6 py-2 rounded text-center hover:bg-purple-700 transition block w-full text-sm"
          >
            📘 Download Common Question Set
          </a>
        </div>

        <div className="flex flex-col space-y-4 mb-4">
          {values.map((val, idx) => (
            <a
              key={idx}
              href={`/questions/${val}_Template.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="bg-blue-600 text-white px-6 py-2 rounded text-center hover:bg-blue-700"
            >
              Download {val} Question Set
            </a>
          ))}
        </div>

        <hr className="my-4" />

        <div>
          <label className="block font-medium mb-1 text-sm">Upload Your Transcript</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-700 bg-gray-100 rounded border p-2"
          />
          {uploadStatus && (
            <p className="text-green-600 text-sm mt-2">{uploadStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
}