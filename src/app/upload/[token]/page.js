'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function UploadPage() {
  const { token } = useParams();
  const [decodedData, setDecodedData] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      console.log(`🔍 Loading token: ${token}`);
      try {
        // First, try to decode the token directly from URL (for full token links)
        const decodedStr = atob(token);
        const parsed = JSON.parse(decodedStr);
        console.log('✅ Token decoded directly from URL');
        setDecodedData(parsed);
      } catch (err) {
        console.log('❌ Direct decoding failed, trying localStorage...');
        // If direct decoding fails, try to get from localStorage (for local short links)
        try {
          const storedToken = localStorage.getItem(`upload_token_${token}`);
          if (storedToken) {
            const decodedStr = atob(storedToken);
            const parsed = JSON.parse(decodedStr);
            console.log('✅ Token found in localStorage');
            setDecodedData(parsed);
          } else {
            console.log('❌ Token not in localStorage, trying server...');
            // If not in localStorage, try to get from server (for email short links)
            const res = await fetch(`/api/storeToken?shortId=${token}`);
            if (res.ok) {
              const data = await res.json();
              const decodedStr = atob(data.token);
              const parsed = JSON.parse(decodedStr);
              console.log('✅ Token found on server');
              setDecodedData(parsed);
            } else {
              console.error('❌ Token not found anywhere');
              setNotFound(true);
            }
          }
        } catch (localStorageErr) {
          console.error('❌ Token decoding failed:', localStorageErr);
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, [token]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus('Uploading...');
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/uploadToCloudinary', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setUploadStatus(
          <span>
            ✅ Transcript uploaded! <a href={data.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View PDF</a>
          </span>
        );
      } else {
        setUploadStatus('❌ Upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      setUploadStatus('❌ Upload failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2E65F3] flex items-center justify-center text-white text-lg">
        Loading...
      </div>
    );
  }

  if (notFound || !decodedData) {
    return (
      <div className="min-h-screen bg-[#2E65F3] flex items-center justify-center text-white text-lg">
        Invalid or expired link.
      </div>
    );
  }

  const { interviewer, email, values = [], candidate } = decodedData;
  const candidateDetails = candidate || {};
  const uploadLabels = ['Common Question', ...values];

  return (
    <div className="min-h-screen bg-[#2E65F3] p-8">
      <img src="/Landmark.png" alt="Logistiq HR Logo" className="h-12 mb-6 ml-2" />

      <div className="max-w-3xl mx-auto grid gap-6">
        {/* Candidate Details Tile */}
        <div className="bg-white p-6 rounded-xl shadow-md text-black">
          <h2 className="text-lg font-bold mb-2 text-blue-800">Candidate Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div><strong>Name:</strong> {candidateDetails.name || '-'}</div>
            <div><strong>Location:</strong> {candidateDetails.location || '-'}</div>
            <div><strong>Position:</strong> {candidateDetails.position || '-'}</div>
            <div><strong>College Name:</strong> {candidateDetails.collegeName || '-'}</div>
            <div><strong>Year Passed Out:</strong> {candidateDetails.yearPassedOut || '-'}</div>
            <div><strong>Branch:</strong> {candidateDetails.branch || '-'}</div>
            <div><strong>Skills:</strong> {candidateDetails.skills || '-'}</div>
            <div><strong>CGPA:</strong> {candidateDetails.cgpa || '-'}</div>
          </div>
        </div>

        {/* Interview Info Tile */}
        <div className="bg-white p-6 rounded-xl shadow-md text-black">
          <h2 className="text-lg font-bold mb-2 text-blue-800">Interview Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div><strong>Interviewer Name:</strong> {interviewer}</div>
            <div><strong>Email:</strong> {email}</div>
            <div className="sm:col-span-2"><strong>Assigned Values:</strong> {values.join(', ') || '-'}</div>
          </div>
        </div>

        {/* Download Questions Tile */}
        <div className="bg-white p-6 rounded-xl shadow-md text-black">
          <h2 className="text-lg font-bold mb-2 text-blue-800">Download Question Sets</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="/questions/Common_Question_Set.pdf"
              download
              className="bg-purple-600 text-white px-6 py-2 rounded text-center hover:bg-purple-700 transition block w-full text-sm"
            >
              📘 Download Common Question Set
            </a>
            {values.map((val, idx) => (
              <a
                key={idx}
                href={`/questions/${val}_Template.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="bg-blue-600 text-white px-6 py-2 rounded text-center hover:bg-blue-700 block w-full text-sm"
              >
                Download {val} Question Set
              </a>
            ))}
          </div>
        </div>

        {/* Upload Tile */}
        <div className="bg-white p-6 rounded-xl shadow-md text-black">
          <label className="block font-bold mb-2 text-blue-800 text-lg">
            Upload your transcript for: {uploadLabels.join(', ')}
          </label>
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