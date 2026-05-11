/**
 * Script generate audio TTS (ElevenLabs) untuk Tadika
 * 
 * Jalankan:
 *   node scripts/generate-audio.mjs
 * 
 * Pastikan file .env di root project berisi:
 *   ELEVENLABS_API_KEY='sk_xxxxx'
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'public', 'assets', 'audio');

// Load .env manually
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w]+)\s*=\s*'?([^'\r\n]*)'?\s*$/);
    if (match) process.env[match[1]] = match[2];
  });
}

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const API_KEY = process.env.ELEVENLABS_API_KEY;
if (!API_KEY) {
  console.error('❌ ELEVENLABS_API_KEY tidak ditemukan di .env!');
  process.exit(1);
}

const VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Sarah

// Pelafalan bahasa Indonesia agar tidak dibaca gaya Inggris
// Pelafalan huruf yang lebih konsisten untuk AI
const pelafalanHuruf = {
  a: 'Huruf A',
  b: 'Huruf B',
  c: 'Huruf C',
  d: 'Huruf D',
  e: 'Huruf E',
  f: 'Huruf F',
  g: 'Huruf G',
  h: 'Huruf H',
  i: 'Huruf I',
  j: 'Huruf J',
  k: 'Huruf K',
  l: 'Huruf L',
  m: 'Huruf M',
  n: 'Huruf N',
  o: 'Huruf O',
  p: 'Huruf P',
  q: 'Huruf Q',
  r: 'Huruf R',
  s: 'Huruf S',
  t: 'Huruf T',
  u: 'Huruf U',
  v: 'Huruf V',
  w: 'Huruf W',
  x: 'Huruf X',
  y: 'Huruf Y',
  z: 'Huruf Z'
};

// ============ HURUF: suara huruf saja ============
const hurufItems = Object.entries(pelafalanHuruf).map(([h, lafal]) => ({
  fileName: `huruf_${h}.mp3`,
  teks: lafal,
}));

// ============ KATA CONTOH: maks 2 per huruf ============
const kataItems = [
  { fileName: 'kata_ayam.mp3', teks: 'Huruf A untuk Ayam' },
  { fileName: 'kata_apel.mp3', teks: 'Huruf A untuk Apel' },

  { fileName: 'kata_buku.mp3', teks: 'Huruf B untuk Buku' },
  { fileName: 'kata_bola.mp3', teks: 'Huruf B untuk Bola' },

  { fileName: 'kata_cincin.mp3', teks: 'Huruf C untuk Cincin' },
  { fileName: 'kata_ceri.mp3', teks: 'Huruf C untuk Ceri' },

  { fileName: 'kata_durian.mp3', teks: 'Huruf D untuk Durian' },
  { fileName: 'kata_domba.mp3', teks: 'Huruf D untuk Domba' },

  { fileName: 'kata_elang.mp3', teks: 'Huruf E untuk Elang' },
  { fileName: 'kata_es.mp3', teks: 'Huruf E untuk Es' },

  { fileName: 'kata_flamingo.mp3', teks: 'Huruf F untuk Flamingo' },
  { fileName: 'kata_foto.mp3', teks: 'Huruf F untuk Foto' },

  { fileName: 'kata_gajah.mp3', teks: 'Huruf G untuk Gajah' },
  { fileName: 'kata_gitar.mp3', teks: 'Huruf G untuk Gitar' },

  { fileName: 'kata_harimau.mp3', teks: 'Huruf H untuk Harimau' },
  { fileName: 'kata_hujan.mp3', teks: 'Huruf H untuk Hujan' },

  { fileName: 'kata_ikan.mp3', teks: 'Huruf I untuk Ikan' },
  { fileName: 'kata_igloo.mp3', teks: 'Huruf I untuk Igloo' },

  { fileName: 'kata_jagung.mp3', teks: 'Huruf J untuk Jagung' },
  { fileName: 'kata_jambu.mp3', teks: 'Huruf J untuk Jambu' },

  { fileName: 'kata_kucing.mp3', teks: 'Huruf K untuk Kucing' },
  { fileName: 'kata_kuda.mp3', teks: 'Huruf K untuk Kuda' },

  { fileName: 'kata_lumba.mp3', teks: 'Huruf L untuk Lumba-lumba' },
  { fileName: 'kata_lebah.mp3', teks: 'Huruf L untuk Lebah' },

  { fileName: 'kata_mangga.mp3', teks: 'Huruf M untuk Mangga' },
  { fileName: 'kata_monyet.mp3', teks: 'Huruf M untuk Monyet' },

  { fileName: 'kata_nanas.mp3', teks: 'Huruf N untuk Nanas' },
  { fileName: 'kata_naga.mp3', teks: 'Huruf N untuk Naga' },

  { fileName: 'kata_orangutan.mp3', teks: 'Huruf O untuk Orangutan' },
  { fileName: 'kata_obat.mp3', teks: 'Huruf O untuk Obat' },

  { fileName: 'kata_pisang.mp3', teks: 'Huruf P untuk Pisang' },
  { fileName: 'kata_panda.mp3', teks: 'Huruf P untuk Panda' },

  { fileName: 'kata_quran.mp3', teks: 'Huruf Q untuk Quran' },
  { fileName: 'kata_quiz.mp3', teks: 'Huruf Q untuk Kuis' },

  { fileName: 'kata_rusa.mp3', teks: 'Huruf R untuk Rusa' },
  { fileName: 'kata_robot.mp3', teks: 'Huruf R untuk Robot' },

  { fileName: 'kata_singa.mp3', teks: 'Huruf S untuk Singa' },
  { fileName: 'kata_semut.mp3', teks: 'Huruf S untuk Semut' },

  { fileName: 'kata_tikus.mp3', teks: 'Huruf T untuk Tikus' },
  { fileName: 'kata_tomat.mp3', teks: 'Huruf T untuk Tomat' },

  { fileName: 'kata_udang.mp3', teks: 'Huruf U untuk Udang' },
  { fileName: 'kata_ular.mp3', teks: 'Huruf U untuk Ular' },

  { fileName: 'kata_vas.mp3', teks: 'Huruf V untuk Vas' },
  { fileName: 'kata_violin.mp3', teks: 'Huruf V untuk Biola' },

  { fileName: 'kata_wortel.mp3', teks: 'Huruf W untuk Wortel' },
  { fileName: 'kata_walet.mp3', teks: 'Huruf W untuk Walet' },

  { fileName: 'kata_xilofon.mp3', teks: 'Huruf X untuk Xilofon' },
  { fileName: 'kata_xenon.mp3', teks: 'Huruf X untuk Xenon' },

  { fileName: 'kata_yoyo.mp3', teks: 'Huruf Y untuk Yoyo' },
  { fileName: 'kata_yogurt.mp3', teks: 'Huruf Y untuk Yogurt' },

  { fileName: 'kata_zebra.mp3', teks: 'Huruf Z untuk Zebra' },
  { fileName: 'kata_zaitun.mp3', teks: 'Huruf Z untuk Zaitun' },
];

// ============ ANGKA 1-50 ============
const angkaNames = [
  'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh',
  'Sebelas', 'Dua Belas', 'Tiga Belas', 'Empat Belas', 'Lima Belas',
  'Enam Belas', 'Tujuh Belas', 'Delapan Belas', 'Sembilan Belas', 'Dua Puluh',
  'Dua Puluh Satu', 'Dua Puluh Dua', 'Dua Puluh Tiga', 'Dua Puluh Empat', 'Dua Puluh Lima',
  'Dua Puluh Enam', 'Dua Puluh Tujuh', 'Dua Puluh Delapan', 'Dua Puluh Sembilan', 'Tiga Puluh',
  'Tiga Puluh Satu', 'Tiga Puluh Dua', 'Tiga Puluh Tiga', 'Tiga Puluh Empat', 'Tiga Puluh Lima',
  'Tiga Puluh Enam', 'Tiga Puluh Tujuh', 'Tiga Puluh Delapan', 'Tiga Puluh Sembilan', 'Empat Puluh',
  'Empat Puluh Satu', 'Empat Puluh Dua', 'Empat Puluh Tiga', 'Empat Puluh Empat', 'Empat Puluh Lima',
  'Empat Puluh Enam', 'Empat Puluh Tujuh', 'Empat Puluh Delapan', 'Empat Puluh Sembilan', 'Lima Puluh',
];
const angkaItems = angkaNames.map((nama, i) => ({
  fileName: `angka_${i + 1}.mp3`,
  teks: nama,
}));

// ============ GABUNGKAN SEMUA ============
const allItems = [...hurufItems, ...kataItems, ...angkaItems];

// ============ GENERATE ============
async function generateAudio(teks, fileName) {
  const outputPath = path.join(OUTPUT_DIR, fileName);

  // Kita HAPUS validasi "Skip" agar file audio digenerate ulang (menimpa yang lama)

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
    method: 'POST',
    headers: { 'xi-api-key': API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: teks,
      model_id: 'eleven_multilingual_v2', // Model ini bisa baca teks multi bahasa
      voice_settings: {
        stability: 1.0,
        similarity_boost: 0.3,
        style: 0.0,
        use_speaker_boost: false
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API Error (${fileName}): ${err}`);
  }

  const buffer = await res.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  console.log(`✅ ${fileName} — "${teks}"`);
}

async function main() {
  console.log(`\n🎙️  Tadika Audio Generator`);
  console.log(`📂 Output: ${OUTPUT_DIR}`);
  console.log(`🔢 Total: ${allItems.length} files\n`);

  let ok = 0;
  let fail = 0;

  for (const item of allItems) {
    try {
      await generateAudio(item.teks, item.fileName);
      ok++;

      // Delay biar API lebih stabil
      await new Promise(r => setTimeout(r, 500));

    } catch (err) {
      console.error(`❌ ${item.fileName}: ${err.message}`);
      fail++;
    }
  }

  console.log(`\n🎉 Done! ✅ ${ok} berhasil, ❌ ${fail} gagal`);
}

main();
