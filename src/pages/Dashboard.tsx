/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  Activity, 
  Rss,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { PhishingIncident } from '../types';
import { Link } from 'react-router-dom';

const data = [
  { name: 'Mon', incidents: 12, risk: 45 },
  { name: 'Tue', incidents: 19, risk: 52 },
  { name: 'Wed', incidents: 15, risk: 48 },
  { name: 'Thu', incidents: 22, risk: 61 },
  { name: 'Fri', incidents: 30, risk: 75 },
  { name: 'Sat', incidents: 10, risk: 38 },
  { name: 'Sun', incidents: 8, risk: 32 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }: any) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className={cn("p-3 rounded-xl", color)}>
        <Icon className="w-6 h-6" />
      </div>
      <div className={cn("flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full", trend === 'up' ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400")}>
        {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {trendValue}%
      </div>
    </div>
    <p className="text-zinc-500 text-sm font-medium mb-1">{title}</p>
    <h3 className="text-3xl font-bold tracking-tight text-zinc-100">{value}</h3>
  </div>
);

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

export const Dashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<PhishingIncident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'incidents'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as PhishingIncident[];
      setIncidents(docs);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'incidents');
    });
    return () => unsubscribe();
  }, []);

  const riskDistribution = [
    { name: 'Low', value: incidents.filter(i => i.incidentSeverity === 'Low').length, color: '#10b981' },
    { name: 'Medium', value: incidents.filter(i => i.incidentSeverity === 'Medium').length, color: '#f59e0b' },
    { name: 'High', value: incidents.filter(i => i.incidentSeverity === 'High').length, color: '#f43f5e' },
    { name: 'Critical', value: incidents.filter(i => i.incidentSeverity === 'Critical').length, color: '#881337' },
  ];

  const totalValue = riskDistribution.reduce((acc, curr) => acc + curr.value, 0) || 1;
  const riskPercentages = riskDistribution.map(r => ({
    ...r,
    percentage: Math.round((r.value / totalValue) * 100)
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Security Overview</h2>
          <p className="text-zinc-500 text-sm mt-1">Real-time monitoring and analysis of phishing threats across the network.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          Generate Report
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Incidents" 
          value={incidents.length} 
          icon={AlertTriangle} 
          trend="up" 
          trendValue="12" 
          color="bg-amber-500/10 text-amber-500 border border-amber-500/20" 
        />
        <StatCard 
          title="Threats Blocked" 
          value={Math.floor(incidents.length * 0.6)} 
          icon={ShieldCheck} 
          trend="up" 
          trendValue="8" 
          color="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
        />
        <StatCard 
          title="Model Accuracy" 
          value="94.8%" 
          icon={Activity} 
          trend="up" 
          trendValue="2" 
          color="bg-blue-500/10 text-blue-500 border border-blue-500/20" 
        />
        <StatCard 
          title="Active Feeds" 
          value="24" 
          icon={Rss} 
          trend="down" 
          trendValue="4" 
          color="bg-purple-500/10 text-purple-500 border border-purple-500/20" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-zinc-200 mb-8 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            Phishing Trends (7 Days)
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `${value}`} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderColor: '#27272a', 
                    borderRadius: '12px',
                    color: '#f4f4f5'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#09090b' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="#f59e0b" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#09090b' }} 
                  activeDot={{ r: 6, strokeWidth: 0 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl flex flex-col">
          <h3 className="text-lg font-bold text-zinc-200 mb-6 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            AI Technology Stack
          </h3>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-zinc-500">NLP Engine</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Semantic analysis of email content using transformer-based NLP to detect deceptive intent.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-zinc-500">Random Forest</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Ensemble learning for URL feature classification and domain reputation scoring.
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                <span className="text-zinc-500">CNN Vision</span>
                <span className="text-emerald-400">Active</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Visual similarity detection using CNNs to identify brand impersonation in web layouts.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <Link to="/detection" className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              Run New Analysis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-lg font-bold text-zinc-200">Recent Phishing Incidents</h3>
            <Link to="/incidents" className="text-emerald-400 text-sm font-bold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 flex justify-center">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="text-zinc-500 text-xs uppercase tracking-widest font-bold border-b border-zinc-800/50">
                    <th className="px-6 py-4">Incident Name</th>
                    <th className="px-6 py-4">Risk Level</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4">Confidence</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {incidents.map((incident, i) => (
                    <tr key={incident.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-zinc-200 group-hover:text-emerald-400 transition-colors">{incident.incidentTitle}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                          incident.incidentSeverity === 'Critical' ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" :
                          incident.incidentSeverity === 'High' ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" :
                          "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        )}>
                          {incident.incidentSeverity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-400 text-sm font-medium">{incident.detectionMethod}</td>
                      <td className="px-6 py-4 text-zinc-200 font-bold text-sm">{(incident.detectionConfidenceScore * 100).toFixed(1)}%</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-1.5 h-1.5 rounded-full", incident.status === 'Open' ? "bg-emerald-500 animate-pulse" : "bg-zinc-500")} />
                          <span className="text-zinc-300 text-sm font-medium">{incident.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-sm">{incident.detectionTimestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-zinc-200 mb-8 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Risk Distribution
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskPercentages} layout="vertical">
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  stroke="#71717a" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    borderColor: '#27272a', 
                    borderRadius: '12px',
                    color: '#f4f4f5'
                  }} 
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]} barSize={20}>
                  {riskPercentages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {riskPercentages.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-400">{item.name}</span>
                </div>
                <span className="font-bold text-zinc-200">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
