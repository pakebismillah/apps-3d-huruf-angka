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
  calculatorOutline
} from 'ionicons/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { ref, update } from "firebase/database";
import { db } from "../firebase";
import { letterQuests, numberQuests } from '../data/learningData';
import type { LetterQuest, NumberQuest } from '../data/learningData';
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

const Learning: React.FC = () => {
  const router = useIonRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [viewMode, setViewMode] = useState<'discovery' | 'tracing'>('discovery');
  const [contentMode, setContentMode] = useState<'huruf' | 'angka'>('huruf');
  const [showPraise, setShowPraise] = useState(false);
  const [praiseText, setPraiseText] = useState('');
  const [isDrawing, setIsDrawing] = useState(false);
  const [showLetterSelector, setShowLetterSelector] = useState(false);
  const [stars, setStars] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isHuruf = contentMode === 'huruf';
  const totalItems = isHuruf ? letterQuests.length : numberQuests.length;
  const currentLetter = isHuruf ? letterQuests[currentIdx] : null;
  const currentNumber = !isHuruf ? numberQuests[currentIdx] : null;
  const displayChar = isHuruf ? currentLetter!.letter : String(currentNumber!.number);
  const bgColor = isHuruf ? currentLetter!.bgColor : currentNumber!.bgColor;

  // Load user data
  useEffect(() => {
    const currentUserId = localStorage.getItem('cerdika_currentUser');
    if (currentUserId) {
      const storedProfiles = localStorage.getItem('cerdika_users');
      if (storedProfiles) {
        const profiles = JSON.parse(storedProfiles);
        const foundUser = profiles.find((p: any) => p.id === currentUserId);
        if (foundUser) setStars(foundUser.stars || 0);
      }
    }
  }, []);

  const addStar = async () => {
    const currentUserId = localStorage.getItem('cerdika_currentUser');
    if (currentUserId) {
      try {
        const userRef = ref(db, "students/" + currentUserId);
        const newStars = stars + 1;
        setStars(newStars);
        await update(userRef, { stars: newStars, lastItem: displayChar });
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
    if (currentIdx < totalItems - 1) {
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

  // ============ AUDIO: Huruf/Angka utama ============
  const playMainSound = useCallback(async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      if (isHuruf) {
        await playAudioFile(`/assets/audio/huruf_${displayChar.toLowerCase()}.mp3`);
      } else {
        await playAudioFile(`/assets/audio/angka_${currentNumber!.number}.mp3`);
      }
    } catch {
      // Fallback: Web Speech API
      const text = isHuruf ? displayChar : currentNumber!.name;
      await speakText(text);
    }
    setIsPlaying(false);
  }, [isHuruf, displayChar, currentNumber, isPlaying]);

  // ============ AUDIO: Kata contoh ============
  const playWord = useCallback(async (word: { text: string; audio: string }) => {
    if (playingWord) return;
    setPlayingWord(word.audio);
    setPraiseText(`Hebat! ${word.text}`);
    setShowPraise(true);
    setTimeout(() => setShowPraise(false), 1500);

    try {
      await playAudioFile(`/assets/audio/kata_${word.audio}.mp3`);
    } catch {
      const letter = currentLetter?.letter || '';
      await speakText(`${letter} untuk ${word.text}`);
    }
    setPlayingWord(null);
  }, [playingWord, currentLetter]);

  const handleFinishTracing = () => {
    addStar();
    setPraiseText("Tulisanmu Bagus Banget!");
    setShowPraise(true);
    setTimeout(() => setShowPraise(false), 2000);
  };

  const switchContent = (mode: 'huruf' | 'angka') => {
    setContentMode(mode);
    setCurrentIdx(0);
    setViewMode('discovery');
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

        {/* Tab Huruf / Angka */}
        <div className="content-mode-selector">
          <button 
            className={`content-tab ${isHuruf ? 'active' : ''}`} 
            onClick={() => switchContent('huruf')}
          >
            <IonIcon icon={textOutline} />
            <span>Huruf</span>
          </button>
          <button 
            className={`content-tab ${!isHuruf ? 'active' : ''}`} 
            onClick={() => switchContent('angka')}
          >
            <IonIcon icon={calculatorOutline} />
            <span>Angka</span>
          </button>
        </div>
        
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
                key={`discovery-${contentMode}-${currentIdx}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="discovery-view"
              >
                {/* Hero Card */}
                <div className="hero-card" style={{ borderColor: '#1c1c1c' }}>
                  <div className="hero-letter-side" style={{ backgroundColor: bgColor }}>
                    <motion.div 
                      className="letter-box"
                      whileTap={{ scale: 0.9 }}
                      onClick={playMainSound}
                    >
                      <span style={{ color: '#1c1c1c' }}>{displayChar}</span>
                      <button className={`sound-pulse ${isPlaying ? 'playing' : ''}`}>
                        <IonIcon icon={isPlaying ? volumeHighOutline : volumeMediumOutline} />
                      </button>
                    </motion.div>
                  </div>
                  <div className="hero-illust-side">
                    {isHuruf ? (
                      <span className="hero-emoji">{currentLetter!.words[0]?.emoji || '📖'}</span>
                    ) : (
                      <span className="hero-emoji">{currentNumber!.emoji}</span>
                    )}
                  </div>
                </div>

                <div className="lesson-heading">
                  <h1 className="main-title" style={{ color: '#1c1c1c' }}>
                    {isHuruf ? currentLetter!.title : `ANGKA ${currentNumber!.number}`}
                  </h1>
                  <p className="sub-title" style={{ color: '#666' }}>
                    {isHuruf ? currentLetter!.subtitle : `Mari belajar angka ${currentNumber!.name}!`}
                  </p>
                </div>

                {/* Word examples (huruf only) */}
                {isHuruf && currentLetter!.words.length > 0 && (
                  <div className="words-association-grid">
                    {currentLetter!.words.map((word, i) => (
                      <motion.div 
                        key={i} 
                        className={`word-card ${playingWord === word.audio ? 'playing' : ''}`}
                        style={{ borderLeft: `8px solid ${bgColor}` }}
                        whileHover={{ y: -5 }}
                        onClick={() => playWord(word)}
                      >
                        <span className="word-emoji">{word.emoji}</span>
                        <div className="word-text-box">
                          <span className="word-main" style={{ color: '#1c1c1c' }}>
                            <span className="highlight" style={{ color: '#d32f2f' }}>{word.text[0]}</span>
                            {word.text.slice(1)}
                          </span>
                        </div>
                        <IonIcon 
                          icon={playingWord === word.audio ? volumeHighOutline : volumeMediumOutline} 
                          className={`word-sound-icon ${playingWord === word.audio ? 'playing' : ''}`}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Number name card (angka only) */}
                {!isHuruf && (
                  <div className="number-name-card" style={{ backgroundColor: bgColor }}>
                    <span className="number-big">{currentNumber!.number}</span>
                    <span className="number-name">{currentNumber!.name}</span>
                  </div>
                )}

                {/* Fun Fact */}
                <div className="fun-fact-card">
                  <div className="fact-icon">💡</div>
                  <div className="fact-content">
                    <span className="fact-label" style={{ color: '#1c1c1c' }}>Tahukah Kamu?</span>
                    <p style={{ color: '#5d4037' }}>
                      {isHuruf ? currentLetter!.funFact : currentNumber!.funFact}
                    </p>
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
                    <div className="guide-letter">{displayChar}</div>
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
              <span>{currentIdx + 1} / {totalItems}</span>
            </div>
            <button 
              className={`nav-btn-round ${currentIdx === totalItems - 1 ? 'disabled' : ''}`}
              onClick={handleNext}
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
            <h3>{isHuruf ? 'Pilih Huruf' : 'Pilih Angka'}</h3>
            <div className="selector-grid">
              {isHuruf
                ? letterQuests.map((q, i) => (
                    <div 
                      key={q.id} 
                      className={`selector-item ${i === currentIdx ? 'active' : ''}`}
                      onClick={() => { setCurrentIdx(i); setShowLetterSelector(false); setViewMode('discovery'); }}
                    >
                      {q.letter}
                    </div>
                  ))
                : numberQuests.map((q, i) => (
                    <div 
                      key={q.id} 
                      className={`selector-item ${i === currentIdx ? 'active' : ''}`}
                      onClick={() => { setCurrentIdx(i); setShowLetterSelector(false); setViewMode('discovery'); }}
                    >
                      {q.number}
                    </div>
                  ))
              }
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
