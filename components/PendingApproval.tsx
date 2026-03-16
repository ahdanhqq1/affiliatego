import React from 'react';
import { LogOut, MessageCircle } from './icons/LucideIcons';
import { auth, signOut } from '../firebase';

export const PendingApproval: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleChatAdmin = () => {
    const phoneNumber = '62882002152004';
    const message = encodeURIComponent('Halo Admin, saya sudah daftar di aplikasi. Mohon di approve ya.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-cartoon-yellow flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-4 border-cartoon-dark rounded-3xl p-8 shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] text-center">
        <div className="w-24 h-24 bg-cartoon-blue border-4 border-cartoon-dark rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">⏳</span>
        </div>
        
        <h1 className="text-3xl font-black uppercase italic tracking-tighter text-cartoon-dark mb-4">
          Menunggu Persetujuan
        </h1>
        
        <p className="text-lg font-bold text-cartoon-dark/70 mb-8">
          Akun Anda sedang dalam antrean untuk disetujui oleh Admin. Silakan hubungi Admin untuk mempercepat proses.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleChatAdmin}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 px-6 rounded-2xl border-4 border-cartoon-dark shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-6 h-6" />
            CHAT ADMIN (WA)
          </button>
          
          <button
            onClick={handleLogout}
            className="w-full bg-cartoon-red hover:bg-red-600 text-white font-black py-4 px-6 rounded-2xl border-4 border-cartoon-dark shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
          >
            <LogOut className="w-6 h-6" />
            LOGOUT
          </button>
        </div>
      </div>
    </div>
  );
};
