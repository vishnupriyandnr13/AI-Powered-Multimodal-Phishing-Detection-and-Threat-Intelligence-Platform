/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertCircle, 
  Download, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const complianceData = [
  { name: 'GDPR', status: 'Compliant', score: 98, color: '#10b981' },
  { name: 'SOC2', status: 'Compliant', score: 95, color: '#10b981' },
  { name: 'HIPAA', status: 'In Review', score: 82, color: '#f59e0b' },
  { name: 'ISO 27001', status: 'Compliant', score: 92, color: '#10b981' },
];

const monthlyCompliance = [
  { month: 'Jan', score: 85 },
  { month: 'Feb', score: 88 },
  { month: 'Mar', score: 92 },
  { month: 'Apr', score: 90 },
  { month: 'May', score: 94 },
  { month: 'Jun', score: 96 },
];

export const Compliance: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Compliance Reporting</h2>
          <p className="text-zinc-500 text-sm mt-1">Monitor and export regulatory compliance reports for your organization.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
          <Download className="w-4 h-4" />
          Export All Reports
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compliance Overview */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceData.map((item) => (
              <div key={item.name} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-4 hover:border-zinc-700 transition-all group">
                <div className="flex items-start justify-between">
                  <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center">
                    <ShieldCheck className={`w-6 h-6 ${item.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                    item.status === 'Compliant' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-zinc-100">{item.name}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-zinc-500 text-sm">Compliance Score</span>
                    <span className="text-zinc-200 font-bold">{item.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-1000" 
                      style={{ width: `${item.score}%` }} 
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-zinc-200 mb-8 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              Compliance Score Trend
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCompliance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="month" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px', color: '#f4f4f5' }} 
                  />
                  <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Audits */}
        <div className="space-y-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
              <Clock className="w-5 h-5 text-zinc-400" />
              Recent Audits
            </h3>
            <div className="space-y-4">
              {[
                { title: 'Quarterly Security Review', date: 'Mar 05, 2026', status: 'Passed' },
                { title: 'Internal Data Audit', date: 'Feb 20, 2026', status: 'Passed' },
                { title: 'External Penetration Test', date: 'Jan 15, 2026', status: 'Failed' },
                { title: 'GDPR Compliance Check', date: 'Dec 10, 2025', status: 'Passed' },
              ].map((audit, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                  <div>
                    <p className="font-bold text-zinc-200 text-sm">{audit.title}</p>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{audit.date}</p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                    audit.status === 'Passed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {audit.status === 'Passed' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              Schedule New Audit
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Risk Assessment
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-zinc-200">Data Privacy</span>
                  <span className="text-xs font-bold text-emerald-400">Low Risk</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[20%]" />
                </div>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-zinc-200">Network Security</span>
                  <span className="text-xs font-bold text-amber-400">Medium Risk</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[55%]" />
                </div>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-zinc-200">Access Control</span>
                  <span className="text-xs font-bold text-emerald-400">Low Risk</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[15%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
