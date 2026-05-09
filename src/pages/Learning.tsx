import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonIcon,
  useIonRouter,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonModal
} from '@ionic/react';
import { 
  volumeMediumOutline, 
  volumeHighOutline,
  chevronBackOutline, 
  chevronForwardOutline,
  star,
  happyOutline,
  brushOutline,
  trashOutline,
  gridOutline,
  sparklesOutline,
  arrowBackOutline,
  textOutline,
  calculatorOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, update, get, child, onValue } from "firebase/database";
import { db } from "../firebase";
import { useParams, useLocation } from 'react-router-dom';
import './Learning.css';

// ============ Audio Helper ============
function playAudioFile(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(src);
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('File not found'));
    audio.play().catch(reject);
  });
}

function speakText(text: string, lang = 'id-ID'): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) { resolve(); return; }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.85;
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    window.speechSynthesis.speak(utter);
  });
}

interface WordItem {
  text: string;
  phonetic: string;
  emoji: string;
  audio: string;
  type: string;
}

interface Quest {
  id: string;
  letter: string;
  smallLetter: string;
  title: string;
  subtitle: string;
  bgColor: string;
  funFact: string;
  type: string;
  category: string;
  words?: WordItem[];
}

const quests: Quest[] = [
  // Letters A-Z
  { 
    id: 'A', letter: 'A', smallLetter: 'a', title: 'A UNTUK APEL', subtitle: 'Mari belajar mengenal huruf A!', bgColor: '#FFF9C4',
    words: [{ text: 'APEL', phonetic: 'A-pel', emoji: '🍎', audio: 'apel', type: 'Buah' }, { text: 'AYAM', phonetic: 'A-yam', emoji: '🐔', audio: 'ayam', type: 'Hewan' }],
    funFact: 'Apel itu sehat dan bikin kita kuat!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'B', letter: 'B', smallLetter: 'b', title: 'B UNTUK BUKU', subtitle: 'Mari belajar mengenal huruf B!', bgColor: '#E3F2FD',
    words: [{ text: 'BENGKUANG', phonetic: 'Beng-ku-ang', emoji: '🥔', audio: 'bengkuang', type: 'Buah' }, { text: 'BEBEK', phonetic: 'Be-bek', emoji: '🦆', audio: 'bebek', type: 'Hewan' }],
    funFact: 'Membaca buku bikin kita jadi pintar!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'C', letter: 'C', smallLetter: 'c', title: 'C UNTUK CERI', subtitle: 'Mari belajar mengenal huruf C!', bgColor: '#FFEBEE',
    words: [{ text: 'CERI', phonetic: 'Ce-ri', emoji: '🍒', audio: 'ceri', type: 'Buah' }, { text: 'CICAK', phonetic: 'Ci-cak', emoji: '🦎', audio: 'cicak', type: 'Hewan' }],
    funFact: 'Ceri rasanya manis dan enak!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'D', letter: 'D', smallLetter: 'd', title: 'D UNTUK DURIAN', subtitle: 'Mari belajar mengenal huruf D!', bgColor: '#F1F8E9',
    words: [{ text: 'DURIAN', phonetic: 'Du-ri-an', emoji: '🍈', audio: 'durian', type: 'Buah' }, { text: 'DOMBA', phonetic: 'Dom-ba', emoji: '🐑', audio: 'domba', type: 'Hewan' }],
    funFact: 'Durian adalah raja buah-buahan!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'E', letter: 'E', smallLetter: 'e', title: 'E UNTUK ELANG', subtitle: 'Mari belajar mengenal huruf E!', bgColor: '#E8EAF6',
    words: [{ text: 'ELANG', phonetic: 'E-lang', emoji: '🦅', audio: 'elang', type: 'Hewan' }, { text: 'ES KRIM', phonetic: 'Es-krim', emoji: '🍦', audio: 'eskrim', type: 'Camilan' }],
    funFact: 'Elang bisa terbang sangat tinggi!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'F', letter: 'F', smallLetter: 'f', title: 'F UNTUK FLAMINGO', subtitle: 'Mari belajar mengenal huruf F!', bgColor: '#FCE4EC',
    words: [{ text: 'FLAMINGO', phonetic: 'Fla-min-go', emoji: '🦩', audio: 'flamingo', type: 'Hewan' }, { text: 'FERI', phonetic: 'Fe-ri', emoji: '⛴️', audio: 'feri', type: 'Kendaraan' }],
    funFact: 'Flamingo suka berdiri dengan satu kaki!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'G', letter: 'G', smallLetter: 'g', title: 'G UNTUK GAJAH', subtitle: 'Mari belajar mengenal huruf G!', bgColor: '#EFEBE9',
    words: [{ text: 'GAJAH', phonetic: 'Ga-jah', emoji: '🐘', audio: 'gajah', type: 'Hewan' }, { text: 'GANDARIA', phonetic: 'Gan-da-ri-a', emoji: '🥭', audio: 'gandaria', type: 'Buah' }],
    funFact: 'Gajah punya belalai yang panjang!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'H', letter: 'H', smallLetter: 'h', title: 'H UNTUK HARIMAU', subtitle: 'Mari belajar mengenal huruf H!', bgColor: '#FFF3E0',
    words: [{ text: 'HARIMAU', phonetic: 'Ha-ri-mau', emoji: '🐯', audio: 'harimau', type: 'Hewan' }, { text: 'HUTAN', phonetic: 'Hu-tan', emoji: '🌳', audio: 'hutan', type: 'Alam' }],
    funFact: 'Harimau punya garis-garis di badannya!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'I', letter: 'I', smallLetter: 'i', title: 'I UNTUK IKAN', subtitle: 'Mari belajar mengenal huruf I!', bgColor: '#E1F5FE',
    words: [{ text: 'IKAN', phonetic: 'I-kan', emoji: '🐟', audio: 'ikan', type: 'Hewan' }, { text: 'IGLO', phonetic: 'Ig-lo', emoji: '🧊', audio: 'iglo', type: 'Bangunan' }],
    funFact: 'Ikan bernapas di dalam air!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'J', letter: 'J', smallLetter: 'j', title: 'J UNTUK JERUK', subtitle: 'Mari belajar mengenal huruf J!', bgColor: '#FFF3E0',
    words: [{ text: 'JERUK', phonetic: 'Je-ruk', emoji: '🍊', audio: 'jeruk', type: 'Buah' }, { text: 'JERAPAH', phonetic: 'Je-ra-pah', emoji: '🦒', audio: 'jerapah', type: 'Hewan' }],
    funFact: 'Jeruk mengandung banyak vitamin C!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'K', letter: 'K', smallLetter: 'k', title: 'K UNTUK KUCING', subtitle: 'Mari belajar mengenal huruf K!', bgColor: '#F3E5F5',
    words: [{ text: 'KUCING', phonetic: 'Ku-cing', emoji: '🐱', audio: 'kucing', type: 'Hewan' }, { text: 'KELAPA', phonetic: 'Ke-la-pa', emoji: '🥥', audio: 'kelapa', type: 'Buah' }],
    funFact: 'Kucing suka sekali makan ikan!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'L', letter: 'L', smallLetter: 'l', title: 'L UNTUK LECI', subtitle: 'Mari belajar mengenal huruf L!', bgColor: '#E0F2F1',
    words: [{ text: 'LECI', phonetic: 'Le-ci', emoji: '🍒', audio: 'leci', type: 'Buah' }, { text: 'LEBAH', phonetic: 'Le-bah', emoji: '🐝', audio: 'lebah', type: 'Hewan' }],
    funFact: 'Lebah membuat madu yang manis!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'M', letter: 'M', smallLetter: 'm', title: 'M UNTUK MANGGIS', subtitle: 'Mari belajar mengenal huruf M!', bgColor: '#FCE4EC',
    words: [{ text: 'MANGGIS', phonetic: 'Mang-gis', emoji: '🍇', audio: 'manggis', type: 'Buah' }, { text: 'MONYET', phonetic: 'Mo-nyet', emoji: '🐒', audio: 'monyet', type: 'Hewan' }],
    funFact: 'Monyet suka sekali makan pisang!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'N', letter: 'N', smallLetter: 'n', title: 'N UNTUK NANAS', subtitle: 'Mari belajar mengenal huruf N!', bgColor: '#FFFDE7',
    words: [{ text: 'NANAS', phonetic: 'Na-nas', emoji: '🍍', audio: 'nanas', type: 'Buah' }, { text: 'NYAMUK', phonetic: 'Nya-muk', emoji: '🦟', audio: 'nyamuk', type: 'Serangga' }],
    funFact: 'Nanas kulitnya berduri tapi enak!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'O', letter: 'O', smallLetter: 'o', title: 'O UNTUK ORANGUTAN', subtitle: 'Mari belajar mengenal huruf O!', bgColor: '#EFEBE9',
    words: [{ text: 'ORANGUTAN', phonetic: 'O-rang-u-tan', emoji: '🦧', audio: 'orangutan', type: 'Hewan' }, { text: 'OBAT', phonetic: 'O-bat', emoji: '💊', audio: 'obat', type: 'Kesehatan' }],
    funFact: 'Orangutan adalah kera yang cerdas!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'P', letter: 'P', smallLetter: 'p', title: 'P UNTUK PISANG', subtitle: 'Mari belajar mengenal huruf P!', bgColor: '#FFF9C4',
    words: [{ text: 'PISANG', phonetic: 'Pi-sang', emoji: '🍌', audio: 'pisang', type: 'Buah' }, { text: 'PANDA', phonetic: 'Pan-da', emoji: '🐼', audio: 'panda', type: 'Hewan' }],
    funFact: 'Panda suka makan bambu!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'Q', letter: 'Q', smallLetter: 'q', title: 'Q UNTUK QURAN', subtitle: 'Mari belajar mengenal huruf Q!', bgColor: '#E0F7FA',
    words: [{ text: 'QURAN', phonetic: 'Qu-ran', emoji: '📖', audio: 'quran', type: 'Kitab' }, { text: 'QUOKKA', phonetic: 'Qu-ok-ka', emoji: '🐹', audio: 'quokka', type: 'Hewan' }],
    funFact: 'Quokka disebut hewan paling bahagia!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'R', letter: 'R', smallLetter: 'r', title: 'R UNTUK RAMBUTAN', subtitle: 'Mari belajar mengenal huruf R!', bgColor: '#FFEBEE',
    words: [{ text: 'RAMBUTAN', phonetic: 'Ram-bu-tan', emoji: '🍓', audio: 'rambutan', type: 'Buah' }, { text: 'RUSA', phonetic: 'Ru-sa', emoji: '🦌', audio: 'rusa', type: 'Hewan' }],
    funFact: 'Rambutan punya rambut di kulitnya!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'S', letter: 'S', smallLetter: 's', title: 'S UNTUK SINGA', subtitle: 'Mari belajar mengenal huruf S!', bgColor: '#FFFDE7',
    words: [{ text: 'SINGA', phonetic: 'Si-nga', emoji: '🦁', audio: 'singa', type: 'Hewan' }, { text: 'SEMANGKA', phonetic: 'Se-mang-ka', emoji: '🍉', audio: 'semangka', type: 'Buah' }],
    funFact: 'Singa dijuluki raja hutan!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'T', letter: 'T', smallLetter: 't', title: 'T UNTUK TOMAT', subtitle: 'Mari belajar mengenal huruf T!', bgColor: '#FFEBEE',
    words: [{ text: 'TOMAT', phonetic: 'To-mat', emoji: '🍅', audio: 'tomat', type: 'Buah' }, { text: 'TUPAI', phonetic: 'Tu-pai', emoji: '🐿️', audio: 'tupai', type: 'Hewan' }],
    funFact: 'Tupai suka mengubur kacang!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'U', letter: 'U', smallLetter: 'u', title: 'U UNTUK ULAR', subtitle: 'Mari belajar mengenal huruf U!', bgColor: '#E8F5E9',
    words: [{ text: 'ULAR', phonetic: 'U-lar', emoji: '🐍', audio: 'ular', type: 'Hewan' }, { text: 'UBI', phonetic: 'U-bi', emoji: '🍠', audio: 'ubi', type: 'Buah' }],
    funFact: 'Ular tidak punya kaki untuk berjalan!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'V', letter: 'V', smallLetter: 'v', title: 'V UNTUK VANILA', subtitle: 'Mari belajar mengenal huruf V!', bgColor: '#F3E5F5',
    words: [{ text: 'VANILA', phonetic: 'Va-ni-la', emoji: '🍦', audio: 'vanila', type: 'Rasa' }, { text: 'VULTURE', phonetic: 'Vul-ture', emoji: '🦅', audio: 'vulture', type: 'Burung' }],
    funFact: 'Vanila harum dan rasanya enak!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'W', letter: 'W', smallLetter: 'w', title: 'W UNTUK WORTEL', subtitle: 'Mari belajar mengenal huruf W!', bgColor: '#FFF3E0',
    words: [{ text: 'WORTEL', phonetic: 'Wor-tel', emoji: '🥕', audio: 'wortel', type: 'Sayur' }, { text: 'WALANG', phonetic: 'Wa-lang', emoji: '🦗', audio: 'walang', type: 'Serangga' }],
    funFact: 'Wortel bagus untuk kesehatan mata!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'X', letter: 'X', smallLetter: 'x', title: 'X UNTUK XYLOPHONE', subtitle: 'Mari belajar mengenal huruf X!', bgColor: '#E1F5FE',
    words: [{ text: 'XYLOPHONE', phonetic: 'Xy-lo-phone', emoji: '🎹', audio: 'xylophone', type: 'Musik' }, { text: 'X-RAY', phonetic: 'X-ray', emoji: '🩻', audio: 'xray', type: 'Sains' }],
    funFact: 'Xylophone adalah alat musik pukul!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'Y', letter: 'Y', smallLetter: 'y', title: 'Y UNTUK YOYO', subtitle: 'Mari belajar mengenal huruf Y!', bgColor: '#FFF9C4',
    words: [{ text: 'YOYO', phonetic: 'Yo-yo', emoji: '🪀', audio: 'yoyo', type: 'Mainan' }, { text: 'YAK', phonetic: 'Yak', emoji: '🐂', audio: 'yak', type: 'Hewan' }],
    funFact: 'Yoyo bisa berputar sangat cepat!', type: 'Huruf', category: 'letters'
  },
  { 
    id: 'Z', letter: 'Z', smallLetter: 'z', title: 'Z UNTUK ZEBRA', subtitle: 'Mari belajar mengenal huruf Z!', bgColor: '#ECEFF1',
    words: [{ text: 'ZEBRA', phonetic: 'Ze-bra', emoji: '🦓', audio: 'zebra', type: 'Hewan' }, { text: 'ZAITUN', phonetic: 'Zai-tun', emoji: '🫒', audio: 'zaitun', type: 'Buah' }],
    funFact: 'Zebra punya tubuh hitam putih!', type: 'Huruf', category: 'letters'
  },
  // Numbers 1-50
  ...Array.from({ length: 50 }, (_, i) => {
    const num = (i + 1).toString();
    const bgColors = ['#FFE0B2', '#C8E6C9', '#F8BBD0', '#D1C4E9', '#B2EBF2', '#DCEDC8', '#FFF9C4', '#E1BEE7', '#FFCCBC', '#CFD8DC'];
    return {
      id: num,
      letter: num,
      smallLetter: '', // No small letter for numbers
      title: num.toUpperCase(), // Using numeral as title for simplicity or I could use Indonesian words
      subtitle: 'Ayo hitung ada berapa temanmu!',
      bgColor: bgColors[i % bgColors.length],
      funFact: `Angka ${num} itu keren!`,
      type: 'Angka',
      category: 'numbers'
    };
  }),
  // Fruits
  { 
    id: 'apel', letter: 'Apel', smallLetter: '🍎', title: 'APEL MERAH', subtitle: 'Apel rasanya manis!', bgColor: '#FFEBEE',
    words: [{ text: 'APEL', phonetic: 'A-pel', emoji: '🍎', audio: 'apel', type: 'Buah' }],
    funFact: 'Apel bisa berwarna merah, hijau, atau kuning!', type: 'Buah', category: 'fruits'
  },
  { 
    id: 'pisang', letter: 'Pisang', smallLetter: '🍌', title: 'PISANG KUNING', subtitle: 'Monyet suka pisang!', bgColor: '#FFFDE7',
    words: [{ text: 'PISANG', phonetic: 'Pi-sang', emoji: '🍌', audio: 'pisang', type: 'Buah' }],
    funFact: 'Pisang mengandung banyak kalium yang baik!', type: 'Buah', category: 'fruits'
  },
  { 
    id: 'jeruk', letter: 'Jeruk', smallLetter: '🍊', title: 'JERUK SEGAR', subtitle: 'Jeruk banyak vitamin C!', bgColor: '#FFF3E0',
    words: [{ text: 'JERUK', phonetic: 'Je-ruk', emoji: '🍊', audio: 'jeruk', type: 'Buah' }],
    funFact: 'Jeruk bikin tubuh kita tidak gampang sakit!', type: 'Buah', category: 'fruits'
  },
  { 
    id: 'semangka', letter: 'Semangka', smallLetter: '🍉', title: 'SEMANGKA BESAR', subtitle: 'Isinya air yang segar!', bgColor: '#E8F5E9',
    words: [{ text: 'SEMANGKA', phonetic: 'Se-mang-ka', emoji: '🍉', audio: 'semangka', type: 'Buah' }],
    funFact: 'Semangka itu 90% isinya adalah air!', type: 'Buah', category: 'fruits'
  },
  { 
    id: 'mangga', letter: 'Mangga', smallLetter: '🥭', title: 'MANGGA MANIS', subtitle: 'Wangi dan enak sekali!', bgColor: '#FFF9C4',
    words: [{ text: 'MANGGA', phonetic: 'Mang-ga', emoji: '🥭', audio: 'mangga', type: 'Buah' }],
    funFact: 'Mangga adalah buah favorit di banyak negara!', type: 'Buah', category: 'fruits'
  },
  // Animals
  { 
    id: 'kucing', letter: 'Kucing', smallLetter: '🐱', title: 'KUCING LUCU', subtitle: 'Meong... meong...', bgColor: '#F5F5F5',
    words: [{ text: 'KUCING', phonetic: 'Ku-cing', emoji: '🐱', audio: 'kucing', type: 'Hewan' }],
    funFact: 'Kucing suka tidur sepanjang hari!', type: 'Hewan', category: 'animals'
  },
  { 
    id: 'singa', letter: 'Singa', smallLetter: '🦁', title: 'SINGA BERANI', subtitle: 'Aummm... Raja Hutan!', bgColor: '#FFF3E0',
    words: [{ text: 'SINGA', phonetic: 'Si-nga', emoji: '🦁', audio: 'singa', type: 'Hewan' }],
    funFact: 'Singa jantan punya rambut yang lebat!', type: 'Hewan', category: 'animals'
  },
  { 
    id: 'gajah', letter: 'Gajah', smallLetter: '🐘', title: 'GAJAH BESAR', subtitle: 'Punya belalai panjang!', bgColor: '#E1F5FE',
    words: [{ text: 'GAJAH', phonetic: 'Ga-jah', emoji: '🐘', audio: 'gajah', type: 'Hewan' }],
    funFact: 'Gajah adalah hewan darat paling besar!', type: 'Hewan', category: 'animals'
  },
  { 
    id: 'jerapah', letter: 'Jerapah', smallLetter: '🦒', title: 'JERAPAH TINGGI', subtitle: 'Lehernya panjang sekali!', bgColor: '#FFFDE7',
    words: [{ text: 'JERAPAH', phonetic: 'Je-ra-pah', emoji: '🦒', audio: 'jerapah', type: 'Hewan' }],
    funFact: 'Jerapah bisa tidur sambil berdiri!', type: 'Hewan', category: 'animals'
  },
  { 
    id: 'monyet', letter: 'Monyet', smallLetter: '🐒', title: 'MONYET CERDIK', subtitle: 'Suka panjat pohon!', bgColor: '#EFEBE9',
    words: [{ text: 'MONYET', phonetic: 'Mo-nyet', emoji: '🐒', audio: 'monyet', type: 'Hewan' }],
    funFact: 'Monyet menggunakan ekornya untuk keseimbangan!', type: 'Hewan', category: 'animals'
  }
];


const Learning: React.FC = () => {
  const router = useIonRouter();
  const { category } = useParams<{ category: string }>();
  const location = useLocation();
  const [currentIdx, setCurrentIdx] = useState(0);
  
  // Filter quests based on category
  const filteredQuests = quests.filter(q => q.category === category);
  const quest = filteredQuests[currentIdx];

  const [viewMode, setViewMode] = useState<'discovery' | 'tracing'>('discovery');
  const [contentMode, setContentMode] = useState<'huruf' | 'angka'>('huruf');
  const [showPraise, setShowPraise] = useState(false);
  const [praiseText, setPraiseText] = useState('');
  const [praiseType, setPraiseType] = useState<'success' | 'warning'>('success');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showLetterSelector, setShowLetterSelector] = useState(false);
  const [stars, setStars] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userAvatar, setUserAvatar] = useState('🐱');
  const [hasDrawn, setHasDrawn] = useState(false);
  
  // Reset viewMode and hasDrawn
  useEffect(() => {
    if (category === 'fruits' || category === 'animals') {
      setViewMode('discovery');
    }
    setHasDrawn(false);
  }, [category, currentIdx, viewMode]);

  // Initialize currentIdx based on URL ID or default to 0
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id');
    if (idParam) {
      const idx = filteredQuests.findIndex(q => q.id === idParam);
      if (idx !== -1) {
        setCurrentIdx(idx);
      }
    }
  }, [location.search, category]);

  const currentUserId = localStorage.getItem('cerdika_currentUser');

  // Load user data with real-time sync
  useEffect(() => {
    if (currentUserId) {
      const userRef = ref(db, "students/" + currentUserId);
      const unsub = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setStars(userData.stars || 0);
          setUserAvatar(userData.avatarEmoji || '🐱');
        }
      });
      return () => unsub();
    }
  }, [currentUserId]);

  const addStar = async () => {
    const currentUserId = localStorage.getItem('cerdika_currentUser');
    if (currentUserId) {
      try {
        const userRef = ref(db, "students/" + currentUserId);
        
        // Get latest data to avoid race conditions
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, `students/${currentUserId}`));
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const currentStars = userData.stars || 0;
          const completed = userData.completedQuests || [];
          const questKey = `${category}_${quest.id}`;
          
          const updates: any = {
            stars: currentStars + 1
          };
          
          // Save last studied item
          if (category === 'letters') {
            updates.lastLetter = quest.letter;
          } else if (category === 'numbers') {
            updates.lastNumber = quest.letter;
          } else if (category === 'fruits') {
            updates.lastFruit = quest.letter;
          } else if (category === 'animals') {
            updates.lastAnimal = quest.letter;
          }
          
          if (!completed.includes(questKey)) {
            updates.completedQuests = [...completed, questKey];
          }
          
          await update(userRef, updates);
          setStars(currentStars + 1);
        }
      } catch (error) {
        console.error("Error updating stars/progress:", error);
      }
    }
  };

  // Canvas Logic
  useEffect(() => {
    if (viewMode === 'tracing' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#64B5F6';
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear when switching quest in tracing mode
      }
    }
  }, [viewMode, currentIdx]);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    setHasDrawn(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Ensure consistent style every time we start drawing
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 15;
        ctx.strokeStyle = '#64B5F6';
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      ctx?.lineTo(x, y);
      ctx?.stroke();
    }
  };

  const stopDrawing = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawn(false);
    }
  };

  const getAnimalName = (emoji: string) => {
    const names: { [key: string]: string } = {
      '🐱': 'Kucing',
      '🦁': 'Singa',
      '🐶': 'Anjing',
      '🐰': 'Kelinci',
      '🐼': 'Panda',
      '🐯': 'Harimau',
      '🐨': 'Koala',
      '🐸': 'Katak'
    };
    return names[emoji] || 'Teman';
  };

  const handleNext = () => {
    if (currentIdx < filteredQuests.length - 1) {
      setCurrentIdx(currentIdx + 1);
      clearCanvas();
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      clearCanvas();
    }
  };

  // ============ AUDIO: Huruf/Angka utama ============
  const playMainSound = useCallback(async () => {
    if (isPlaying || !quest) return;
    setIsPlaying(true);
    try {
      if (quest.category === 'letters') {
        await playAudioFile(`/assets/audio/huruf_${quest.letter.toLowerCase()}.mp3`);
      } else {
        await playAudioFile(`/assets/audio/angka_${quest.letter}.mp3`);
      }
    } catch {
      await speakText(quest.letter);
    }
    setIsPlaying(false);
  }, [quest, isPlaying]);

  // ============ AUDIO: Kata contoh ============
  const playWord = useCallback(async (word: { text: string; audio: string }) => {
    if (playingWord || !quest) return;
    setPlayingWord(word.audio);
    setPraiseText(`Hebat! ${word.text}`);
    setShowPraise(true);
    setTimeout(() => setShowPraise(false), 1500);

    try {
      await playAudioFile(`/assets/audio/kata_${word.audio}.mp3`);
    } catch {
      await speakText(`${quest.letter} untuk ${word.text}`);
    }
    setPlayingWord(null);
  }, [playingWord, quest]);

  const handleFinishTracing = () => {
    if (!hasDrawn) {
      setPraiseText("Ayo tulis dulu!");
      setPraiseType('warning');
      setShowPraise(true);
      setTimeout(() => setShowPraise(false), 1500);
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData?.data;
      let pixelCount = 0;
      if (data) {
        for (let i = 3; i < data.length; i += 4) {
          if (data[i] > 0) pixelCount++;
        }
      }
      
      if (pixelCount < 300) {
        setPraiseText("Tulisannya belum selesai!");
        setPraiseType('warning');
        setShowPraise(true);
        setTimeout(() => setShowPraise(false), 1500);
        return;
      }
    }

    addStar();
    setPraiseText("Tulisanmu Bagus Banget!");
    setPraiseType('success');
    setShowPraise(true);
    
    // Auto move to next after 2 seconds
    setTimeout(() => {
      setShowPraise(false);
      handleNext();
    }, 2000);
  };

  const handleFinishDiscovery = () => {
    addStar();
    setPraiseText("Hebat! Kamu sudah belajar ini.");
    setPraiseType('success');
    setShowPraise(true);
    
    // Auto move to next after 2 seconds
    setTimeout(() => {
      setShowPraise(false);
      handleNext();
    }, 2000);
  };

  const switchContent = (mode: 'huruf' | 'angka') => {
    setContentMode(mode);
    setCurrentIdx(0);
    setViewMode('discovery');
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border app-header-v2">
        <IonToolbar className="app-toolbar-v2">
          <div className="header-container-v2">
            <div className="header-left">
              <motion.button 
                className="header-back-btn-v2"
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push('/home', 'back')}
              >
                <IonIcon icon={arrowBackOutline} />
              </motion.button>
              <div className="brand-info-v2">
                <h2 className="brand-name-v2">{viewMode === 'discovery' ? `Belajar ${quest.type}` : 'Tulis'}</h2>
                <div className="stars-pill-v2">
                  <IonIcon icon={star} />
                  <span>{stars} Bintang</span>
                </div>
              </div>
            </div>
            
            <div className="header-right">
              {/* Grid button removed per user request */}
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="learning-content" scrollY={true}>
        <div className="content-bg-decor">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <div className="learning-wrapper">
          {/* Only show segment if it's NOT fruits or animals */}
          {(category !== 'fruits' && category !== 'animals') && (
            <div className="mode-selector-container-inline">
              <IonSegment value={viewMode} onIonChange={e => setViewMode(e.detail.value as any)} mode="ios" className="custom-segment">
                <IonSegmentButton value="discovery">
                  <IonIcon icon={sparklesOutline} />
                  <IonLabel>Belajar {quest.type}</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="tracing">
                  <IonIcon icon={brushOutline} />
                  <IonLabel>Tulis</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>
          )}

          <AnimatePresence mode="wait">
            {viewMode === 'discovery' ? (
              <motion.div
                key={`discovery-${contentMode}-${currentIdx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="discovery-view"
              >
                {/* Main Hero Card */}
                <div className="hero-card full-width-hero" style={{ borderColor: '#1c1c1c', backgroundColor: quest.bgColor }}>
                  <motion.div 
                    className="letter-box-large"
                    whileTap={{ scale: 0.9 }}
                    onClick={playMainSound}
                  >
                    {quest.category === 'fruits' || quest.category === 'animals' ? (
                      <span className="big-letter" style={{ fontSize: '120px' }}>{quest.smallLetter}</span>
                    ) : (
                      <>
                        <span className="big-letter">{quest.letter}</span>
                        <span className="small-letter-display">{quest.smallLetter}</span>
                      </>
                    )}
                    <button className="sound-pulse-v2">
                      <IonIcon icon={volumeMediumOutline} />
                    </button>
                  </motion.div>
                </div>

                <div className="lesson-heading">
                  <h1 className="main-title" style={{ color: '#1c1c1c' }}>
                    {quest.title}
                  </h1>
                  <p className="sub-title" style={{ color: '#666' }}>
                    {quest.subtitle}
                  </p>
                </div>


                {/* Word Association Grid OR Counting Card */}
                {quest.category !== 'numbers' ? (
                  <div className="words-association-grid">
                    {quest.words?.map((word: WordItem, i: number) => (
                      <motion.div 
                        key={i} 
                        className="word-card"
                        style={{ borderLeft: `8px solid ${quest.bgColor}` }}
                        whileHover={{ y: -5 }}
                        onClick={() => playWord(word)}
                      >
                        <span className="word-emoji">{word.emoji}</span>
                        <div className="word-text-box">
                          <span className="word-main" style={{ color: '#1c1c1c' }}>
                            <span className="highlight" style={{ color: '#d32f2f' }}>{word.text[0]}</span>
                            {word.text.slice(1)}
                          </span>
                          <span className="word-phonetic" style={{ color: '#888' }}>{word.phonetic}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : quest.category === 'numbers' ? (
                  <div className="counting-card-container">
                    <motion.div 
                      className="counting-square-card"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={quest.id}
                    >
                      <div className="counting-icons-area">
                        {Array.from({ length: parseInt(quest.letter) }).map((_, i) => (
                          <motion.span 
                            key={i}
                            className="counting-emoji-item"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {userAvatar}
                          </motion.span>
                        ))}
                      </div>
                      <h2 className="counting-label">
                        {quest.letter} {getAnimalName(userAvatar)}
                      </h2>
                    </motion.div>
                  </div>
                ) : null}

                {/* Fun Fact */}
                <div className="fun-fact-card">
                  <div className="fact-icon">💡</div>
                  <div className="fact-content">
                    <span className="fact-label" style={{ color: '#1c1c1c' }}>Tahukah Kamu?</span>
                    <p style={{ color: '#5d4037' }}>
                      {quest.funFact}
                    </p>
                  </div>
                </div>

                {/* Finish Button for Fruits/Animals */}
                {(category === 'fruits' || category === 'animals') && (
                  <motion.button 
                    className="finish-discovery-btn"
                    whileTap={{ scale: 0.9 }}
                    onClick={handleFinishDiscovery}
                  >
                    <IonIcon icon={happyOutline} />
                    <span>Selesai Belajar!</span>
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="tracing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="tracing-view"
              >
                <div className="tracing-container">
                  <div className="canvas-wrapper">
                    {/* Background Guide Letter */}
                    <div className="guide-letters-container">
                      <div className="guide-letter-pair">
                        <span 
                          className="guide-main"
                          style={{ fontSize: quest.letter.length > 2 ? '100px' : quest.letter.length > 1 ? '150px' : '220px' }}
                        >
                          {quest.letter}
                        </span>
                        {quest.smallLetter && (
                          <span className="guide-small">{quest.smallLetter}</span>
                        )}
                      </div>
                    </div>
                    <canvas 
                      ref={canvasRef}
                      width={330}
                      height={420}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseLeave={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                      className="tracing-canvas"
                    />
                  </div>
                  
                  <div className="canvas-controls">
                    <button className="control-btn clear" onClick={clearCanvas}>
                      <IonIcon icon={trashOutline} />
                      <span>Hapus</span>
                    </button>
                    <button className="control-btn done" onClick={handleFinishTracing}>
                      <IonIcon icon={happyOutline} />
                      <span>Selesai</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Controls */}
          <div className="nav-controls-footer">
            <button 
              className={`nav-btn-round ${currentIdx === 0 ? 'disabled' : ''}`}
              onClick={handlePrev}
            >
              <IonIcon icon={chevronBackOutline} />
            </button>
            <div className="current-step">
              <span>{currentIdx + 1} / {filteredQuests.length}</span>
            </div>
            <button 
              className={`nav-btn-round ${currentIdx === filteredQuests.length - 1 || (viewMode === 'tracing' && !hasDrawn) ? 'disabled' : ''}`}
              onClick={() => {
                if (viewMode === 'tracing' && !hasDrawn) {
                  setPraiseText("Ayo tulis dulu!");
                  setPraiseType('warning');
                  setShowPraise(true);
                  setTimeout(() => setShowPraise(false), 1500);
                  return;
                }
                handleNext();
              }}
            >
              <IonIcon icon={chevronForwardOutline} />
            </button>
          </div>
        </div>

        {/* Letter/Number Selector Modal */}
        <IonModal 
          isOpen={showLetterSelector} 
          onDidDismiss={() => setShowLetterSelector(false)}
          className="letter-selector-modal"
          breakpoints={[0, 0.6]}
          initialBreakpoint={0.6}
        >
          <div className="selector-content">
            <h3>Pilih {quest.type}</h3>
            <div className="selector-grid">
              {filteredQuests.map((q, i) => (
                <div 
                  key={q.id} 
                  className={`selector-item ${i === currentIdx ? 'active' : ''} ${q.category === 'fruits' || q.category === 'animals' ? 'is-emoji' : ''}`}
                  onClick={() => {
                    setCurrentIdx(i);
                    setShowLetterSelector(false);
                    setViewMode('discovery');
                  }}
                >
                  {q.category === 'fruits' || q.category === 'animals' ? q.smallLetter : q.letter}
                </div>
              ))}
              <div className="selector-item locked">C</div>
              <div className="selector-item locked">D</div>
              <div className="selector-item locked">E</div>
            </div>
          </div>
        </IonModal>

        {/* Praise Overlay */}
        <AnimatePresence>
          {showPraise && (
            <motion.div 
              className={`praise-overlay ${praiseType}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className={`praise-popup popup-${praiseType}`}
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
              >
                <div className="praise-icon-box">
                  <IonIcon 
                    icon={praiseType === 'success' ? happyOutline : gridOutline} 
                    className="praise-icon-large" 
                  />
                </div>
                <h2 className="praise-title">{praiseText}</h2>
                {praiseType === 'success' && (
                  <div className="stars-anim">✨✨✨</div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default Learning;
