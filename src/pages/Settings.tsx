/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Globe, 
  Save, 
  UserPlus,
  Mail,
  Building,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../App';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export const Settings: React.FC = () => {
  const { profile, user } = useAuth();
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [department, setDepartment] = useState(profile?.department || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setMessage(null);

    try {
      await setDoc(doc(db, 'users', user.uid), {
        fullName,
        department,
        lastUpdated: serverTimestamp(),
      }, { merge: true });
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, 'users');
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Settings</h2>
        <p className="text-zinc-500 text-sm mt-1">Manage your account preferences and system configurations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1 space-y-1">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'network', label: 'Network', icon: Globe },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.id === 'profile' 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                  : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Profile Section */}
          <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                <UserPlus className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-100">Profile Information</h3>
                <p className="text-sm text-zinc-500">Update your personal details and role within the organization.</p>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="email"
                      value={profile?.email || ''}
                      disabled
                      className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-xl py-3 pl-12 pr-4 text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Department</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-zinc-200 focus:outline-none focus:border-emerald-500/50 transition-all"
                      placeholder="Security Operations"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    <input
                      type="text"
                      value={profile?.role || ''}
                      disabled
                      className="w-full bg-zinc-950/50 border border-zinc-800/50 rounded-xl py-3 pl-12 pr-4 text-zinc-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-xl text-sm font-medium ${
                  message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  {message.text}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};
