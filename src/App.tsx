/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { PhishingDetection } from './pages/PhishingDetection';
import { IncidentResponse } from './pages/IncidentResponse';
import { ThreatIntel } from './pages/ThreatIntel';
import { ModelTraining } from './pages/ModelTraining';
import { Compliance } from './pages/Compliance';
import { Settings } from './pages/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastProvider } from './components/ToastProvider';
import { UserProfile } from './types';

interface AuthContextType {
  user: { uid: string; email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provide a mock user for the app to function without real sign-in
  const mockProfile: UserProfile = {
    uid: 'guest-user',
    fullName: 'Security Analyst',
    email: 'analyst@phishguard.ai',
    role: 'admin',
    department: 'Security Operations',
  };

  const [user] = useState({ uid: 'guest-user', email: 'analyst@phishguard.ai' });
  const [profile] = useState<UserProfile>(mockProfile);
  const [loading] = useState(false);

  const signIn = async () => {};
  const signOut = async () => {};

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/detect" element={<PhishingDetection />} />
                <Route path="/incidents" element={<IncidentResponse />} />
                <Route path="/threat-intel" element={<ThreatIntel />} />
                <Route path="/model-training" element={<ModelTraining />} />
                <Route path="/compliance" element={<Compliance />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

