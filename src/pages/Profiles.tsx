import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, useIonRouter, IonIcon } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import './Profiles.css';

interface UserProfile {
  id: string;
  name: string;
  avatarId: string;
  avatarEmoji: string;
  avatarColor: string;
  stars: number;
}

import { motion } from 'framer-motion';
import { star, bookOutline, pencilOutline, happyOutline } from 'ionicons/icons';

const Profiles: React.FC = () => {
  const router = useIonRouter();
  const [profiles, setProfiles] = useState<UserProfile[]>([]);

  useEffect(() => {
    // Load profiles from RTDB
    const studentsRef = ref(db, "students");
    const unsubscribe = onValue(studentsRef, (snapshot) => {
      const profilesData: UserProfile[] = [];
      snapshot.forEach((childSnapshot) => {
        profilesData.push({ id: childSnapshot.key, ...childSnapshot.val() } as UserProfile);
      });
      setProfiles(profilesData);
      localStorage.setItem('cerdika_users', JSON.stringify(profilesData));
    });

    return () => unsubscribe();
  }, []);

  const handleSelectProfile = (profile: UserProfile) => {
    localStorage.setItem('cerdika_currentUser', profile.id);
    router.push('/home', 'forward', 'replace');
  };

  const handleAddProfile = () => {
    router.push('/register', 'forward');
  };

  return (
    <IonPage>
      <IonContent className="profiles-content-v2">
        <div className="bg-decorations">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="decor-item decor-1">⭐</motion.div>
          <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="decor-item decor-2">🍎</motion.div>
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 5, repeat: Infinity }} className="decor-item decor-3">🎨</motion.div>
          <div className="blob-bg blob-left"></div>
          <div className="blob-bg blob-right"></div>
        </div>

        <div className="profiles-container-v2">
          <motion.div 
            className="profiles-header-v2"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="brand-badge-v2">CERDIKA</div>
            <h1 className="main-title-v2">Halo, Teman Pintar!</h1>
            <p className="sub-title-v2">Pilih siapa yang mau bertualang hari ini?</p>
          </motion.div>

          <div className="profiles-grid-v2">
            {profiles.map((profile, index) => (
              <motion.div 
                key={profile.id} 
                className="profile-card-v2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelectProfile(profile)}
              >
                <div 
                  className="profile-avatar-v2" 
                  style={{ backgroundColor: profile.avatarColor || '#64B5F6' }}
                >
                  <span className="avatar-emoji-v2">{profile.avatarEmoji}</span>
                  <div className="avatar-inner-ring"></div>
                </div>
                <div className="profile-info-v2">
                  <span className="profile-name-v2">{profile.name}</span>
                  <div className="profile-stars-v2">
                    <IonIcon icon={star} />
                    <span>{profile.stars || 0}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <motion.div 
              className="profile-card-v2 add-new-card-v2"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: profiles.length * 0.1 }}
              whileHover={{ scale: 1.05, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddProfile}
            >
              <div className="profile-avatar-v2 add-avatar-v2">
                <IonIcon icon={addOutline} />
              </div>
              <div className="profile-info-v2">
                <span className="profile-name-v2">Tambah Baru</span>
              </div>
            </motion.div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profiles;
