import React, { useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Loading from './pages/Loading';
import Register from './pages/Register';
import Home from './pages/Home';
import Learning from './pages/Learning';
import Games from './pages/Games';
import Profile from './pages/Profile';
import Profiles from './pages/Profiles';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    // Force show loading on refresh or first visit by checking sessionStorage
    const hasLoaded = sessionStorage.getItem('cerdika_loaded');
    if (!hasLoaded && window.location.pathname !== '/loading') {
      window.location.replace('/loading');
    }
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/loading">
            <Loading />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/learning/:category">
            <Learning />
          </Route>
          <Route exact path="/games">
            <Games />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/profiles">
            <Profiles />
          </Route>
          <Route exact path="/">
            <Redirect to="/loading" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
