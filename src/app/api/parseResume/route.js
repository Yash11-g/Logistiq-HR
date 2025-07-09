import { NextResponse } from 'next/server';

export async function POST(req) {
  console.log("🔥 AI resume parser triggered");

  try {
    const formData = await req.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString('base64');

    const provider = process.env.AI_PROVIDER;

    let responseText;

    if (provider === 'gemini') {
      responseText = await parseWithGemini(base64);
    } else if (provider === 'openai') {
      responseText = await parseWithOpenAI(base64);
    } else {
      return NextResponse.json({ error: 'Unsupported AI provider' }, { status: 500 });
    }

    console.log("📤 AI parsed output:", responseText);
    return NextResponse.json(responseText);

  } catch (err) {
    console.error('❌ Parsing failed:', err);
    return NextResponse.json({ error: 'Parsing failed' }, { status: 500 });
  }
}

async function parseWithGemini(base64) {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const prompt = `
You're an API that extracts information from resumes. Only respond with valid JSON and nothing else.

Extract the following fields:
- Candidate Name
- Location
- Position (if mentioned)
- College Name (most recent)
- Year Passed Out
- Branch
- Skills
- CGPA (if available)

Return exactly this JSON:
{
  "name": "",
  "location": "",
  "position": "",
  "collegeName": "",
  "yearPassedOut": "",
  "branch": "",
  "skills": "",
  "cgpa": ""
}

Resume is base64-encoded and attached below.
`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64,
              },
            },
          ],
        },
      ],
    }),
  });
  const data = await res.json();
  console.log("📦 Gemini full response:", JSON.stringify(data, null, 2));
  const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log("🧠 Gemini raw reply:", aiReply);
  if (!aiReply) {
    console.error("❌ Gemini error response:", JSON.stringify(data.error, null, 2));
    return {
      name: '',
      location: '',
      position: '',
      collegeName: '',
      yearPassedOut: '',
      branch: '',
      skills: '',
      cgpa: '',
      error: 'Gemini did not return any content. Status: ' + data?.error?.status
    };
  }

  try {
    return JSON.parse(aiReply);
  } catch {
    const match = aiReply.match(/\{[\s\S]*?\}/);
    return match ? JSON.parse(match[0]) : {
      name: '',
      location: '',
      position: '',
      collegeName: '',
      yearPassedOut: '',
      branch: '',
      skills: '',
      cgpa: '',
      error: 'Failed to parse Gemini reply'
    };
  }
}

async function parseWithOpenAI(base64) {
  return {
    name: "Demo Name",
    location: "Demo Location",
    note: "Switching to Gemini recommended.",
  };
}