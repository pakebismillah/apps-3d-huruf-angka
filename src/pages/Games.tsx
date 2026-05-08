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
  { id: 10, question: 'Mana huruf Z?', options: ['N', 'M', 'Z', 'S'], correct: 'Z', hint: 'Z seperti jalanan yang berbelok tajam!', audio: 'Z' }
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
  { id: 10, question: 'Mana angka 10?', options: ['1', '0', '10', '11'], correct: '10', hint: 'Angka 10 adalah angka 1 yang bergandengan dengan 0!', audio: '10' }
];

const Games: React.FC = () => {
  const router = useIonRouter();
  const [gameMode, setGameMode] = useState<'letters' | 'numbers' | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const [user, setUser] = useState<any>(null);

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

  const questions = gameMode === 'letters' ? letterQuestions : numberQuestions;
  const q = questions[currentIdx];

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

      alert(`Hebat! Kamu dapat ${score} Bintang Baru!`);
      setGameMode(null);
      setCurrentIdx(0);
      setSelected(null);
      setStatus('idle');
      setScore(0);
    }
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
                <div className="stars-pill-v2">
                  <IonIcon icon={star} />
                  <span>{user?.stars || 0} Bintang</span>
                </div>
              </div>
            </div>
            
            <div className="header-right">
              {/* Settings button removed/replaced per user pattern request */}
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="games-content">
        <div className="games-wrapper">
          {!gameMode ? (
            <div className="mode-selection-screen">
              <h1 className="mode-title">Mau main apa hari ini?</h1>
              <p className="mode-subtitle">Pilih petualanganmu!</p>
              
              <div className="mode-options">
                <motion.div 
                  className="mode-card card-letters"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameMode('letters')}
                >
                  <div className="mode-icon-box">
                    <span className="mode-emoji">ABC</span>
                  </div>
                  <div className="mode-text-content">
                    <h2 className="mode-card-title">Huruf Seru</h2>
                    <p className="mode-card-desc">Cari teman-teman huruf!</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="mode-card card-numbers"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGameMode('numbers')}
                >
                  <div className="mode-icon-box">
                    <span className="mode-emoji">123</span>
                  </div>
                  <div className="mode-text-content">
                    <h2 className="mode-card-title">Angka Ceria</h2>
                    <p className="mode-card-desc">Ayo berhitung bersama!</p>
                  </div>
                </motion.div>
              </div>
            </div>
          ) : (
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
                <h1 className="question-title">{q.question}</h1>
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
          )}
        </div>
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
