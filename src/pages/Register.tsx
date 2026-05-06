import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, useIonRouter } from '@ionic/react';
import { rocketOutline } from 'ionicons/icons';
import { IonIcon } from '@ionic/react';
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

  const handleStartLearning = () => {
    if (!name.trim()) {
      alert('Tolong isi namamu dulu ya!');
      return;
    }
    if (!selectedAvatar) {
      alert('Pilih teman belajarmu dulu ya!');
      return;
    }
    // Navigate to Home
    router.push('/home', 'forward', 'replace');
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
              <div className="input-wrapper">
                <input 
                  type="text" 
                  placeholder="Ketik namamu di sini" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="custom-input"
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

          <button className="start-button" onClick={handleStartLearning}>
            Mulai Belajar <IonIcon icon={rocketOutline} />
          </button>

          <p className="login-text">
            Sudah punya akun? <a href="#">Masuk di sini</a>
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
