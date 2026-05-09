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
          sessionStorage.setItem('cerdika_loaded', 'true');
          router.push('/profiles', 'forward', 'replace');
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <IonPage>
      <IonContent className="loading-content-v2">
        <div className="loading-screen-v2">
          {/* Corner Blobs */}
          <div className="corner-blob top-left"></div>
          <div className="corner-blob top-right"></div>
          <div className="corner-blob bottom-right"></div>

          <div className="loading-main-v2">
            {/* Logo Area (Empty for now) */}
            <div className="logo-container-v2">
              <img src="/assets/images/logo.png" alt="Cerdika Logo" className="loading-logo-img" />
            </div>

            {/* Progress Section */}
            <div className="loading-progress-v2">
              <div className="bar-container-v2">
                <div
                  className="bar-fill-v2"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="loading-label-v2">Loading...</p>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Loading;
