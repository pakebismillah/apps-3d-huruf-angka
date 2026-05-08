import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonIcon,
  IonFooter,
  useIonRouter
} from '@ionic/react';
import { 
  settingsOutline, 
  volumeHighOutline, 
  bulbOutline, 
  star, 
  checkmarkCircle, 
  closeCircle,
  homeOutline,
  libraryOutline,
  gameControllerOutline,
  personOutline
} from 'ionicons/icons';
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { motion, AnimatePresence } from 'framer-motion';
import './Games.css';

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


const letterQuestions = [
  { id: 1, question: 'Mana huruf B?', options: ['A', 'B', 'C', 'D'], correct: 'B', hint: 'Huruf B punya dua perut yang gendut di depan!', audio: 'B' },
  { id: 2, question: 'Mana huruf G?', options: ['G', 'F', 'H', 'J'], correct: 'G', hint: 'G seperti kepala kucing yang melingkar!', audio: 'G' },
  { id: 3, question: 'Mana huruf A?', options: ['V', 'M', 'A', 'N'], correct: 'A', hint: 'A seperti atap rumah yang runcing!', audio: 'A' },
  { id: 4, question: 'Mana huruf D?', options: ['B', 'D', 'P', 'Q'], correct: 'D', hint: 'D punya satu perut besar di belakang!', audio: 'D' },
  { id: 5, question: 'Mana huruf F?', options: ['E', 'F', 'L', 'T'], correct: 'F', hint: 'F seperti bendera yang punya dua garis!', audio: 'F' },
  { id: 6, question: 'Mana huruf K?', options: ['K', 'X', 'Y', 'Z'], correct: 'K', hint: 'K punya mulut terbuka dan tangan melambai!', audio: 'K' },
  { id: 7, question: 'Mana huruf M?', options: ['W', 'V', 'M', 'N'], correct: 'M', hint: 'M seperti dua gunung yang berjajar!', audio: 'M' },
  { id: 8, question: 'Mana huruf S?', options: ['Z', 'S', 'C', 'O'], correct: 'S', hint: 'S meliuk-liuk seperti ular!', audio: 'S' },
  { id: 9, question: 'Mana huruf T?', options: ['I', 'J', 'T', 'L'], correct: 'T', hint: 'T seperti tiang jemuran yang lurus!', audio: 'T' },
  { id: 10, question: 'Mana huruf Z?', options: ['N', 'M', 'Z', 'S'], correct: 'Z', hint: 'Z seperti jalanan yang berbelok tajam!', audio: 'Z' },
  { id: 11, question: 'Mana huruf E?', options: ['E', 'F', 'L', 'H'], correct: 'E', hint: 'E seperti sisir yang punya tiga gigi!', audio: 'E' },
  { id: 12, question: 'Mana huruf H?', options: ['H', 'N', 'M', 'U'], correct: 'H', hint: 'H seperti tangga yang ada jembatannya!', audio: 'H' },
  { id: 13, question: 'Mana huruf J?', options: ['J', 'L', 'I', 'U'], correct: 'J', hint: 'J seperti kail pancing ikan!', audio: 'J' },
  { id: 14, question: 'Mana huruf L?', options: ['L', 'I', 'J', 'T'], correct: 'L', hint: 'L seperti kaki yang sedang selonjor!', audio: 'L' },
  { id: 15, question: 'Mana huruf O?', options: ['O', 'C', 'Q', 'D'], correct: 'O', hint: 'O bulat seperti donat!', audio: 'O' },
  { id: 16, question: 'Mana huruf P?', options: ['P', 'R', 'B', 'D'], correct: 'P', hint: 'P punya satu perut di atas!', audio: 'P' },
  { id: 17, question: 'Mana huruf R?', options: ['R', 'P', 'B', 'K'], correct: 'R', hint: 'R itu huruf P yang sedang melangkah!', audio: 'R' },
  { id: 18, question: 'Mana huruf U?', options: ['U', 'V', 'W', 'N'], correct: 'U', hint: 'U seperti gelas yang terbuka di atas!', audio: 'U' },
  { id: 19, question: 'Mana huruf V?', options: ['V', 'U', 'W', 'Y'], correct: 'V', hint: 'V seperti paruh burung yang terbuka!', audio: 'V' },
  { id: 20, question: 'Mana huruf W?', options: ['W', 'M', 'V', 'N'], correct: 'W', hint: 'W seperti dua huruf V yang bergandengan!', audio: 'W' }
];

const numberQuestions = [
  { id: 1, question: 'Mana angka 5?', options: ['3', '5', '2', '8'], correct: '5', hint: 'Angka 5 punya perut buncit dan pakai topi!', audio: '5' },
  { id: 2, question: 'Mana angka 1?', options: ['1', '4', '7', '0'], correct: '1', hint: 'Angka 1 tegak lurus seperti tiang lampu!', audio: '1' },
  { id: 3, question: 'Mana angka 3?', options: ['2', '3', '8', '6'], correct: '3', hint: 'Angka 3 seperti sayap burung yang sedang terbang!', audio: '3' },
  { id: 4, question: 'Mana angka 8?', options: ['0', '9', '8', '6'], correct: '8', hint: 'Angka 8 seperti kacamata yang ditumpuk!', audio: '8' },
  { id: 5, question: 'Mana angka 2?', options: ['5', '2', '7', '3'], correct: '2', hint: 'Angka 2 melengkung seperti leher angsa!', audio: '2' },
  { id: 6, question: 'Mana angka 6?', options: ['9', '6', '0', '5'], correct: '6', hint: 'Angka 6 punya perut bulat di bawah!', audio: '6' },
  { id: 7, question: 'Mana angka 9?', options: ['6', '9', '8', '0'], correct: '9', hint: 'Angka 9 punya kepala besar di atas!', audio: '9' },
  { id: 8, question: 'Mana angka 4?', options: ['1', '7', '4', '2'], correct: '4', hint: 'Angka 4 seperti kursi yang terbalik!', audio: '4' },
  { id: 9, question: 'Mana angka 7?', options: ['1', '4', '7', '9'], correct: '7', hint: 'Angka 7 seperti tongkat kakek yang bengkok!', audio: '7' },
  { id: 10, question: 'Mana angka 10?', options: ['1', '0', '10', '11'], correct: '10', hint: 'Angka 10 adalah angka 1 yang bergandengan dengan 0!', audio: '10' },
  { id: 11, question: 'Mana angka 11?', options: ['10', '11', '12', '21'], correct: '11', hint: 'Angka 11 adalah dua angka 1 yang berdiri sejajar!', audio: '11' },
  { id: 12, question: 'Mana angka 12?', options: ['11', '12', '13', '21'], correct: '12', hint: 'Angka 12 adalah angka 1 yang berteman dengan 2!', audio: '12' },
  { id: 13, question: 'Mana angka 13?', options: ['12', '13', '14', '31'], correct: '13', hint: 'Angka 13 adalah angka 1 yang berteman dengan 3!', audio: '13' },
  { id: 14, question: 'Mana angka 15?', options: ['14', '15', '16', '51'], correct: '15', hint: 'Angka 15 adalah angka 1 yang berteman dengan 5!', audio: '15' },
  { id: 15, question: 'Mana angka 20?', options: ['10', '20', '30', '02'], correct: '20', hint: 'Angka 20 adalah angka 2 yang berteman dengan 0!', audio: '20' }
];

const fruitQuestions = [
  { id: 1, question: 'Mana buah Apel?', options: ['🍎', '🍌', '🍊', '🍇'], correct: '🍎', hint: 'Apel biasanya berwarna merah dan bulat!', audio: 'apel' },
  { id: 2, question: 'Mana buah Pisang?', options: ['🍎', '🍌', '🍊', '🍍'], correct: '🍌', hint: 'Pisang berwarna kuning dan bentuknya panjang!', audio: 'pisang' },
  { id: 3, question: 'Mana buah Jeruk?', options: ['🥭', '🍉', '🍊', '🍓'], correct: '🍊', hint: 'Jeruk warnanya oranye dan rasanya segar!', audio: 'jeruk' },
  { id: 4, question: 'Mana buah Semangka?', options: ['🍉', '🍈', '🍎', '🍐'], correct: '🍉', hint: 'Semangka itu besar, hijau di luar dan merah di dalam!', audio: 'semangka' },
  { id: 5, question: 'Mana buah Anggur?', options: ['🍇', '🫐', '🍒', '🍓'], correct: '🍇', hint: 'Anggur itu kecil-kecil dan berkumpul banyak!', audio: 'anggur' }
];

const animalQuestions = [
  { id: 1, question: 'Mana hewan Kucing?', options: ['🐱', '🐶', '🐭', '🐹'], correct: '🐱', hint: 'Kucing bunyinya meong-meong!', audio: 'kucing' },
  { id: 2, question: 'Mana hewan Gajah?', options: ['🐘', '🦒', '🦓', '🦏'], correct: '🐘', hint: 'Gajah punya belalai yang sangat panjang!', audio: 'gajah' },
  { id: 3, question: 'Mana hewan Singa?', options: ['🐯', '🦁', '🐻', '🐺'], correct: '🦁', hint: 'Singa adalah raja hutan yang pemberani!', audio: 'singa' },
  { id: 4, question: 'Mana hewan Jerapah?', options: ['🦒', '🐘', '🐎', '🦌'], correct: '🦒', hint: 'Jerapah punya leher yang sangat tinggi!', audio: 'jerapah' },
  { id: 5, question: 'Mana hewan Monyet?', options: ['🐒', '🦍', '🦧', '🐶'], correct: '🐒', hint: 'Monyet suka sekali memanjat pohon!', audio: 'monyet' }
];

const Games: React.FC = () => {
  const router = useIonRouter();
  const [gameMode, setGameMode] = useState<'letters' | 'numbers' | 'fruits' | 'animals' | 'mixed' | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  
  // Calculate Level based on stars
  const getUserLevel = (stars: number) => {
    if (stars >= 150) return 5;
    if (stars >= 100) return 4;
    if (stars >= 50) return 3;
    if (stars >= 25) return 2;
    return 1;
  };

  const userLevel = getUserLevel(user?.stars || 0);

  const currentUserId = localStorage.getItem('cerdika_currentUser');

  useEffect(() => {
    if (currentUserId) {
      const userRef = ref(db, "students/" + currentUserId);
      const unsub = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUser({ id: snapshot.key, ...snapshot.val() });
        }
      });
      return () => unsub();
    } else {
      setUser(null);
    }
  }, [currentUserId]);

  const questions = shuffledQuestions;
  const q = questions[currentIdx];

  // Randomize questions when game starts
  useEffect(() => {
    if (gameMode) {
      let pool: any[] = [];
      if (gameMode === 'letters') pool = letterQuestions;
      else if (gameMode === 'numbers') pool = numberQuestions;
      else if (gameMode === 'fruits') pool = fruitQuestions;
      else if (gameMode === 'animals') pool = animalQuestions;
      else if (gameMode === 'mixed') pool = [...letterQuestions, ...numberQuestions, ...fruitQuestions, ...animalQuestions];

      const shuffled = [...pool]
        .sort(() => Math.random() - 0.5) // Shuffle
        .slice(0, 10); // Pick 10
      setShuffledQuestions(shuffled);
      setCurrentIdx(0);
    } else {
        setShuffledQuestions([]);
    }
  }, [gameMode]);

  // Play question audio automatically
  useEffect(() => {
    if (gameMode && q) {
      const timer = setTimeout(() => {
        speakText(q.question);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [gameMode, currentIdx, q]); 

  const handleSelect = (opt: string) => {
    if (status !== 'idle') return;
    
    setSelected(opt);
    if (opt === q.correct) {
      setStatus('correct');
      setScore(s => s + 3);
      setTimeout(() => nextQuestion(), 2000);
    } else {
      setStatus('wrong');
      setTimeout(() => {
        setStatus('idle');
        setSelected(null);
      }, 1000);
    }
  };

  const nextQuestion = () => {
    if (questions.length === 0) return;
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1);
      setSelected(null);
      setStatus('idle');
    } else {
      // Game Over - Save stars to Firebase
      const currentUserId = localStorage.getItem('cerdika_currentUser');
      if (currentUserId && user) {
        const userRef = ref(db, "students/" + currentUserId);
        update(userRef, {
          stars: (user.stars || 0) + score
        });
      }

      setEarnedStars(score);
      setShowVictory(true);
    }
  };

  const closeVictory = () => {
    setShowVictory(false);
    setGameMode(null);
    setCurrentIdx(0);
    setSelected(null);
    setStatus('idle');
    setScore(0);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border app-header-v2">
        <IonToolbar className="app-toolbar-v2">
          <div className="header-container-v2">
            <div className="header-left">
              <motion.div 
                className="logo-circle-v2" 
                style={{backgroundColor: user?.avatarColor || '#FFD54F'}}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/profile')}
              >
                <span className="logo-emoji">{user?.avatarEmoji || '🦁'}</span>
              </motion.div>
              <div className="brand-info-v2">
                <h2 className="brand-name-v2">{user?.name || 'Bermain'}</h2>
                <div className="status-pills-row">
                  <div className="stars-pill-v2">
                    <IonIcon icon={star} />
                    <span>{user?.stars || 0} Bintang</span>
                  </div>
                  <div className="level-pill-v2">
                    <span>Level {userLevel}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="header-right">
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="games-content">
        <div className="games-wrapper">
          {!gameMode ? (
            <div className="mode-selection-screen">
              <div className="level-progress-banner">
                <div className="level-info-main">
                  <span className="lvl-text">Level {userLevel}</span>
                  <span className="lvl-sub">Kumpulkan bintang untuk naik level!</span>
                </div>
                <div className="lvl-progress-bar">
                  <motion.div 
                    className="lvl-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(userLevel / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div className="mode-options">
                {/* Level 1 */}
                <motion.div 
                  className="mode-card card-letters"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameMode('letters')}
                >
                  <div className="mode-level-tag">Lvl 1</div>
                  <div className="mode-icon-box">
                    <span className="mode-emoji">ABC</span>
                  </div>
                  <div className="mode-text-content">
                    <h2 className="mode-card-title">Huruf Seru</h2>
                    <p className="mode-card-desc">Cari teman-teman huruf!</p>
                  </div>
                </motion.div>

                {/* Level 2 */}
                <motion.div 
                  className={`mode-card card-numbers ${userLevel < 2 ? 'locked' : ''}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => userLevel >= 2 && setGameMode('numbers')}
                >
                  <div className="mode-level-tag">Lvl 2</div>
                  <div className="mode-icon-box">
                    <span className="mode-emoji">{userLevel < 2 ? '🔒' : '123'}</span>
                  </div>
                  <div className="mode-text-content">
                    <h2 className="mode-card-title">Angka Ceria</h2>
                    {userLevel < 2 ? (
                      <p className="mode-card-desc" style={{color: '#d32f2f'}}>Butuh 25 Bintang!</p>
                    ) : (
                      <p className="mode-card-desc">Ayo berhitung bersama!</p>
                    )}
                  </div>
                </motion.div>

                {/* Level 3 */}
                <motion.div 
                  className={`mode-card card-green ${userLevel < 3 ? 'locked' : ''}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => userLevel >= 3 && setGameMode('fruits')}
                >
                  <div className="mode-level-tag">Lvl 3</div>
                  <div className="mode-icon-box">
                    <span className="mode-emoji">{userLevel < 3 ? '🔒' : '🍎'}</span>
                  </div>
                  <div className="mode-text-content">
                    <h2 className="mode-card-title">Tebak Buah</h2>
                    {userLevel < 3 ? (
                      <p className="mode-card-desc" style={{color: '#d32f2f'}}>Butuh 50 Bintang!</p>
                    ) : (
                      <p className="mode-card-desc">Mana ya buahnya?</p>
                    )}
                  </div>
                </motion.div>

                {/* Level 4 */}
                <motion.div 
                  className={`mode-card card-red ${userLevel < 4 ? 'locked' : ''}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => userLevel >= 4 && setGameMode('animals')}
                >
                  <div className="mode-level-tag">Lvl 4</div>
                  <div className="mode-icon-box">
                    <span className="mode-emoji">{userLevel < 4 ? '🔒' : '🦁'}</span>
                  </div>
                  <div className="mode-text-content">
                    <h2 className="mode-card-title">Suara Hewan</h2>
                    {userLevel < 4 ? (
                      <p className="mode-card-desc" style={{color: '#d32f2f'}}>Butuh 100 Bintang!</p>
                    ) : (
                      <p className="mode-card-desc">Siapa bunyi begitu?</p>
                    )}
                  </div>
                </motion.div>

                {/* Level 5 */}
                <motion.div 
                  className={`mode-card card-purple ${userLevel < 5 ? 'locked' : ''}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => userLevel >= 5 && setGameMode('mixed')}
                >
                  <div className="mode-level-tag">Lvl 5</div>
                  <div className="mode-icon-box">
                    <span className="mode-emoji">{userLevel < 5 ? '🔒' : '🏆'}</span>
                  </div>
                  <div className="mode-text-content">
                    <h2 className="mode-card-title">Tantangan Super</h2>
                    {userLevel < 5 ? (
                      <p className="mode-card-desc" style={{color: '#d32f2f'}}>Butuh 150 Bintang!</p>
                    ) : (
                      <p className="mode-card-desc">Campuran semua ilmu!</p>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          ) : q ? (
            <>
              {/* Progress Header */}
              <div className="quiz-progress">
                <div className="progress-text">
                  <span>Soal {currentIdx + 1}/{questions.length}</span>
                </div>
                <div className="progress-bar-container">
                  <motion.div 
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="question-section">
                <div className="question-header-row">
                  <motion.button 
                    className="replay-audio-btn-large"
                    whileTap={{ scale: 0.9 }}
                    onClick={() => speakText(q.question)}
                  >
                    <IonIcon icon={volumeHighOutline} />
                    <span>Dengarkan Soal</span>
                  </motion.button>
                </div>
                <p className="question-sub">Ayo pilih kartu yang benar!</p>
              </div>

              <div className="options-grid">
                {q.options.map((opt) => (
                  <motion.div
                    key={opt}
                    className={`option-card ${selected === opt ? status : ''}`}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(opt)}
                    animate={selected === opt && status === 'wrong' ? { x: [-10, 10, -10, 10, 0] } : {}}
                  >
                    <span className="option-text">{opt}</span>
                    {selected === opt && status === 'correct' && (
                      <div className="status-badge correct">
                        <IonIcon icon={checkmarkCircle} />
                      </div>
                    )}
                    {selected === opt && status === 'wrong' && (
                      <div className="status-badge wrong">
                        <IonIcon icon={closeCircle} />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Hint Box */}
              <motion.div 
                className="hint-box"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={`hint-${currentIdx}`}
              >
                <div className="hint-icon-circle">
                  <IonIcon icon={bulbOutline} />
                </div>
                <div className="hint-text">
                  <span className="hint-label">Bantuan Kecil</span>
                  <p>{q.hint}</p>
                </div>
              </motion.div>

              {/* Audio Button */}
              <div className="audio-action">
                <button className="audio-btn-large" onClick={() => setGameMode(null)}>
                  <IonIcon icon={homeOutline} />
                  <span>Ganti Permainan</span>
                </button>
              </div>
            </>
          ) : (
            <div className="loading-questions">
              <p>Menyiapkan permainan...</p>
            </div>
          )}
        </div>

        {/* Victory Modal Overlay */}
        <AnimatePresence>
          {showVictory && (
            <motion.div 
              className="victory-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="victory-card"
                initial={{ scale: 0.5, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 100 }}
                transition={{ type: "spring", damping: 15 }}
              >
                <div className="victory-crown">👑</div>
                <h1 className="victory-title">Luar Biasa!</h1>
                <p className="victory-subtitle">Kamu telah menyelesaikan permainan</p>
                
                <div className="victory-stats">
                  <div className="stat-item">
                    <div className="stat-icon-circle">
                      <IonIcon icon={star} />
                    </div>
                    <div className="stat-info">
                      <span className="stat-value">+{earnedStars}</span>
                      <span className="stat-label">Bintang</span>
                    </div>
                  </div>
                </div>

                <div className="victory-praise">
                  Kamu semakin pintar hari ini! ✨
                </div>

                <button className="victory-btn-main" onClick={closeVictory}>
                  <span>Main Lagi</span>
                  <IonIcon icon={gameControllerOutline} />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </IonContent>

      <IonFooter className="ion-no-border home-footer">
        <div className="nav-bar">
          <motion.div 
            className="nav-item" 
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/home')}
          >
            <IonIcon icon={homeOutline} />
            <span>Beranda</span>
          </motion.div>
          <motion.div 
            className="nav-item active" 
            initial={false}
            animate={{ y: -5 }}
            onClick={() => router.push('/games')}
          >
            <IonIcon icon={gameControllerOutline} />
            <span>Bermain</span>
            <motion.div className="nav-indicator" layoutId="nav-indicator" />
          </motion.div>
          <motion.div 
            className="nav-item" 
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/profile')}
          >
            <IonIcon icon={personOutline} />
            <span>Profil</span>
          </motion.div>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Games;
