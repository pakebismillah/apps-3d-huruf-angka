import React, { useState } from 'react';
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
import { motion } from 'framer-motion';
import './Profile.css';

const Profile: React.FC = () => {
  const router = useIonRouter();
  const [showBadgeInfo, setShowBadgeInfo] = useState<any>(null);

  const badges = [
    { id: 1, name: 'Bintang Pertama', icon: sparklesOutline, color: '#FFD54F', desc: 'Kamu sudah memulai perjalananmu!', locked: false },
    { id: 2, name: 'Penerjang Cilik', icon: rocketOutline, color: '#69F0AE', desc: 'Selesaikan 5 level bermain.', locked: false },
    { id: 3, name: 'Pembaca Rajin', icon: bookOutline, color: '#64B5F6', desc: 'Baca 10 huruf tanpa salah.', locked: false },
    { id: 4, name: 'Si Ahli Angka', icon: medalOutline, color: '#E0E0E0', desc: 'Belajar semua angka 1-10.', locked: true },
    { id: 5, name: 'Penulis Cilik', icon: lockClosedOutline, color: '#E0E0E0', desc: 'Latih tulisan tanganmu.', locked: true },
    { id: 6, name: 'Sang Juara', icon: trophyOutline, color: '#E0E0E0', desc: 'Dapatkan semua bintang emas.', locked: true }
  ];

  return (
    <IonPage>
      <IonHeader className="ion-no-border profile-header">
        <IonToolbar className="profile-toolbar">
          <div className="header-brand">
            <div className="brand-logo-container">
              <img src="/assets/images/logo.png" alt="Logo" />
            </div>
            <span className="brand-name">Cerdika</span>
          </div>
          <IonButtons slot="end">
            <button className="header-btn settings">
              <IonIcon icon={settingsOutline} />
            </button>
          </IonButtons>
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
              <div className="avatar-circle">
                <img src="/assets/images/logo.png" alt="Profile Avatar" />
              </div>
              <div className="edit-avatar">
                <IonIcon icon={colorPaletteOutline} />
              </div>
            </div>
            
            <h2 className="user-greeting">Halo, Si Pintar!</h2>
            <p className="user-motivation">Kamu sudah belajar banyak hal luar biasa hari ini.</p>
            
            <div className="stats-pills">
              <div className="stat-pill level">Level 5</div>
              <div className="stat-pill xp">120 Bintang</div>
            </div>
          </motion.div>

          {/* Progress Section */}
          <div className="section-group">
            <h3 className="section-title">Progres Belajar</h3>
            
            <div className="progress-card">
              <div className="progress-header">
                <span className="label">Huruf yang Dikuasai</span>
                <span className="value">10/26</span>
              </div>
              <div className="progress-bar-bg">
                <motion.div 
                  className="progress-bar-fill yellow"
                  initial={{ width: 0 }}
                  animate={{ width: '38%' }}
                />
              </div>
              <p className="progress-hint">Ayo semangat belajar alfabet!</p>
            </div>

            <div className="progress-card">
              <div className="progress-header">
                <span className="label">Angka yang Dikuasai</span>
                <span className="value">5/10</span>
              </div>
              <div className="progress-bar-bg">
                <motion.div 
                  className="progress-bar-fill green"
                  initial={{ width: 0 }}
                  animate={{ width: '50%' }}
                />
              </div>
              <p className="progress-hint">Hebat! Kamu sudah separuh jalan.</p>
            </div>
          </div>

          {/* Badges Section */}
          <div className="section-group">
            <div className="section-header-flex">
              <h3 className="section-title">Lencana Hebat</h3>
              <button className="text-link">Lihat Semua</button>
            </div>
            
            <div className="badges-grid">
              {badges.map((badge) => (
                <div 
                  key={badge.id} 
                  className={`badge-item ${badge.locked ? 'locked' : ''}`}
                  onClick={() => setShowBadgeInfo(badge)}
                >
                  <div className="badge-icon-box" style={{ backgroundColor: badge.color }}>
                    <IonIcon icon={badge.icon} />
                  </div>
                  <span className="badge-name">{badge.locked ? 'Terkunci' : badge.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Badge Info Modal */}
        <IonModal 
          isOpen={!!showBadgeInfo} 
          onDidDismiss={() => setShowBadgeInfo(null)}
          className="badge-modal"
          breakpoints={[0, 0.4]}
          initialBreakpoint={0.4}
        >
          <div className="badge-modal-content">
            <div className="modal-handle"></div>
            {showBadgeInfo && (
              <div className="modal-inner">
                <div className="modal-icon-box" style={{ backgroundColor: showBadgeInfo.color }}>
                  <IonIcon icon={showBadgeInfo.icon} />
                </div>
                <h3>{showBadgeInfo.name}</h3>
                <p>{showBadgeInfo.desc}</p>
                {showBadgeInfo.locked ? (
                  <div className="lock-info">Teruslah belajar untuk membuka ini!</div>
                ) : (
                  <div className="earned-info">Dikuasai pada 5 Mei 2026</div>
                )}
                <IonButton expand="block" fill="clear" onClick={() => setShowBadgeInfo(null)}>Tutup</IonButton>
              </div>
            )}
          </div>
        </IonModal>
      </IonContent>

      <IonFooter className="ion-no-border home-footer">
        <div className="nav-bar">
          <div className="nav-item" onClick={() => router.push('/home')}>
            <IonIcon icon={homeOutline} />
            <span>Beranda</span>
          </div>
          <div className="nav-item" onClick={() => router.push('/learning')}>
            <IonIcon icon={libraryOutline} />
            <span>Belajar</span>
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
