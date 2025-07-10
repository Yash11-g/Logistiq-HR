import fs from 'fs';
import path from 'path';

// File path for storing tokens
const TOKENS_FILE = path.join(process.cwd(), 'tokens.json');

// Ensure tokens file exists
const ensureTokensFile = () => {
  if (!fs.existsSync(TOKENS_FILE)) {
    fs.writeFileSync(TOKENS_FILE, '{}');
  }
};

// Read tokens from file
const readTokens = () => {
  ensureTokensFile();
  try {
    const data = fs.readFileSync(TOKENS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading tokens file:', error);
    return {};
  }
};

// Write tokens to file
const writeTokens = (tokens) => {
  ensureTokensFile();
  try {
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error('Error writing tokens file:', error);
  }
};

export async function POST(request) {
  try {
    const { shortId, token } = await request.json();
    
    if (!shortId || !token) {
      return Response.json({ error: 'Missing shortId or token' }, { status: 400 });
    }

    // Read existing tokens
    const tokens = readTokens();
    
    // Store the token with the short ID
    tokens[shortId] = token;
    
    // Write back to file
    writeTokens(tokens);
    
    console.log(`✅ Token stored for shortId: ${shortId}`);
    console.log(`📊 Total tokens stored: ${Object.keys(tokens).length}`);
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('❌ Error storing token:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const shortId = searchParams.get('shortId');
    
    if (!shortId) {
      return Response.json({ error: 'Missing shortId' }, { status: 400 });
    }

    // Read tokens from file
    const tokens = readTokens();

    console.log(`🔍 Looking for shortId: ${shortId}`);
    console.log(`📊 Available tokens: ${Object.keys(tokens).join(', ')}`);

    const token = tokens[shortId];
    
    if (!token) {
      console.log(`❌ Token not found for shortId: ${shortId}`);
      return Response.json({ error: 'Token not found' }, { status: 404 });
    }

    console.log(`✅ Token found for shortId: ${shortId}`);
    return Response.json({ token });
  } catch (error) {
    console.error('❌ Error retrieving token:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
} 