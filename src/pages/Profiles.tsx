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
      // Sort or filter if needed
      setProfiles(profilesData);
      
      // Update local storage so other components (like Home) can read easily without refetching immediately
      localStorage.setItem('cerdika_users', JSON.stringify(profilesData));
    }, (error) => {
      console.error("Error fetching profiles:", error);
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
      <IonContent className="profiles-content">
        <div className="profiles-wrapper">
          <div className="header-logo">
            <div className="small-logo-badge">
              <span style={{ fontSize: '2rem' }}>🦁</span>
            </div>
            <div className="logo-label">Cerdika</div>
          </div>

          <h1 className="title">Siapa yang mau belajar?</h1>
          <p className="subtitle">Pilih profilmu di bawah ini ya!</p>

          <div className="profiles-grid">
            {profiles.map((profile) => (
              <div 
                key={profile.id} 
                className="profile-card"
                onClick={() => handleSelectProfile(profile)}
              >
                <div 
                  className="profile-avatar" 
                  style={{ backgroundColor: profile.avatarColor }}
                >
                  {profile.avatarEmoji}
                </div>
                <div className="profile-name">{profile.name}</div>
              </div>
            ))}
            
            <div className="profile-card add-card" onClick={handleAddProfile}>
              <div className="profile-avatar add-avatar">
                <IonIcon icon={addOutline} />
              </div>
              <div className="profile-name">Anak Baru</div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profiles;
