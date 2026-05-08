import React, { useEffect, useState } from 'react';
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
  bookOutline, 
  calculatorOutline, 
  star,
  logOutOutline,
  homeOutline,
  libraryOutline,
  gameControllerOutline,
  personOutline,
  lockClosedOutline,
  leafOutline,
  pawOutline
} from 'ionicons/icons';
import { motion } from 'framer-motion';
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import './Home.css';

interface UserProfile {
  id: string;
  name: string;
  avatarId: string;
  avatarEmoji: string;
  avatarColor: string;
  stars: number;
}

const Home: React.FC = () => {
  const router = useIonRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  const currentUserId = localStorage.getItem('cerdika_currentUser');

  useEffect(() => {
    if (!currentUserId) {
      router.push('/profiles', 'root', 'replace');
      return;
    }

    const userRef = ref(db, "students/" + currentUserId);
    const unsub = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        setUser({ id: snapshot.key, ...snapshot.val() } as UserProfile);
      } else {
        localStorage.removeItem('cerdika_currentUser');
        router.push('/profiles', 'root', 'replace');
      }
    });

    return () => unsub();
  }, [currentUserId, router]);



  if (!user) return null;

  return (
    <IonPage>
      <IonHeader className="ion-no-border app-header-v2">
        <IonToolbar className="app-toolbar-v2">
          <div className="header-container-v2">
            <div className="header-left">
              <motion.div 
                className="logo-circle-v2" 
                style={{backgroundColor: user.avatarColor}}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/profile')}
              >
                <span className="logo-emoji">{user.avatarEmoji}</span>
                <div className="logo-sparkle"></div>
              </motion.div>
              <div className="brand-info-v2">
                <h2 className="brand-name-v2">{user.name}</h2>
                <div className="stars-pill-v2">
                  <IonIcon icon={star} />
                  <span>{user.stars} Bintang</span>
                </div>
              </div>
            </div>
            
            <div className="header-right">
              {/* Profile button removed per user request */}
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-content">
        <div className="home-wrapper">
          <div className="welcome-section">
            <div className="user-avatar-mini" style={{backgroundColor: user.avatarColor}}>
              <span>{user.avatarEmoji}</span>
            </div>
            <div className="welcome-text-group">
              <h1 className="welcome-title">Halo, {user.name}! 👋</h1>
              <p className="welcome-subtitle">Ayo mulai petualangan!</p>
            </div>
          </div>

          <div className="learning-cards">
            {/* Card 1: Bahasa Indonesia */}
            <div className="learning-card card-yellow" onClick={() => router.push('/learning/letters')}>
              <div className="card-top">
                <span className="card-badge">Bahasa Indonesia</span>
                <div className="card-mini-icon">
                  <IonIcon icon={bookOutline} />
                </div>
              </div>
              <h2 className="card-title">Petualangan Huruf</h2>
              <p className="card-desc">Ayo kenali teman-teman huruf A sampai Z!</p>
              <div className="card-illustration illust-yellow">
                <div className="illust-content">
                  <span className="illust-text">A</span>
                  <div className="illust-center-icon">
                    <IonIcon icon={bookOutline} />
                  </div>
                  <span className="illust-text">C</span>
                </div>
              </div>
            </div>

            {/* Card 2: Matematika */}
            <div className="learning-card card-blue" onClick={() => router.push('/learning/numbers')}>
              <div className="card-top">
                <span className="card-badge">Matematika</span>
                <div className="card-mini-icon">
                  <IonIcon icon={calculatorOutline} />
                </div>
              </div>
              <h2 className="card-title">Taman Angka</h2>
              <p className="card-desc">Belajar berhitung sambil bermain di taman!</p>
              <div className="card-illustration illust-blue">
                <div className="illust-content">
                  <span className="illust-text">1</span>
                  <div className="illust-center-icon">
                    <IonIcon icon={calculatorOutline} />
                  </div>
                  <span className="illust-text">3</span>
                </div>
              </div>
            </div>

            {/* Card 3: Buah (Unlockable) */}
            <div 
              className={`learning-card card-green ${user.stars < 50 ? 'locked' : ''}`} 
              onClick={() => user.stars >= 50 && router.push('/learning/fruits')}
            >
              <div className="card-top">
                <span className="card-badge">Pengetahuan</span>
                <div className="card-mini-icon">
                  <IonIcon icon={user.stars < 50 ? lockClosedOutline : leafOutline} />
                </div>
              </div>
              <h2 className="card-title">Mengenal Buah</h2>
              {user.stars < 50 ? (
                <div className="lock-info">
                  <IonIcon icon={lockClosedOutline} />
                  <span>Butuh 50 Bintang</span>
                </div>
              ) : (
                <p className="card-desc">Mari cari tahu nama buah-buahan segar!</p>
              )}
              <div className="card-illustration illust-green">
                <div className="illust-content">
                  <span className="illust-text">🍎</span>
                  <div className="illust-center-icon">
                    <IonIcon icon={leafOutline} />
                  </div>
                  <span className="illust-text">🍌</span>
                </div>
              </div>
            </div>

            {/* Card 4: Hewan (Unlockable) */}
            <div 
              className={`learning-card card-red ${user.stars < 100 ? 'locked' : ''}`} 
              onClick={() => user.stars >= 100 && router.push('/learning/animals')}
            >
              <div className="card-top">
                <span className="card-badge">Pengetahuan</span>
                <div className="card-mini-icon">
                  <IonIcon icon={user.stars < 100 ? lockClosedOutline : pawOutline} />
                </div>
              </div>
              <h2 className="card-title">Dunia Hewan</h2>
              {user.stars < 100 ? (
                <div className="lock-info">
                  <IonIcon icon={lockClosedOutline} />
                  <span>Butuh 100 Bintang</span>
                </div>
              ) : (
                <p className="card-desc">Petualangan seru mengenal teman hewan!</p>
              )}
              <div className="card-illustration illust-red">
                <div className="illust-content">
                  <span className="illust-text">🦁</span>
                  <div className="illust-center-icon">
                    <IonIcon icon={pawOutline} />
                  </div>
                  <span className="illust-text">🦒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      <IonFooter className="ion-no-border home-footer">
        <div className="nav-bar">
          <motion.div 
            className="nav-item active" 
            initial={false}
            animate={{ y: -5 }}
            onClick={() => router.push('/home')}
          >
            <IonIcon icon={homeOutline} />
            <span>Beranda</span>
            <motion.div className="nav-indicator" layoutId="nav-indicator" />
          </motion.div>
          <motion.div 
            className="nav-item" 
            whileTap={{ scale: 0.9 }}
            onClick={() => router.push('/games')}
          >
            <IonIcon icon={gameControllerOutline} />
            <span>Bermain</span>
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

export default Home;
