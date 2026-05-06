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
  notificationsOutline, 
  settingsOutline, 
  bookOutline, 
  calculatorOutline, 
  homeOutline, 
  libraryOutline, 
  gameControllerOutline, 
  personOutline,
  flagOutline,
  star
} from 'ionicons/icons';
import { motion } from 'framer-motion';
import './Home.css';

const Home: React.FC = () => {
  const router = useIonRouter();

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
              <IonIcon icon={notificationsOutline} />
            </button>
            <button className="header-action-btn">
              <IonIcon icon={settingsOutline} />
            </button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="home-content">
        <div className="home-wrapper">
          <div className="welcome-section">
            <div className="user-avatar-mini">
              <span>🦁</span>
            </div>
            <div className="welcome-text-group">
              <h1 className="welcome-title">Halo, Budi! 👋</h1>
              <p className="welcome-subtitle">Ayo mulai petualangan!</p>
            </div>
          </div>

          <div className="learning-cards">
            {/* Card 1: Bahasa Indonesia */}
            <div className="learning-card card-yellow" onClick={() => router.push('/learning')}>
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
            <div className="learning-card card-blue" onClick={() => router.push('/learning')}>
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
          </div>

          <div className="progress-section">
            <div className="progress-card">
              <div className="progress-header">
                <h3 className="progress-title">Progress Kamu</h3>
                <IonIcon icon={flagOutline} className="target-icon" />
              </div>
              <div className="progress-item">
                <div className="progress-info">
                  <span>Huruf Kecil</span>
                  <span className="progress-percent">75%</span>
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: '75%' }}></div>
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
            onClick={() => router.push('/learning')}
          >
            <IonIcon icon={libraryOutline} />
            <span>Belajar</span>
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
