import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, orderBy } from 'firebase/firestore';
import { CheckCircle, XCircle, User, Mail, Shield } from '../components/icons/LucideIcons';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
  isApproved: boolean;
  createdAt: any;
}

export const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => doc.data() as UserProfile);
      setUsers(usersData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleApproval = async (uid: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', uid), {
        isApproved: !currentStatus
      });
    } catch (error) {
      console.error('Error updating approval status:', error);
    }
  };

  const toggleRole = async (uid: string, currentRole: string) => {
    if (window.confirm(`Ubah role menjadi ${currentRole === 'admin' ? 'user' : 'admin'}?`)) {
      try {
        await updateDoc(doc(db, 'users', uid), {
          role: currentRole === 'admin' ? 'user' : 'admin'
        });
      } catch (error) {
        console.error('Error updating role:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center font-black text-2xl animate-pulse">
        MEMUAT DATA USER...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter text-cartoon-dark">
          Admin Panel
        </h1>
        <p className="text-cartoon-dark/60 font-bold">Kelola persetujuan dan role pengguna</p>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div 
            key={user.uid}
            className="bg-white border-4 border-cartoon-dark rounded-2xl p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full border-2 border-cartoon-dark overflow-hidden bg-cartoon-yellow">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-black text-lg text-cartoon-dark flex items-center gap-2">
                  {user.displayName || 'Anonymous'}
                  {user.role === 'admin' && (
                    <Shield className="w-4 h-4 text-cartoon-blue" />
                  )}
                </h3>
                <div className="flex items-center gap-2 text-sm font-bold text-cartoon-dark/60">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => toggleRole(user.uid, user.role)}
                className={`px-4 py-2 rounded-xl border-2 border-cartoon-dark font-black text-xs uppercase transition-all
                  ${user.role === 'admin' ? 'bg-cartoon-blue text-white' : 'bg-slate-100 text-cartoon-dark'}`}
              >
                Role: {user.role}
              </button>

              <button
                onClick={() => toggleApproval(user.uid, user.isApproved)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl border-4 border-cartoon-dark font-black text-sm uppercase transition-all shadow-[2px_2px_0px_0px_rgba(20,20,20,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none
                  ${user.isApproved 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-cartoon-red text-white hover:bg-red-600'}`}
              >
                {user.isApproved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    APPROVED
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    PENDING
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
