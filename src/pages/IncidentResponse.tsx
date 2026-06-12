/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ArrowUpDown,
  MoreVertical,
  Loader2
} from 'lucide-react';
import { IncidentCard } from '../components/IncidentCard';
import { PhishingIncident, RiskLevel, CaseStatus } from '../types';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../App';

export const IncidentResponse: React.FC = () => {
  const [incidents, setIncidents] = useState<PhishingIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RiskLevel | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<CaseStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = collection(db, 'incidents');
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PhishingIncident[];
      setIncidents(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'incidents');
    });

    return () => unsubscribe();
  }, [user]);

  const filteredIncidents = incidents.filter(incident => {
    const matchesRisk = filter === 'All' || incident.incidentSeverity === filter;
    const matchesStatus = statusFilter === 'All' || incident.status === statusFilter;
    const matchesSearch = incident.incidentTitle.toLowerCase().includes(search.toLowerCase()) || 
                         incident.id.toLowerCase().includes(search.toLowerCase());
    return matchesRisk && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Incident Response</h2>
          <p className="text-zinc-500 text-sm mt-1">Manage and coordinate actions for detected phishing attacks.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <Plus className="w-4 h-4" />
          New Incident
        </button>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by incident name or ID..." 
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl shrink-0">
            <Filter className="w-4 h-4 text-zinc-500" />
            <select 
              className="bg-transparent text-sm text-zinc-300 focus:outline-none"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl shrink-0">
            <ShieldAlert className="w-4 h-4 text-zinc-500" />
            <select 
              className="bg-transparent text-sm text-zinc-300 focus:outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors shrink-0">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
            <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center">
              <Search className="w-8 h-8 text-zinc-600" />
            </div>
            <p className="text-zinc-500 font-medium">No incidents found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
