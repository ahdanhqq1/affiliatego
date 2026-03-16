
import React from 'react';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import { LogIn } from './icons/LucideIcons';

export const Login: React.FC = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-cartoon-yellow flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border-4 border-cartoon-dark rounded-[3rem] shadow-cartoon-lg p-10 text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-cartoon-blue rounded-[2rem] border-4 border-cartoon-dark shadow-cartoon mx-auto flex items-center justify-center">
            <LogIn className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black uppercase italic tracking-tighter text-cartoon-dark">
            Go-Visual VIP
          </h1>
          <p className="text-lg font-bold text-slate-500 leading-tight">
            Akses eksklusif untuk pembuatan konten visual AI profesional.
          </p>
        </div>

        <div className="bg-slate-50 p-6 border-4 border-cartoon-dark rounded-3xl space-y-4">
          <p className="text-sm font-black uppercase tracking-widest text-slate-400">
            Silakan Masuk
          </p>
          <button
            onClick={handleLogin}
            className="w-full py-4 bg-white hover:bg-slate-50 text-cartoon-dark font-black uppercase italic tracking-wider rounded-2xl border-4 border-cartoon-dark shadow-cartoon transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-cartoon-hover flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
            Masuk dengan Google
          </button>
        </div>

        <p className="text-xs font-bold text-slate-400">
          Dengan masuk, Anda menyetujui syarat dan ketentuan penggunaan Go-Visual VIP.
        </p>
      </div>
    </div>
  );
};
