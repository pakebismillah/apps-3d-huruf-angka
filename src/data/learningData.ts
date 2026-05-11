/**
 * Data konten pembelajaran untuk Tadika
 * Huruf A-Z (masing-masing 2 contoh kata) + Angka 1-50
 */

export interface WordExample {
  text: string;
  emoji: string;
  audio: string; // nama file tanpa prefix, misal 'ayam' -> kata_ayam.mp3
}

export interface LetterQuest {
  id: string;
  letter: string;
  title: string;
  subtitle: string;
  bgColor: string;
  words: WordExample[];
  funFact: string;
}

export interface NumberQuest {
  id: number;
  number: number;
  name: string;
  emoji: string;
  bgColor: string;
  funFact: string;
}

// ===================== HURUF A-Z =====================
export const letterQuests: LetterQuest[] = [
  {
    id: 'A', letter: 'A', title: 'A UNTUK AYAM', subtitle: 'Mari belajar huruf A!', bgColor: '#FFF9C4',
    words: [{ text: 'AYAM', emoji: '🐔', audio: 'ayam' }, { text: 'APEL', emoji: '🍎', audio: 'apel' }],
    funFact: 'Ayam berkokok setiap pagi untuk menyambut matahari!'
  },
  {
    id: 'B', letter: 'B', title: 'B UNTUK BUKU', subtitle: 'Mari belajar huruf B!', bgColor: '#E3F2FD',
    words: [{ text: 'BUKU', emoji: '📚', audio: 'buku' }, { text: 'BOLA', emoji: '⚽', audio: 'bola' }],
    funFact: 'Membaca buku bikin kita jadi pintar!'
  },
  {
    id: 'C', letter: 'C', title: 'C UNTUK CINCIN', subtitle: 'Mari belajar huruf C!', bgColor: '#F3E5F5',
    words: [{ text: 'CINCIN', emoji: '💍', audio: 'cincin' }, { text: 'CERI', emoji: '🍒', audio: 'ceri' }],
    funFact: 'Ceri adalah buah mungil yang sangat manis!'
  },
  {
    id: 'D', letter: 'D', title: 'D UNTUK DURIAN', subtitle: 'Mari belajar huruf D!', bgColor: '#E8F5E9',
    words: [{ text: 'DURIAN', emoji: '🥭', audio: 'durian' }, { text: 'DOMBA', emoji: '🐑', audio: 'domba' }],
    funFact: 'Durian dijuluki Raja Buah karena rasanya yang kuat!'
  },
  {
    id: 'E', letter: 'E', title: 'E UNTUK ELANG', subtitle: 'Mari belajar huruf E!', bgColor: '#FFF3E0',
    words: [{ text: 'ELANG', emoji: '🦅', audio: 'elang' }, { text: 'ES', emoji: '🧊', audio: 'es' }],
    funFact: 'Elang bisa melihat mangsa dari jarak sangat jauh!'
  },
  {
    id: 'F', letter: 'F', title: 'F UNTUK FLAMINGO', subtitle: 'Mari belajar huruf F!', bgColor: '#FCE4EC',
    words: [{ text: 'FLAMINGO', emoji: '🦩', audio: 'flamingo' }, { text: 'FOTO', emoji: '📷', audio: 'foto' }],
    funFact: 'Flamingo berwarna pink karena makanannya!'
  },
  {
    id: 'G', letter: 'G', title: 'G UNTUK GAJAH', subtitle: 'Mari belajar huruf G!', bgColor: '#E0F7FA',
    words: [{ text: 'GAJAH', emoji: '🐘', audio: 'gajah' }, { text: 'GITAR', emoji: '🎸', audio: 'gitar' }],
    funFact: 'Gajah adalah hewan darat terbesar di dunia!'
  },
  {
    id: 'H', letter: 'H', title: 'H UNTUK HARIMAU', subtitle: 'Mari belajar huruf H!', bgColor: '#FFF9C4',
    words: [{ text: 'HARIMAU', emoji: '🐯', audio: 'harimau' }, { text: 'HUJAN', emoji: '🌧️', audio: 'hujan' }],
    funFact: 'Setiap loreng harimau itu unik, tidak ada yang sama!'
  },
  {
    id: 'I', letter: 'I', title: 'I UNTUK IKAN', subtitle: 'Mari belajar huruf I!', bgColor: '#E3F2FD',
    words: [{ text: 'IKAN', emoji: '🐟', audio: 'ikan' }, { text: 'IGLOO', emoji: '🏠', audio: 'igloo' }],
    funFact: 'Ada lebih dari 30.000 jenis ikan di dunia!'
  },
  {
    id: 'J', letter: 'J', title: 'J UNTUK JAGUNG', subtitle: 'Mari belajar huruf J!', bgColor: '#FFFDE7',
    words: [{ text: 'JAGUNG', emoji: '🌽', audio: 'jagung' }, { text: 'JAMBU', emoji: '🍈', audio: 'jambu' }],
    funFact: 'Jagung bisa tumbuh sangat tinggi, bahkan melebihi orang dewasa!'
  },
  {
    id: 'K', letter: 'K', title: 'K UNTUK KUCING', subtitle: 'Mari belajar huruf K!', bgColor: '#F3E5F5',
    words: [{ text: 'KUCING', emoji: '🐱', audio: 'kucing' }, { text: 'KUDA', emoji: '🐴', audio: 'kuda' }],
    funFact: 'Kucing bisa tidur sampai 16 jam sehari!'
  },
  {
    id: 'L', letter: 'L', title: 'L UNTUK LEBAH', subtitle: 'Mari belajar huruf L!', bgColor: '#E8F5E9',
    words: [{ text: 'LEBAH', emoji: '🐝', audio: 'lebah' }, { text: 'LUMBA', emoji: '🐬', audio: 'lumba' }],
    funFact: 'Lebah sangat penting untuk menyerbuki bunga!'
  },
  {
    id: 'M', letter: 'M', title: 'M UNTUK MANGGA', subtitle: 'Mari belajar huruf M!', bgColor: '#FFF3E0',
    words: [{ text: 'MANGGA', emoji: '🥭', audio: 'mangga' }, { text: 'MONYET', emoji: '🐒', audio: 'monyet' }],
    funFact: 'Mangga adalah buah tropis favorit banyak orang!'
  },
  {
    id: 'N', letter: 'N', title: 'N UNTUK NANAS', subtitle: 'Mari belajar huruf N!', bgColor: '#FFFDE7',
    words: [{ text: 'NANAS', emoji: '🍍', audio: 'nanas' }, { text: 'NAGA', emoji: '🐉', audio: 'naga' }],
    funFact: 'Nanas butuh 2-3 tahun untuk tumbuh besar!'
  },
  {
    id: 'O', letter: 'O', title: 'O UNTUK ORANGUTAN', subtitle: 'Mari belajar huruf O!', bgColor: '#FFF9C4',
    words: [{ text: 'ORANGUTAN', emoji: '🦧', audio: 'orangutan' }, { text: 'OBAT', emoji: '💊', audio: 'obat' }],
    funFact: 'Orangutan hanya hidup di Indonesia dan Malaysia!'
  },
  {
    id: 'P', letter: 'P', title: 'P UNTUK PISANG', subtitle: 'Mari belajar huruf P!', bgColor: '#FFFDE7',
    words: [{ text: 'PISANG', emoji: '🍌', audio: 'pisang' }, { text: 'PANDA', emoji: '🐼', audio: 'panda' }],
    funFact: 'Pisang mengandung kalium yang baik untuk tubuh!'
  },
  {
    id: 'Q', letter: 'Q', title: 'Q UNTUK QURAN', subtitle: 'Mari belajar huruf Q!', bgColor: '#E8F5E9',
    words: [{ text: 'QURAN', emoji: '📖', audio: 'quran' }, { text: 'KUIS', emoji: '❓', audio: 'quiz' }],
    funFact: 'Quran adalah kitab suci umat Islam!'
  },
  {
    id: 'R', letter: 'R', title: 'R UNTUK RUSA', subtitle: 'Mari belajar huruf R!', bgColor: '#E3F2FD',
    words: [{ text: 'RUSA', emoji: '🦌', audio: 'rusa' }, { text: 'ROBOT', emoji: '🤖', audio: 'robot' }],
    funFact: 'Tanduk rusa bisa tumbuh kembali setiap tahun!'
  },
  {
    id: 'S', letter: 'S', title: 'S UNTUK SINGA', subtitle: 'Mari belajar huruf S!', bgColor: '#FFF3E0',
    words: [{ text: 'SINGA', emoji: '🦁', audio: 'singa' }, { text: 'SEMUT', emoji: '🐜', audio: 'semut' }],
    funFact: 'Singa disebut Raja Hutan karena sangat gagah!'
  },
  {
    id: 'T', letter: 'T', title: 'T UNTUK TIKUS', subtitle: 'Mari belajar huruf T!', bgColor: '#F3E5F5',
    words: [{ text: 'TIKUS', emoji: '🐭', audio: 'tikus' }, { text: 'TOMAT', emoji: '🍅', audio: 'tomat' }],
    funFact: 'Tikus punya gigi yang terus tumbuh sepanjang hidupnya!'
  },
  {
    id: 'U', letter: 'U', title: 'U UNTUK UDANG', subtitle: 'Mari belajar huruf U!', bgColor: '#FCE4EC',
    words: [{ text: 'UDANG', emoji: '🦐', audio: 'udang' }, { text: 'ULAR', emoji: '🐍', audio: 'ular' }],
    funFact: 'Udang punya jantung di kepalanya!'
  },
  {
    id: 'V', letter: 'V', title: 'V UNTUK VAS', subtitle: 'Mari belajar huruf V!', bgColor: '#E0F7FA',
    words: [{ text: 'VAS', emoji: '🏺', audio: 'vas' }, { text: 'BIOLA', emoji: '🎻', audio: 'violin' }],
    funFact: 'Vas digunakan untuk menaruh bunga agar lebih cantik!'
  },
  {
    id: 'W', letter: 'W', title: 'W UNTUK WORTEL', subtitle: 'Mari belajar huruf W!', bgColor: '#FFF3E0',
    words: [{ text: 'WORTEL', emoji: '🥕', audio: 'wortel' }, { text: 'WALET', emoji: '🐦', audio: 'walet' }],
    funFact: 'Wortel baik untuk kesehatan mata!'
  },
  {
    id: 'X', letter: 'X', title: 'X UNTUK XILOFON', subtitle: 'Mari belajar huruf X!', bgColor: '#E3F2FD',
    words: [{ text: 'XILOFON', emoji: '🎵', audio: 'xilofon' }, { text: 'XENON', emoji: '💡', audio: 'xenon' }],
    funFact: 'Xilofon adalah alat musik yang dipukul dengan tongkat kecil!'
  },
  {
    id: 'Y', letter: 'Y', title: 'Y UNTUK YOYO', subtitle: 'Mari belajar huruf Y!', bgColor: '#FFFDE7',
    words: [{ text: 'YOYO', emoji: '🪀', audio: 'yoyo' }, { text: 'YOGURT', emoji: '🥛', audio: 'yogurt' }],
    funFact: 'Yoyo sudah dimainkan sejak ribuan tahun lalu!'
  },
  {
    id: 'Z', letter: 'Z', title: 'Z UNTUK ZEBRA', subtitle: 'Mari belajar huruf Z!', bgColor: '#E8F5E9',
    words: [{ text: 'ZEBRA', emoji: '🦓', audio: 'zebra' }, { text: 'ZAITUN', emoji: '🫒', audio: 'zaitun' }],
    funFact: 'Setiap zebra punya corak belang yang berbeda!'
  },
];

// ===================== ANGKA 1-50 =====================
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

const numberEmojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
const bgColors = ['#FFF9C4', '#E3F2FD', '#F3E5F5', '#E8F5E9', '#FFF3E0', '#FCE4EC', '#E0F7FA', '#FFFDE7'];

export const numberQuests: NumberQuest[] = angkaNames.map((name, i) => ({
  id: i + 1,
  number: i + 1,
  name,
  emoji: numberEmojis[i % numberEmojis.length],
  bgColor: bgColors[i % bgColors.length],
  funFact: `Angka ${i + 1} dalam bahasa Indonesia adalah ${name}!`,
}));
