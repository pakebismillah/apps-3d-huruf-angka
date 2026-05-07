import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

// Load .env manually
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w]+)\s*=\s*'?([^'\r\n]*)'?\s*$/);
    if (match) process.env[match[1]] = match[2];
  });
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY not found!');
  process.exit(1);
}

async function listAllVoicesBrief() {
  const res = await fetch('https://api.elevenlabs.io/v1/voices', {
    headers: { 'xi-api-key': API_KEY }
  });
  const data = await res.json();
  const brief = data.voices.map(v => ({ id: v.voice_id, name: v.name, category: v.category }));
  console.log(JSON.stringify(brief, null, 2));
}

listAllVoicesBrief();
