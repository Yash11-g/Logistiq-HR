import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    candidate: "Pratham Gupta",
    position: "Frontend SDE",
    questions: [
      {
        question: "Please share an example wherein you were not able to meet a commitment at work. How did you communicate with the relevant people on your failure? What actions did you take to correct/improve the situation?",
        answer: "Pratham described a situation where a last-minute change in backend requirements significantly impacted his ability to deliver a feature on time. Despite having initially completed his work, two critical changes were introduced late, forcing him to do extra development. He immediately discussed the issue to his manager, who granted a 5-day extension for this. Pratham collaborated closely with the QA team, working extra hours to complete development and testing before the official release.",
        summary: "AI Summary: Pratham took responsibility for the delay, communicated proactively, and worked extra hours to meet the deadline, showing accountability and teamwork."
      },
      {
        question: "Please share an example wherein you had a strong disagreement with your manager or your leadership. How did you put your point forward and how did the discussion progress?",
        answer: "Pratham shared an experience during a migration project from AngularJS to React 18 where he disagreed with the use of the existing form library, Final Form, due to recurring issues. He proposed using a new validation library and presented his reasoning. However, his suggestion was not accepted because the team prioritized consistency across projects and had already standardized on Final Form through their component library.",
        summary: "AI Summary: Pratham explained his concerns respectfully, proposed alternatives, and collaborated well, demonstrating good communication and openness to team decisions."
      },
      {
        question: "Please share an example wherein you got very hard feedback. How did you react to the same? How did you act on the feedback?",
        answer: "Pratham shared an example where, as a fresher, he initially struggled to understand the project and took longer to complete tasks. He often asked a lot of questions, which led to feedback from his manager, who told him he couldn't always rely on others for help. Recognizing this, Pratham worked on improving his knowledge by learning more about the code, taking help from his manager to understand priorities and Jira, and actively participating in discussions. Over time, he was able to manage his tasks better, especially on the UI side, and no longer faced dependencies. However, he is still working on improving his backend skills.",
        summary: "AI Summary: Pratham responded positively to feedback, improved his skills, and became more independent, showing a growth mindset."
      },
      {
        question: "Please share an example wherein you were not happy with the way your colleague/team members were working. How did you share your feedback/inputs with your colleague/team member?",
        answer: "Pratham shared an experience where they had a senior team member who was rude and unprofessional, especially when Pratham, being a junior, made mistakes or didn't understand something immediately. The senior colleague would yell or shout, which created a toxic environment. Initially, Pratham tried to address the behavior directly with the colleague, but nothing changed. Feeling uncomfortable and demotivated, Pratham escalated the issue to their manager. Pratham's manager took the matter seriously and handled the situation. Over time, the senior colleague's behavior improved. Despite the early challenges, the issue was resolved through proper communication and support from the manager.",
        summary: "AI Summary: Pratham handled conflict appropriately, escalating when necessary, and showed good judgment in resolving team issues."
      }
    ]
  });
}

export const POST = GET;