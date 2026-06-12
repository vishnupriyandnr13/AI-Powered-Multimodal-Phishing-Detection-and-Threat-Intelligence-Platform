/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Shield, 
  User, 
  ExternalLink,
  MoreHorizontal
} from 'lucide-react';
import { PhishingIncident, RiskLevel } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IncidentCardProps {
  incident: PhishingIncident;
  onClick?: () => void;
}

const riskColors: Record<RiskLevel, string> = {
  Low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  High: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  Critical: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
};

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
              riskColors[incident.incidentSeverity]
            )}>
              {incident.incidentSeverity}
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              ID: {incident.id.slice(0, 8)}
            </span>
          </div>
          <h3 className="text-lg font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
            {incident.incidentTitle}
          </h3>
        </div>
        <button className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-all">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-zinc-500" />
            <span>{incident.detectionMethod}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>{incident.detectionTimestamp}</span>
          </div>
        </div>

        <div className="h-px bg-zinc-800/50 w-full" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
              <User className="w-3 h-3 text-zinc-400" />
            </div>
            <span className="text-xs font-medium text-zinc-400">Assigned to Analyst</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              incident.status === 'Open' ? "bg-rose-500 animate-pulse" :
              incident.status === 'In Progress' ? "bg-amber-500" :
              "bg-emerald-500"
            )} />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">{incident.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
