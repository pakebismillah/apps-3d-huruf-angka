import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, useIonRouter } from '@ionic/react';
import { syncOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import './Loading.css';

const Loading: React.FC = () => {
  const router = useIonRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          router.push('/register', 'forward', 'replace');
          return 100;
        }
        return prev + 2; // increments of 2%
      });
    }, 50);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <IonPage>
      <IonContent className="loading-content">
        <div className="loading-container">
          <div className="circle circle-top-left"></div>
          <div className="circle circle-top-right"></div>
          <div className="circle circle-bottom-right"></div>

          <div className="logo-container">
            <div className="logo-badge">
              <img src="/assets/images/logo.png" alt="Squirrel Academy" className="logo-image" />
              <div className="logo-text">SQUIRREL<br />ACADEMY</div>
            </div>
            <div className="logo-shadow"></div>
          </div>

          <h1 className="brand-title">Cerdika</h1>

          <div className="progress-container">
            <div className="progress-bar-outline">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="loading-text">
              Loading... <IonIcon icon={syncOutline} className="spinner-icon" />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Loading;
