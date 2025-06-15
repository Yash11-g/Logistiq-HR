export const dynamic = 'force-dynamic';

import { OpenAI } from 'openai';
const pdf = require('pdf-parse/lib/pdf-parse.js'); // ✅ FIXED HERE

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let extractedText = '';
  try {
    const data = await pdf(buffer);
    extractedText = data.text;
    console.log("✅ Extracted Text:", extractedText.slice(0, 500));
  } catch (err) {
    console.error("❌ PDF extraction failed:", err);
    return new Response(JSON.stringify({ error: 'PDF extraction failed' }), { status: 500 });
  }
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
Extract the following:
- Full Name
- Current Location (city or state)

Respond only in JSON format. Example:
{
  "name": "Jane Doe",
  "location": "Bhopal"
}

Resume:
"""
${extractedText}
"""
`;

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const aiText = chat.choices[0].message.content?.trim();
    console.log("🔍 OpenAI Response:", aiText);

    if (!aiText || !aiText.startsWith('{')) {
      return new Response(JSON.stringify({ error: 'Invalid JSON returned' }), { status: 500 });
    }

    const json = JSON.parse(aiText);
    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json' },
    });

} catch (err) {
  console.error('❌ OpenAI Error:', err.message || err);
  return new Response(JSON.stringify({
    error: 'OpenAI failed to generate response',
    message: err.message || String(err),
  }), { status: 500 });
}
}