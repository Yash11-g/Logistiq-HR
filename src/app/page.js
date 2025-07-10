'use client';
import useAuthRedirect from '@/hooks/useAuthRedirect';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

export default function Home() {
  const { loading, shouldRender } = useAuthRedirect();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    position: '',
    collegeName: '',
    yearPassedOut: '',
    branch: '',
    skills: '',
    cgpa: '',
  });

  if (loading || !shouldRender) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];

    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('resume', file);

    try {
      const response = await fetch('/api/parseResume', {
        method: 'POST',
        body: formDataUpload,
      });

      let result;
      try {
        if (!response.ok) {
          const text = await response.text();
          console.error("❌ Server Error:", text);
          alert("Server error: " + text);
          return;
        }

        result = await response.json();
      } catch (err) {
        console.error("❌ JSON parse failed:", err);
        alert("Something went wrong parsing the server response.");
        return;
      }

      if (result.error) {
        alert('❌ ' + result.error);
      } else {
        setFormData({
          name: result.name || '',
          location: result.location || '',
          position: '',
        });
        alert('✅ Resume parsed using AI!');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while parsing the resume.');
    }
  };

  return (
    <div className="min-h-screen bg-[#2E65F3] p-6 text-white relative">
      <div className="absolute top-6 left-6">
        <img src="/Landmark.png" alt="Logitiq HR" className="h-16 w-auto" />
      </div>

      <div className="max-w-2xl mx-auto mt-20 bg-white text-gray-800 p-8 rounded-2xl shadow-2xl">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">Candidate Details</h1>

        <div className="space-y-5">
          <div>
            <label className="block font-semibold mb-1 text-gray-700">
              Upload Resume
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleResumeUpload}
              className="w-full p-2 border rounded-lg bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Candidate Details</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="e.g. Bhopal"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="e.g. Product Manager"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">College Name</label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="e.g. Bennett University"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Year Passed Out</label>
            <input
              type="text"
              name="yearPassedOut"
              value={formData.yearPassedOut}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="e.g. 2023"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Branch</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="e.g. Computer Science"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="e.g. Leadership, JavaScript, Teamwork"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">CGPA (Optional)</label>
            <input
              type="text"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg bg-gray-50"
              placeholder="e.g. 8.5"
            />
          </div>
        </div>

        <div className="text-center mt-10 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="bg-blue-600 text-white font-bold px-6 py-3 rounded hover:bg-blue-700"
          >
            Back
          </button>
          <button
            onClick={() => {
              const candidateToken = encodeURIComponent(btoa(JSON.stringify(formData)));
              router.push(`/assign?candidate=${candidateToken}`);
            }}
            className="bg-blue-600 text-white font-bold px-6 py-3 rounded hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}