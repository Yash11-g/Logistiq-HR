import nodemailer from 'nodemailer';

export async function POST(req) {
  const { email, link, message } = await req.json();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your_gmail@gmail.com', // <-- replace with your actual Gmail address
      pass: 'your_gmail_app_password', // <-- replace with your actual Gmail app password
    },
  });

  const mailOptions = {
    from: 'your_gmail@gmail.com', // <-- replace with your actual Gmail address
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