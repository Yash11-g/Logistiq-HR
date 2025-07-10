'use client';

import useAuthRedirect from '@/hooks/useAuthRedirect';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  useAuthRedirect();
  const [assignments, setAssignments] = useState([]);
  const [debrief, setDebrief] = useState('');
  const [debriefData, setDebriefData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('assignments');
    if (stored) {
      setAssignments(JSON.parse(stored));
    }
  }, []);

  const handleGenerateDebrief = async () => {
    const data = {
      debriefText:
        "Pratham Gupta demonstrated strong technical capabilities, ownership, and collaboration across interview rounds. He showed adaptability, a proactive mindset, and a willingness to improve. His background in React, mentoring, and team-first behavior make him a strong fit for the SDE II role.",
      candidateName: "Pratham Gupta",
      role: "SDE II - Frontend",
      location: "Bangalore",
      organization: "Trianz",
      experience: "3.8 years",
      values: {
        Integrity:
          "Displayed transparency during a delayed Akim feature rollout. Took accountability, aligned with QA and stakeholders to resolve blockers.",
        Empower:
          "Mentored junior developers, initiated internal Redux training, and led knowledge-sharing sessions across teams.",
        Listen:
          "Responded positively to tough feedback from initial projects. Took initiative to improve, upskilled quickly, and became more independent.",
        Adapt:
          "Proactively drove migration from legacy apps and championed modern tooling like React Hook Form despite initial resistance.",
        Deliver:
          "Successfully met tight timelines on critical features by mocking dependencies and collaborating cross-functionally to unblock QA."
      },
      strengths:
        "Excellent in debugging, problem-solving, mentoring, and React development. Strong collaboration and willingness to take ownership.",
      improvements:
        "Needs to strengthen system design thinking and be more assertive during cross-team discussions. Can improve delegation skills.",
      discussionPoints:
        "Explore growth path toward product engineering mindset. Validate alignment with frontend architectural decisions."
    };

    setDebrief(data.debriefText);
    setDebriefData(data);
  };

  const handleDownloadPDF = async () => {
    try {
      const res = await fetch('/api/downloaddebrief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(debriefData),
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'debrief.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('❌ Error downloading PDF:', err);
    }
  };

  const handleSendReminder = async (item) => {
    try {
      const res = await fetch('/api/sendMail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: item.email,
          link: item.link,
          message: `Hello ${item.interviewer},<br/><br/>This is a reminder to please upload your transcript for: <b>${(item.values || []).join(', ')}</b>.<br/>Use this link: <a href="${item.link}">${item.link}</a><br/><br/>Thank you!`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Reminder sent!');
      } else {
        alert('Failed to send reminder: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Failed to send reminder: ' + err.message);
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#2E65F3] flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <img src="/Landmark.png" alt="Logistiq Logo" className="h-12" />
      </div>

      <div className="absolute top-6 right-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded hover:bg-blue-100"
        >
          Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-white mb-10 text-center">Upload Tracker Dashboard</h1>

      <div className="w-full overflow-x-auto mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 min-w-[600px]">
          {['Interviewer', 'Assigned Value(s)', 'Status', 'Reminder'].map((header, colIdx) => (
            <div key={colIdx} className="flex flex-col items-center gap-4">
              <div className="w-44 py-2 px-4 bg-white/90 backdrop-blur-lg text-black rounded-full shadow font-semibold text-center">
                {header}
              </div>

              {assignments.map((item, rowIdx) => {
                let content;
                switch (colIdx) {
                  case 0: content = item.interviewer; break;
                  case 1: content = (item.values || []).join(', '); break;
                  case 2:
                    content = (
                      <span className="font-medium text-red-500">
                        Pending
                      </span>
                    );
                    break;
                  case 3:
                    content = (
                      <button
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                        onClick={() => handleSendReminder(item)}
                      >
                        Send Reminder
                      </button>
                    );
                    break;
                }

                return (
                  <div
                    key={rowIdx}
                    className="w-44 min-h-[44px] flex items-center justify-center text-black bg-white/90 backdrop-blur-lg rounded-xl shadow hover:scale-[1.03] transition-transform"
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Generate Debrief Button Centered */}
      <div className="flex flex-col items-center w-full max-w-3xl">
        {!debriefData && (
          <button
            onClick={handleGenerateDebrief}
            className="bg-green-600 hover:bg-green-700 text-white text-xl px-8 py-4 rounded font-semibold mb-8 shadow"
          >
            Generate Debrief
          </button>
        )}

        {/* Debrief Info Tile */}
        {debriefData && (
          <>
            <div className="bg-white p-8 rounded-xl shadow-md w-full mb-6 text-black">
              <h2 className="text-2xl font-bold mb-4 text-blue-800">AI Generated Debrief</h2>
              <div className="mb-2 text-black"><b>Candidate Name:</b> {debriefData.candidateName}</div>
              <div className="mb-2 text-black"><b>Role:</b> {debriefData.role}</div>
              <div className="mb-2 text-black"><b>Location:</b> {debriefData.location}</div>
              <div className="mb-2 text-black"><b>Organization:</b> {debriefData.organization}</div>
              <div className="mb-2 text-black"><b>Experience:</b> {debriefData.experience}</div>
              <div className="mb-4 text-black"><b>Debrief:</b> {debriefData.debriefText}</div>
              <div className="mb-4 text-black">
                <b>Values:</b>
                <ul className="list-disc ml-6 mt-2 text-black">
                  {Object.entries(debriefData.values || {}).map(([key, value]) => (
                    <li key={key} className="text-black"><b>{key}:</b> {value}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-2 text-black"><b>Strengths:</b> {debriefData.strengths}</div>
              <div className="mb-2 text-black"><b>Improvements:</b> {debriefData.improvements}</div>
              <div className="mb-2 text-black"><b>Discussion Points:</b> {debriefData.discussionPoints}</div>
            </div>
            <button
              onClick={handleDownloadPDF}
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700 font-semibold shadow"
            >
              Download Filled Debrief (PDF)
            </button>
          </>
        )}
      </div>
    </div>
  );
}