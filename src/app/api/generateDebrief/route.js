import { NextResponse } from 'next/server';

export async function POST(req) {
  const body = await req.json();
  const { transcriptText } = body;

  const provider = process.env.AI_PROVIDER;

  if (provider === 'gemini') {
    return await handleWithGemini(transcriptText);
  } else if (provider === 'openai') {
    return await handleWithOpenAI(transcriptText);
  } else {
    return NextResponse.json({ error: 'Unknown AI provider' }, { status: 400 });
  }
}

// Example implementations (to be filled with real logic)
async function handleWithGemini(transcriptText) {
  // Placeholder Gemini response
  return NextResponse.json({
    summary: "This is a mock Gemini-generated debrief.",
    highlights: ["Candidate demonstrated adaptability.", "Strong communication skills."],
    transcript: transcriptText,
  });
}

async function handleWithOpenAI(transcriptText) {
  // Placeholder OpenAI response
  return NextResponse.json({
    summary: "This is a mock OpenAI-generated debrief.",
    highlights: ["Candidate showed leadership potential.", "Good analytical thinking."],
    transcript: transcriptText,
  });
}