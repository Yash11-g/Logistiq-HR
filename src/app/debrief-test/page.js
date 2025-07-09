async function handleWithGemini(transcriptText) {
  const apiKey = 'AIzaSyDw3z5T8bDvmjR0eaJntUZh-UDu_V6W2b4';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

  const prompt = `
You're an AI assistant for HR debriefs.

Based on the interview transcript below, extract the following in valid JSON:

{
  "candidateName": "",
  "role": "",
  "location": "",
  "organization": "",
  "experience": "",
  "values": {
    "Integrity": "",
    "Listen": "",
    "Empower": "",
    "Adapt": "",
    "Deliver": ""
  },
  "strengths": "",
  "improvements": "",
  "discussionPoints": ""
}

Here is the transcript:
"""
${transcriptText}
"""
Return only the JSON, no explanations.
`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });

  const data = await res.json();
  const aiReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  try {
    const match = aiReply.match(/\{[^]*\}/);
    return NextResponse.json(JSON.parse(match[0]));
  } catch (err) {
    return NextResponse.json({
      candidateName: "",
      role: "",
      location: "",
      organization: "",
      experience: "",
      values: {
        Integrity: "",
        Listen: "",
        Empower: "",
        Adapt: "",
        Deliver: ""
      },
      strengths: "",
      improvements: "",
      discussionPoints: "",
      error: "Failed to parse Gemini response"
    }, { status: 500 });
  }
}