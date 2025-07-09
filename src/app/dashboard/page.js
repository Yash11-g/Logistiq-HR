'use client';

import useAuthRedirect from '@/hooks/useAuthRedirect';

import { useEffect, useState } from 'react';

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

  return (
    <div className="min-h-screen bg-[#2E65F3] flex flex-col items-center justify-center p-6">
      <div className="absolute top-6 left-6">
        <img src="/Landmark.png" alt="Logistiq Logo" className="h-12" />
      </div>

      <h1 className="text-3xl font-bold text-white mb-10 text-center">Upload Tracker Dashboard</h1>

      <div className="grid grid-cols-4 gap-6">
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
                    <button className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 text-sm">
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

      <div className="mt-12 bg-white/90 backdrop-blur-lg p-6 rounded shadow-md text-black w-full max-w-3xl">
        <h2 className="text-lg font-semibold mb-4">Generate AI Debrief</h2>
        <button
          onClick={handleGenerateDebrief}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
        >
          Generate Debrief
        </button>

        {debrief && (
          <div className="mt-4 whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">
            <strong>AI Generated Debrief:</strong>
            <p>{debrief}</p>
          </div>
        )}
        {debriefData && typeof debriefData === 'object' && (
          <button
            onClick={handleDownloadPDF}
            className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Download Filled Debrief (PDF)
          </button>
        )}
      </div>
    </div>
  );
}