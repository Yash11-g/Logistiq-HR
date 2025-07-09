import puppeteer from 'puppeteer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const data = await req.json();

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #2E65F3; }
            h2 { margin-top: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; }
            .value { margin-left: 10px; }
            .value-block { white-space: pre-wrap; background: #f5f5f5; padding: 10px; border-radius: 6px; }
          </style>
        </head>
        <body>
          <h1>Candidate Debrief</h1>
          <div class="section"><span class="label">Name:</span><span class="value">${data.candidateName}</span></div>
          <div class="section"><span class="label">Role:</span><span class="value">${data.role}</span></div>
          <div class="section"><span class="label">Location:</span><span class="value">${data.location}</span></div>
          <div class="section"><span class="label">Organization:</span><span class="value">${data.organization}</span></div>
          <div class="section"><span class="label">Experience:</span><span class="value">${data.experience}</span></div>

          <h2>Values</h2>
          ${Object.entries(data.values || {}).map(([key, val]) => `
            <div class="section">
              <div class="label">${key}</div>
              <div class="value-block">${val}</div>
            </div>
          `).join('')}

          <h2>Strengths</h2>
          <div class="value-block">${data.strengths}</div>

          <h2>Areas of Improvement</h2>
          <div class="value-block">${data.improvements}</div>

          <h2>Points for Discussion</h2>
          <div class="value-block">${data.discussionPoints}</div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: 'new', // use 'new' for Puppeteer v20+ to avoid headless warnings
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="debrief.pdf"',
      },
    });
  } catch (err) {
    console.error('❌ PDF generation failed:', err);
    return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
  }
}