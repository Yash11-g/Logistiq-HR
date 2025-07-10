import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dqlajfxhw',
  api_key: '185355949678263',
  api_secret: '_AQ7Ce1fmFDtjYIVc6uwaoe5Fbw',
});

export async function POST(req) {
  const data = await req.formData();
  const file = data.get('file'); // 'file' is the field name

  if (!file) {
    return new Response(JSON.stringify({ error: 'No file uploaded' }), { status: 400 });
  }

  // Convert file to buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'raw' }, // 'raw' for PDFs and other non-image files
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(buffer);
    });

    return new Response(JSON.stringify({ url: uploadResult.secure_url }), { status: 200 });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
} 