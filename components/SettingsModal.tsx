
import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { X, ShieldCheck, Save, AlertTriangle } from './icons/LucideIcons';

export const SettingsModal: React.FC = () => {
  const { apiKey, setApiKey, isSettingsOpen, setIsSettingsOpen } = useSettings();
  const [tempKey, setTempKey] = useState(apiKey);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    setTempKey(apiKey);
  }, [apiKey, isSettingsOpen]);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey);
    setShowSaved(true);
    setTimeout(() => {
      setShowSaved(false);
      setIsSettingsOpen(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-cartoon-dark/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md border-4 border-cartoon-dark rounded-[2.5rem] shadow-cartoon-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-cartoon-yellow p-6 border-b-4 border-cartoon-dark flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl border-2 border-cartoon-dark shadow-cartoon">
              <ShieldCheck className="w-6 h-6 text-cartoon-dark" />
            </div>
            <h2 className="text-2xl font-black uppercase italic tracking-tight">API Settings</h2>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(false)}
            className="p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-black uppercase tracking-wider text-slate-500 ml-1">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Masukkan API Key Anda..."
                className="w-full px-5 py-4 bg-slate-50 border-4 border-cartoon-dark rounded-2xl font-bold focus:outline-none focus:ring-4 focus:ring-cartoon-blue/20 transition-all placeholder:text-slate-300"
              />
            </div>
            <p className="text-xs font-bold text-slate-400 leading-relaxed px-1">
              Dapatkan API Key gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cartoon-blue underline hover:text-blue-600 transition-colors">Google AI Studio</a>. Kunci Anda disimpan secara lokal di browser ini.
            </p>
          </div>

          {!apiKey && !tempKey && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-amber-700 leading-relaxed">
                API Key diperlukan untuk menjalankan fitur AI. Jika dikosongkan, aplikasi akan mencoba menggunakan kunci default (jika tersedia).
              </p>
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={showSaved}
            className={`w-full py-4 flex items-center justify-center gap-3 text-lg font-black uppercase italic tracking-wider rounded-2xl border-4 border-cartoon-dark shadow-cartoon transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-cartoon-hover ${
              showSaved 
              ? 'bg-emerald-400 text-white' 
              : 'bg-cartoon-blue text-white hover:bg-blue-600'
            }`}
          >
            {showSaved ? (
              <>Tersimpan!</>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
