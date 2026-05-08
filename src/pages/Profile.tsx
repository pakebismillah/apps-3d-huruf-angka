import React, { useState, useEffect } from 'react';
import { 
  IonContent, 
  IonPage, 
  IonHeader, 
  IonToolbar, 
  IonButtons, 
  IonIcon,
  IonFooter,
  useIonRouter,
  IonModal,
  IonButton
} from '@ionic/react';
import { 
  settingsOutline, 
  star, 
  trophyOutline, 
  medalOutline, 
  bookOutline, 
  colorPaletteOutline,
  homeOutline,
  libraryOutline,
  gameControllerOutline,
  personOutline,
  lockClosedOutline,
  rocketOutline,
  sparklesOutline
} from 'ionicons/icons';
import { ref, onValue, update } from "firebase/database";
import { db } from "../firebase";
import { motion } from 'framer-motion';
import './Profile.css';

const Profile: React.FC = () => {
  const router = useIonRouter();
  const [showBadgeInfo, setShowBadgeInfo] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const avatars = ['🐱', '🦁', '🐶', '🐰', '🐼', '🐯', '🐨', '🐸', '🐷', '🐵', '🦊', '🦒'];

  const updateAvatar = async (emoji: string) => {
    const currentUserId = localStorage.getItem('cerdika_currentUser');
    if (currentUserId) {
      const userRef = ref(db, "students/" + currentUserId);
      await update(userRef, { avatarEmoji: emoji });
      setShowAvatarSelector(false);
    }
  };

  useEffect(() => {
    const currentUserId = localStorage.getItem('cerdika_currentUser');
    if (currentUserId) {
      const userRef = ref(db, "students/" + currentUserId);
      const unsub = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          setUser({ id: snapshot.key, ...snapshot.val() });
        }
      });
      return () => unsub();
    }
  }, []);

  const completedQuests = user?.completedQuests || [];
  const letterCount = completedQuests.filter((q: string) => q.startsWith('letters_')).length;
  const numberCount = completedQuests.filter((q: string) => q.startsWith('numbers_')).length;
  const level = Math.floor((user?.stars || 0) / 50) + 1;

  const badges = [
    { id: 1, name: 'Bintang Pertama', icon: sparklesOutline, color: '#FFD54F', desc: 'Kamu sudah memulai perjalananmu!', locked: (user?.stars || 0) < 5 },
    { id: 2, name: 'Penerjang Cilik', icon: rocketOutline, color: '#69F0AE', desc: 'Dapatkan 100 bintang bermain.', locked: (user?.stars || 0) < 100 },
    { id: 3, name: 'Pembaca Rajin', icon: bookOutline, color: '#64B5F6', desc: 'Selesaikan 10 huruf alfabet.', locked: letterCount < 10 },
    { id: 4, name: 'Si Ahli Angka', icon: medalOutline, color: '#FFD54F', desc: 'Belajar 10 angka pertama.', locked: numberCount < 10 },
    { id: 5, name: 'Penulis Cilik', icon: sparklesOutline, color: '#FFD54F', desc: 'Selesaikan 20 tugas menulis.', locked: completedQuests.length < 20 },
    { id: 6, name: 'Sang Juara', icon: trophyOutline, color: '#FFD54F', desc: 'Kumpulkan 500 bintang emas.', locked: (user?.stars || 0) < 500 }
  ];

  // ... (JSX changes below)

  const handleLogout = () => {
    localStorage.removeItem('cerdika_currentUser');
    router.push('/profiles', 'root', 'replace'); // Confirming '/profiles' is correct for account switching
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border app-header-v2">
        <IonToolbar className="app-toolbar-v2">
          <div className="header-container-v2">
            <div className="header-left">
              <div className="logo-circle-v2" style={{backgroundColor: user?.avatarColor || '#64B5F6'}}>
                <span className="logo-emoji">{user?.avatarEmoji || '👤'}</span>
              </div>
              <div className="brand-info-v2">
                <h2 className="brand-name-v2">{user?.name || 'Profil'}</h2>
                <div className="stars-pill-v2">
                  <IonIcon icon={star} />
                  <span>{user?.stars || 0} Bintang</span>
                </div>
              </div>
            </div>
            
            <div className="header-right">
              <motion.button 
                className="header-logout-btn-v2"
                whileTap={{ scale: 0.9 }}
                onClick={handleLogout}
              >
                 Keluar
              </motion.button>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="profile-content">
        <div className="profile-wrapper">
          <h1 className="page-title">Profil Kamu</h1>

          {/* Main Profile Card */}
          <motion.div 
            className="main-profile-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >

            <div className="avatar-section">
              <div className="avatar-circle" style={{ backgroundColor: user?.avatarColor || '#fff9c4' }}>
                <span style={{ fontSize: '4rem' }}>{user?.avatarEmoji || '👤'}</span>
              </div>
              <motion.div 
                className="edit-avatar" 
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAvatarSelector(true)}
              >
                <IonIcon icon={colorPaletteOutline} />
              </motion.div>
            </div>
            
            <h2 className="user-greeting">Halo, {user?.name || 'Si Pintar'}!</h2>
            <p className="user-motivation">Kamu sudah belajar banyak hal luar biasa hari ini.</p>
            
            <div className="stats-pills">
              <div className="stat-pill level">Level {level}</div>
              <div className="stat-pill xp">{user?.stars || 0} Bintang</div>
            </div>
          </motion.div>

          {/* Progress Section */}
          <div className="section-group">
            <h3 className="section-title">Aktivitas Terakhir</h3>
            
            <motion.div 
              className="progress-card actionable"
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (user?.lastLetter) {
                  router.push(`/learning/letters?id=${user.lastLetter}`);
                } else {
                  router.push('/learning/letters');
                }
              }}
            >
              <div className="progress-header">
                <span className="label">Huruf Terakhir</span>
                <span className="value-highlight">{user?.lastLetter || 'Kosong'}</span>
              </div>
              <div className="progress-bar-bg">
                <motion.div 
                  className="progress-bar-fill yellow"
                  initial={{ width: 0 }}
                  animate={{ width: `${(letterCount / 26) * 100}%` }}
                />
              </div>
              <p className="progress-hint">
                {letterCount > 0 ? `Sudah mempelajari ${letterCount} huruf!` : 'Ayo mulai belajar huruf pertama!'}
              </p>
            </motion.div>

            <motion.div 
              className="progress-card actionable"
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (user?.lastNumber) {
                  router.push(`/learning/numbers?id=${user.lastNumber}`);
                } else {
                  router.push('/learning/numbers');
                }
              }}
            >
              <div className="progress-header">
                <span className="label">Angka Terakhir</span>
                <span className="value-highlight">{user?.lastNumber || 'Kosong'}</span>
              </div>
              <div className="progress-bar-bg">
                <motion.div 
                  className="progress-bar-fill green"
                  initial={{ width: 0 }}
                  animate={{ width: `${(numberCount / 50) * 100}%` }}
                />
              </div>
              <p className="progress-hint">
                {numberCount > 0 ? `Sudah mempelajari ${numberCount} angka!` : 'Ayo mulai berhitung hari ini!'}
              </p>
            </motion.div>
          </div>

          {/* Logout Button in Content Area */}
          <div className="logout-section">
            <button className="full-logout-btn" onClick={handleLogout}>
              <IonIcon icon={personOutline} style={{ marginRight: '8px' }} />
              Keluar dari Profil
            </button>
            <p className="logout-hint">Sampai jumpa lagi, Si Pintar!</p>
          </div>
        </div>
        {/* Avatar Selector Modal */}
        <IonModal 
          isOpen={showAvatarSelector} 
          onDidDismiss={() => setShowAvatarSelector(false)}
          className="avatar-modal"
          breakpoints={[0, 0.4]}
          initialBreakpoint={0.4}
        >
          <div className="modal-content-v2">
            <div className="modal-handle-v2"></div>
            <div className="modal-inner-v2">
              <h3 className="modal-title-v2">Pilih Karaktermu</h3>
              <div className="avatar-grid-v2">
                {avatars.map((emoji) => (
                  <motion.div 
                    key={emoji}
                    className={`avatar-option-v2 ${user?.avatarEmoji === emoji ? 'active' : ''}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => updateAvatar(emoji)}
                  >
                    <span className="emoji-display">{emoji}</span>
                  </motion.div>
                ))}
              </div>
              <IonButton expand="block" fill="clear" onClick={() => setShowAvatarSelector(false)} className="modal-close-btn">Tutup</IonButton>
            </div>
          </div>
        </IonModal>
      </IonContent>

      <IonFooter className="ion-no-border home-footer">
        <div className="nav-bar">
          <div className="nav-item" onClick={() => router.push('/home')}>
            <IonIcon icon={homeOutline} />
            <span>Beranda</span>
          </div>
          <div className="nav-item" onClick={() => router.push('/games')}>
            <IonIcon icon={gameControllerOutline} />
            <span>Bermain</span>
          </div>
          <div className="nav-item active">
            <IonIcon icon={personOutline} />
            <span>Profil</span>
          </div>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default Profile;
