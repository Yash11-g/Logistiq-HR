import nodemailer from 'nodemailer';

export async function POST(req) {
  const { email, link, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your Interview Upload Link',
    html: message
      ? `<p>${message}</p>`
      : `<p>Hello,</p>
         <p>Please use the following link to upload your interview transcript:</p>
         <a href="${link}">${link}</a>
         <p>Thank you!</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
} 