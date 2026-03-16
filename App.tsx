
import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { UsageProvider } from './contexts/UsageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Layout } from './components/layout/Layout';
import { SettingsModal } from './components/SettingsModal';
import { Login } from './components/Login';
import { auth, onAuthStateChanged, User, db } from './firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { VirtualTryOn } from './pages/VirtualTryOn';
import HomePage from './pages/HomePage';
import GoAesthetic from './pages/GoAesthetic';
import GoKids from './pages/GoKids';
import GoFamily from './pages/GoFamily';
import { GoModelVip } from './pages/GoModelVip';
import GoCermin from './pages/GoCermin';
import GoClean from './pages/GoClean';
import { GoSelfieVip } from './pages/GoSelfieVip';
import { GoSetup } from './pages/GoSetup';
import { FeatureGuide } from './pages/FeatureGuide';

export type View = 'home' | 'featureGuide' | 'virtualTryOn' | 'goAesthetic' | 'goKids' | 'goFamily' | 'goModelVip' | 'goCermin' | 'goClean' | 'goSelfieVip' | 'goSetup';

function AppContent() {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Save user profile to Firestore
        try {
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            lastLogin: serverTimestamp(),
            createdAt: serverTimestamp()
          }, { merge: true });
        } catch (error) {
          console.error('Error saving user profile:', error);
        }
      }
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleNavigate = (view: View) => {
    setActiveView(view);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cartoon-yellow flex items-center justify-center">
        <div className="animate-bounce text-4xl font-black uppercase italic tracking-tighter text-cartoon-dark">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const renderActiveView = () => {
      switch (activeView) {
        case 'home': return <HomePage />;
        case 'featureGuide': return <FeatureGuide />;
        case 'virtualTryOn': return <VirtualTryOn />;
        case 'goModelVip': return <GoModelVip />;
        case 'goAesthetic': return <GoAesthetic />;
        case 'goKids': return <GoKids />;
        case 'goFamily': return <GoFamily />;
        case 'goCermin': return <GoCermin />;
        case 'goClean': return <GoClean />;
        case 'goSelfieVip': return <GoSelfieVip />;
        case 'goSetup': return <GoSetup />;
        default: return <HomePage />;
      }
  };

  return (
    <Layout activeView={activeView} setActiveView={handleNavigate}>
      {renderActiveView()}
      <SettingsModal />
    </Layout>
  );
}

function App() {
  return (
    <LanguageProvider>
      <UsageProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </UsageProvider>
    </LanguageProvider>
  );
}

export default App;
