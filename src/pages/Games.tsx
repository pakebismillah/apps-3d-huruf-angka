import React, { useState } from 'react';
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
import { motion, AnimatePresence } from 'framer-motion';
import './Games.css';

const questions = [
  {
    id: 1,
    question: 'Mana huruf B?',
    options: ['A', 'B', 'C'],
    correct: 'B',
    hint: 'Perhatikan bentuk perutnya! Huruf B punya dua perut yang gendut di depan.',
    audio: 'B'
  },
  {
    id: 2,
    question: 'Mana huruf G?',
    options: ['G', 'F', 'H'],
    correct: 'G',
    hint: 'G seperti kepala kucing yang melingkar!',
    audio: 'G'
  }
];

const Games: React.FC = () => {
  const router = useIonRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);

  const q = questions[currentIdx];

  const handleSelect = (opt: string) => {
    if (status !== 'idle') return;
    
    setSelected(opt);
    if (opt === q.correct) {
      setStatus('correct');
      setScore(s => s + 10);
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
      // Game Over or Restart
      alert(`Hebat! Skor kamu: ${score + 10}`);
      setCurrentIdx(0);
      setSelected(null);
      setStatus('idle');
      setScore(0);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border app-header">
        <IonToolbar className="app-toolbar">
          <div className="header-content">
            <div className="header-logo-box">
              <span>🦁</span>
            </div>
            <div className="header-text-info">
              <span className="header-app-name">Cerdika</span>
              <div className="header-badge-row">
                <IonIcon icon={star} color="warning" />
                <span className="badge-text">120 Bintang</span>
              </div>
            </div>
          </div>
          <IonButtons slot="end">
            <button className="header-action-btn">
              <IonIcon icon={settingsOutline} />
            </button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="games-content">
        <div className="games-wrapper">
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
            <button className="audio-btn-large">
              <IonIcon icon={volumeHighOutline} />
              <span>Dengarkan Suara</span>
            </button>
          </div>
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
            className="nav-item" 
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/learning')}
          >
            <IonIcon icon={libraryOutline} />
            <span>Belajar</span>
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
