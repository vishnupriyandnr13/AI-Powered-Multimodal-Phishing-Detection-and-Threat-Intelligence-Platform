/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Search, 
  AlertTriangle, 
  Rss, 
  Cpu, 
  FileText, 
  Settings, 
  User as UserIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../App';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, active }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
      active 
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
        : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-200 group-hover:scale-110", active ? "text-emerald-400" : "text-zinc-500")} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { profile, signOut } = useAuth();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/detect', icon: Search, label: 'Phishing Detection' },
    { to: '/incidents', icon: AlertTriangle, label: 'Incident Response' },
    { to: '/threat-intel', icon: Rss, label: 'Threat Intel' },
    { to: '/model-training', icon: Cpu, label: 'Model Training' },
    { to: '/compliance', icon: FileText, label: 'Compliance' },
  ];

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col sticky top-0 h-screen bg-[#09090b]/80 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3 border-b border-zinc-800/50">
          <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight leading-none">PhishGuard</h1>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">Security AI</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <div className="mb-4">
            <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Main Menu</p>
            {navItems.map((item) => (
              <NavItem 
                key={item.to} 
                to={item.to}
                icon={item.icon}
                label={item.label}
                active={location.pathname === item.to} 
              />
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-zinc-800/50 space-y-1">
          <NavItem to="/settings" icon={Settings} label="Settings" active={location.pathname === '/settings'} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-8 bg-[#09090b]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 text-sm font-medium text-zinc-400">
            <span>Cybersecurity Management</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-200 capitalize">{location.pathname.replace('/', '') || 'Dashboard'}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-zinc-200 leading-none">{profile?.fullName}</span>
                <span className="text-[10px] text-zinc-500 font-medium">{profile?.role}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};
