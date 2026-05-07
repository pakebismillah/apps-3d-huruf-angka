import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, useIonRouter, IonAlert } from '@ionic/react';
import { rocketOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
import { ref, push, set } from "firebase/database";
import { db } from "../firebase";
import './Register.css';

const avatars = [
  { id: 'singa', name: 'Singa', color: '#64B5F6', emoji: '🦁' },
  { id: 'panda', name: 'Panda', color: '#69F0AE', emoji: '🐼' },
  { id: 'kelinci', name: 'Kelinci', color: '#FFD54F', emoji: '🐰' },
  { id: 'kucing', name: 'Kucing', color: '#E3F2FD', emoji: '🐱' }
];

const Register: React.FC = () => {
  const router = useIonRouter();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleStartLearning = async () => {
    if (!name.trim()) {
      setAlertMessage('Tolong isi namamu dulu ya!');
      setShowAlert(true);
      return;
    }
    if (!selectedAvatar) {
      setAlertMessage('Pilih teman belajarmu dulu ya!');
      setShowAlert(true);
      return;
    }

    try {
      const studentsRef = ref(db, "students");
      const newStudentRef = push(studentsRef);
      await set(newStudentRef, {
        name: name.trim(),
        avatarId: selectedAvatar,
        avatarEmoji: avatars.find(a => a.id === selectedAvatar)?.emoji || '😊',
        avatarColor: avatars.find(a => a.id === selectedAvatar)?.color || '#e0e0e0',
        stars: 0,
        lastLetter: 'A',
        lastNumber: 1
      });

      // Set as current user and go to home
      localStorage.setItem('cerdika_currentUser', newStudentRef.key as string);
      router.push('/home', 'forward', 'replace');
    } catch (e) {
      console.error("Error adding document: ", e);
      setAlertMessage('Gagal menyambung ke internet. Pastikan koneksi baik.');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonContent className="register-content">
        <div className="register-wrapper">
          <div className="header-logo">
            <div className="small-logo-badge">
              <img src="/assets/images/logo.png" alt="Squirrel Academy" />
            </div>
            <div className="logo-label">Cerdika</div>
          </div>

          <div className="card-container">
            <h1 className="title">Kenalan Yuk!</h1>
            <p className="subtitle">Ayo buat profil belajarmu!</p>

            <div className="input-group">
              <label>Siapa namamu?</label>
              <div className="input-wrapper custom-input"> {/* Add custom-input class to wrapper if needed for styling */}
                <IonInput
                  fill="outline" // Or "solid" or "none" based on desired style
                  placeholder="Ketik namamu di sini"
                  value={name}
                  onIonChange={(e) => setName(e.detail.value!)}
                  className="ion-text-center" // Center text for better appearance
                />
              </div>
            </div>

            <div className="avatar-group">
              <label>Pilih teman belajarmu:</label>
              <div className="avatar-grid">
                {avatars.map((avatar) => (
                  <div 
                    key={avatar.id}
                    className={`avatar-item ${selectedAvatar === avatar.id ? 'selected' : ''}`}
                    style={{ backgroundColor: avatar.color }}
                    onClick={() => setSelectedAvatar(avatar.id)}
                  >
                    <span className="avatar-emoji">{avatar.emoji}</span>
                    <span className="avatar-name">{avatar.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <IonButton expand="block" className="start-button" onClick={handleStartLearning}>
            Mulai Belajar <IonIcon icon={rocketOutline} />
          </IonButton>

          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header={'Peringatan'}
            message={alertMessage}
            buttons={['OK']}
          />

          <p className="login-text" onClick={() => router.push('/profiles', 'back')} style={{cursor: 'pointer'}}>
            Kembali ke daftar teman
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
