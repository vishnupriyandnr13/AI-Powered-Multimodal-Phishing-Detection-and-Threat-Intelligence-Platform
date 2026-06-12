/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Cpu, 
  Play, 
  History, 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Activity,
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { useToast } from '../components/ToastProvider';

const trainingHistory = [
  { epoch: 1, accuracy: 0.65, loss: 0.85 },
  { epoch: 5, accuracy: 0.78, loss: 0.52 },
  { epoch: 10, accuracy: 0.85, loss: 0.35 },
  { epoch: 15, accuracy: 0.91, loss: 0.22 },
  { epoch: 20, accuracy: 0.94, loss: 0.15 },
  { epoch: 25, accuracy: 0.96, loss: 0.08 },
];

export const ModelTraining: React.FC = () => {
  const [isTraining, setIsTraining] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const { showToast } = useToast();

  const handleStartTraining = () => {
    setIsTraining(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          showToast('Model training session completed successfully.', 'success');
          return 100;
        }
        return prev + 5;
      });
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Model Training</h2>
          <p className="text-zinc-500 text-sm mt-1">Orchestrate continuous training and optimization of phishing detection models.</p>
        </div>
        <button 
          onClick={handleStartTraining}
          disabled={isTraining}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50"
        >
          {isTraining ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          {isTraining ? `Training... ${progress}%` : 'Start New Training Session'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Training Progress Chart */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                Training Performance (v2.4.0)
              </h3>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-zinc-400">Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-zinc-400">Loss</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trainingHistory}>
                  <defs>
                    <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis 
                    dataKey="epoch" 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    label={{ value: 'Epochs', position: 'insideBottom', offset: -5, fill: '#71717a', fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="#71717a" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#18181b', 
                      borderColor: '#27272a', 
                      borderRadius: '12px',
                      color: '#f4f4f5'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorAcc)" 
                    strokeWidth={3}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="loss" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorLoss)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Training Logs */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
                <History className="w-5 h-5 text-zinc-400" />
                Training History
              </h3>
              <button className="text-emerald-400 text-sm font-bold hover:underline">View All Logs</button>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {[
                { version: 'v2.4.0', status: 'Completed', accuracy: '96.2%', time: '2 hours ago', duration: '45m' },
                { version: 'v2.3.5', status: 'Completed', accuracy: '94.8%', time: '1 day ago', duration: '42m' },
                { version: 'v2.3.0', status: 'Failed', accuracy: 'N/A', time: '3 days ago', duration: '12m' },
                { version: 'v2.2.1', status: 'Completed', accuracy: '93.5%', time: '1 week ago', duration: '38m' },
              ].map((log, i) => (
                <div key={i} className="p-6 hover:bg-zinc-800/30 transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                      log.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-100">{log.version}</h4>
                      <p className="text-xs text-zinc-500">{log.time} • Duration: {log.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Accuracy</div>
                      <div className="text-sm font-bold text-zinc-200">{log.accuracy}</div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      log.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {log.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Model Stats */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-zinc-200">Current Model Stats</h3>
            <div className="space-y-4">
              {[
                { label: 'Precision', value: '95.4%', color: 'bg-emerald-500' },
                { label: 'Recall', value: '92.8%', color: 'bg-blue-500' },
                { label: 'F1 Score', value: '94.1%', color: 'bg-purple-500' },
                { label: 'False Positive Rate', value: '1.2%', color: 'bg-rose-500' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">{stat.label}</span>
                    <span className="font-bold text-zinc-200">{stat.value}</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${stat.color} transition-all duration-1000`} 
                      style={{ width: stat.value }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Configuration */}
          <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Active Config
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Algorithm</p>
                <p className="text-sm font-bold text-zinc-200">Multimodal Transformer</p>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Dataset Size</p>
                <p className="text-sm font-bold text-zinc-200">1.2M Samples</p>
              </div>
              <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Last Deployment</p>
                <p className="text-sm font-bold text-zinc-200">Mar 10, 2026</p>
              </div>
            </div>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              Edit Configuration
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
