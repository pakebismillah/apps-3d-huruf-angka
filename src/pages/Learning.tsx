import React, { useState, useRef, useEffect } from 'react';
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
  chevronBackOutline, 
  chevronForwardOutline,
  star,
  happyOutline,
  brushOutline,
  trashOutline,
  gridOutline,
  sparklesOutline,
  arrowBackOutline
} from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, update } from "firebase/database";
import { db } from "../firebase";
import './Learning.css';

const quests = [
  { 
    id: 'A', 
    letter: 'A', 
    title: 'A UNTUK APEL', 
    subtitle: 'Mari belajar mengenal huruf A!',
    image: '/assets/images/logo.png',
    bgColor: '#FFF9C4',
    words: [
      { text: 'APEL', phonetic: 'A-pel', emoji: '🍎', audio: 'apel' },
      { text: 'ANGGUR', phonetic: 'Ang-gur', emoji: '🍇', audio: 'anggur' },
      { text: 'AYAM', phonetic: 'A-yam', emoji: '🐔', audio: 'ayam' }
    ],
    funFact: 'Apel itu sehat dan bikin kita kuat!'
  },
  { 
    id: 'B', 
    letter: 'B', 
    title: 'B UNTUK BUKU', 
    subtitle: 'Mari belajar mengenal huruf B!',
    image: '/assets/images/logo.png',
    bgColor: '#E3F2FD',
    words: [
      { text: 'BUKU', phonetic: 'Bu-ku', emoji: '📚', audio: 'buku' },
      { text: 'BOLA', phonetic: 'Bo-la', emoji: '⚽', audio: 'bola' },
      { text: 'BEBEK', phonetic: 'Be-bek', emoji: '🦆', audio: 'bebek' }
    ],
    funFact: 'Membaca buku bikin kita jadi pintar!'
  }
];

const Learning: React.FC = () => {
  const router = useIonRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'discovery' | 'tracing'>('discovery');
  const [showPraise, setShowPraise] = useState(false);
  const [praiseText, setPraiseText] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showLetterSelector, setShowLetterSelector] = useState(false);
  const [stars, setStars] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const quest = quests[currentIdx];

  // Load user data
  useEffect(() => {
    const loadUser = () => {
      const currentUserId = localStorage.getItem('cerdika_currentUser');
      if (currentUserId) {
        const storedProfiles = localStorage.getItem('cerdika_users');
        if (storedProfiles) {
          const profiles = JSON.parse(storedProfiles);
          const foundUser = profiles.find((p: any) => p.id === currentUserId);
          if (foundUser) {
            setStars(foundUser.stars || 0);
          }
        }
      }
    };
    loadUser();
  }, []);

  const addStar = async () => {
    const currentUserId = localStorage.getItem('cerdika_currentUser');
    if (currentUserId) {
      try {
        const userRef = ref(db, "students/" + currentUserId);
        const newStars = stars + 1;
        setStars(newStars);
        await update(userRef, {
          stars: newStars,
          lastLetter: quest.letter
        });
      } catch (error) {
        console.error("Error updating stars/progress:", error);
      }
    }
  };

  if (!quest) {
    return <IonPage><IonContent><p>No learning content available.</p></IonContent></IonPage>;
  }

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
      }
    }
  }, [viewMode]);

  const startDrawing = (e: any) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      ctx?.beginPath();
      ctx?.moveTo(x, y);
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
    }
  };

  const handleNext = () => {
    if (currentIdx < quests.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setViewMode('discovery');
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setViewMode('discovery');
    }
  };

  const playLetterSound = () => {
    try {
      const audio = new Audio(`/assets/audio/huruf_${quest.letter.toLowerCase()}.mp3`);
      audio.play().catch(e => console.log("Audio huruf belum ada.", e));
    } catch (e) {
      console.log(e);
    }
  };

  const playWord = (word: any) => {
    setPraiseText(`Hebat! ${word.text}`);
    setShowPraise(true);
    setTimeout(() => setShowPraise(false), 1500);

    try {
      const audio = new Audio(`/assets/audio/kata_${word.audio}.mp3`);
      audio.play().catch(e => console.log("Audio kata belum ada.", e));
    } catch (e) {
      console.log(e);
    }
  };

  const handleFinishTracing = () => {
    addStar();
    setPraiseText("Tulisanmu Bagus Banget!");
    setShowPraise(true);
    setTimeout(() => setShowPraise(false), 2000);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border app-header">
        <IonToolbar className="app-toolbar">
          <IonButtons slot="start">
            <button className="header-action-btn" onClick={() => router.push('/home', 'back')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
          </IonButtons>
          <div className="header-content" style={{justifyContent: 'center', flex: 1}}>
            <div className="header-badge-row">
              <IonIcon icon={star} color="warning" style={{fontSize: '1.5rem'}} />
              <span className="badge-text" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{stars}</span>
            </div>
          </div>
          <IonButtons slot="end">
            <button className="header-action-btn" onClick={() => setShowLetterSelector(true)}>
              <IonIcon icon={gridOutline} />
            </button>
          </IonButtons>
        </IonToolbar>
        
        <div className="mode-selector-container">
          <IonSegment value={viewMode} onIonChange={e => setViewMode(e.detail.value as any)} mode="ios" className="custom-segment">
            <IonSegmentButton value="discovery">
              <IonIcon icon={sparklesOutline} />
              <IonLabel>Kenali</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="tracing">
              <IonIcon icon={brushOutline} />
              <IonLabel>Tulis</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>
      </IonHeader>

      <IonContent className="learning-content" scrollY={viewMode === 'discovery'}>
        <div className="content-bg-decor">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <div className="learning-wrapper">
          <AnimatePresence mode="wait">
            {viewMode === 'discovery' ? (
              <motion.div
                key="discovery"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="discovery-view"
              >
                {/* Main Hero Card */}
                <div className="hero-card" style={{ borderColor: '#1c1c1c' }}>
                  <div className="hero-letter-side" style={{ backgroundColor: quest.bgColor }}>
                    <motion.div 
                      className="letter-box"
                      whileTap={{ scale: 0.9 }}
                      onClick={playLetterSound}
                    >
                      <span style={{ color: '#1c1c1c' }}>{quest.letter}</span>
                      <button className="sound-pulse">
                        <IonIcon icon={volumeMediumOutline} />
                      </button>
                    </motion.div>
                  </div>
                  <div className="hero-illust-side">
                    <img src={quest.image} alt="Illust" className="floating-illust" />
                  </div>
                </div>

                <div className="lesson-heading">
                  <h1 className="main-title" style={{ color: '#1c1c1c' }}>{quest.title}</h1>
                  <p className="sub-title" style={{ color: '#666' }}>{quest.subtitle}</p>
                </div>

                {/* Word Association Grid */}
                <div className="words-association-grid">
                  {quest.words.map((word, i) => (
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

                {/* Fun Fact Card */}
                <div className="fun-fact-card">
                  <div className="fact-icon">💡</div>
                  <div className="fact-content">
                    <span className="fact-label" style={{ color: '#1c1c1c' }}>Tahukah Kamu?</span>
                    <p style={{ color: '#5d4037' }}>{quest.funFact}</p>
                  </div>
                </div>
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
                    <div className="guide-letter">{quest.letter}</div>
                    <canvas 
                      ref={canvasRef}
                      width={300}
                      height={400}
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
              <span>{currentIdx + 1} / {quests.length}</span>
            </div>
            <button 
              className={`nav-btn-round ${currentIdx === quests.length - 1 ? 'disabled' : ''}`}
              onClick={handleNext}
            >
              <IonIcon icon={chevronForwardOutline} />
            </button>
          </div>
        </div>

        {/* Letter Selector Modal */}
        <IonModal 
          isOpen={showLetterSelector} 
          onDidDismiss={() => setShowLetterSelector(false)}
          className="letter-selector-modal"
          breakpoints={[0, 0.5]}
          initialBreakpoint={0.5}
        >
          <div className="selector-content">
            <h3>Pilih Huruf</h3>
            <div className="selector-grid">
              {quests.map((q, i) => (
                <div 
                  key={q.id} 
                  className={`selector-item ${i === currentIdx ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentIdx(i);
                    setShowLetterSelector(false);
                    setViewMode('discovery');
                  }}
                >
                  {q.letter}
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
              className="praise-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="praise-popup">
                <IonIcon icon={happyOutline} className="praise-icon-large" />
                <h2>{praiseText}</h2>
                <div className="stars-anim">⭐⭐⭐</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </IonContent>
    </IonPage>
  );
};

export default Learning;
