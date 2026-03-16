
import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { UsageProvider } from './contexts/UsageContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { Layout } from './components/layout/Layout';
import { SettingsModal } from './components/SettingsModal';
import { Login } from './components/Login';
import { auth, onAuthStateChanged, User, db } from './firebase';
import { doc, setDoc, serverTimestamp, onSnapshot, getDoc } from 'firebase/firestore';
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
import { PendingApproval } from './components/PendingApproval';
import { AdminPanel } from './pages/AdminPanel';

export type View = 'home' | 'featureGuide' | 'virtualTryOn' | 'goAesthetic' | 'goKids' | 'goFamily' | 'goModelVip' | 'goCermin' | 'goClean' | 'goSelfieVip' | 'goSetup' | 'adminPanel';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
  isApproved: boolean;
}

function AppContent() {
  const { t } = useLanguage();
  const [activeView, setActiveView] = useState<View>('home');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Initial setup for new user
        try {
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            const isAdmin = firebaseUser.email === 'ahdanhqq1@gmail.com';
            await setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              role: isAdmin ? 'admin' : 'user',
              isApproved: isAdmin ? true : false,
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp()
            });
          } else {
            await setDoc(userDocRef, { lastLogin: serverTimestamp() }, { merge: true });
          }

          // Listen for real-time profile updates (approval status)
          unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
              setUserProfile(doc.data() as UserProfile);
            }
          });
        } catch (error) {
          console.error('Error handling user profile:', error);
        }

        setUser(firebaseUser);
        setLoading(false);
      } else {
        if (unsubscribeProfile) unsubscribeProfile();
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
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

  if (userProfile && !userProfile.isApproved) {
    return <PendingApproval />;
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
        case 'adminPanel': return <AdminPanel />;
        default: return <HomePage />;
      }
  };

  return (
    <Layout activeView={activeView} setActiveView={handleNavigate} userProfile={userProfile}>
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
