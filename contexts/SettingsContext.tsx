
import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKeyState(savedKey);
      setIsFirstVisit(false);
    } else {
      // Force open if no key
      setIsSettingsOpen(true);
    }
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('gemini_api_key', key);
    if (key) setIsFirstVisit(false);
  };

  return (
    <SettingsContext.Provider value={{ apiKey, setApiKey, isSettingsOpen, setIsSettingsOpen }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
