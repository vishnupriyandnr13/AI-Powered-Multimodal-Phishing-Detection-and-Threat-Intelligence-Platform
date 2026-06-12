/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Rss, 
  Globe, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  AlertCircle,
  Activity,
  Zap,
  Clock
} from 'lucide-react';
import { ThreatFeed } from '../types';
import { useToast } from '../components/ToastProvider';

const mockFeeds: ThreatFeed[] = [
  {
    id: 'FEED-001',
    feedName: 'Global Phishing Database',
    feedSource: 'OpenSource Intelligence',
    feedType: 'IOC',
    active: true,
    confidenceLevel: 95,
    dateLastUpdated: '10 mins ago',
    maliciousIpsCount: 1240
  },
  {
    id: 'FEED-002',
    feedName: 'Corporate Threat Intelligence',
    feedSource: 'Internal Security',
    feedType: 'TTP',
    active: true,
    confidenceLevel: 99,
    dateLastUpdated: '1 hour ago',
    maliciousIpsCount: 45
  },
  {
    id: 'FEED-003',
    feedName: 'DarkWeb Monitor',
    feedSource: 'Premium Feed',
    feedType: 'Credential Leak',
    active: true,
    confidenceLevel: 88,
    dateLastUpdated: '3 hours ago',
    maliciousIpsCount: 890
  },
  {
    id: 'FEED-004',
    feedName: 'Spamhaus Blocklist',
    feedSource: 'External Partner',
    feedType: 'IP Blocklist',
    active: false,
    confidenceLevel: 92,
    dateLastUpdated: '1 day ago',
    maliciousIpsCount: 5600
  }
];

export const ThreatIntel: React.FC = () => {
  const [isSyncing, setIsSyncing] = React.useState(false);
  const { showToast } = useToast();

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Threat feeds synchronized successfully.', 'success');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-100">Threat Intelligence</h2>
          <p className="text-zinc-500 text-sm mt-1">Real-time feeds and indicators of compromise from global security networks.</p>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-bold rounded-xl transition-all duration-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync All Feeds'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-200">Active Threat Feeds</h3>
              <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-emerald-500/20">
                3 Active
              </span>
            </div>
            <div className="divide-y divide-zinc-800/50">
              {mockFeeds.map((feed) => (
                <div key={feed.id} className="p-6 hover:bg-zinc-800/30 transition-colors group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${feed.active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                        <Rss className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">{feed.feedName}</h4>
                        <p className="text-sm text-zinc-500">{feed.feedSource}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">Confidence</div>
                      <div className="text-lg font-bold text-zinc-200">{feed.confidenceLevel}%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Activity className="w-3.5 h-3.5" />
                        <span>{feed.feedType}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <Globe className="w-3.5 h-3.5" />
                        <span>{feed.maliciousIpsCount.toLocaleString()} IPs</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-zinc-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Updated {feed.dateLastUpdated}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl space-y-6">
            <h3 className="text-lg font-bold text-zinc-200 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Live Indicators
            </h3>
            <div className="space-y-4">
              {[
                { type: 'IP', value: '192.168.1.105', risk: 'High', time: 'Just now' },
                { type: 'URL', value: 'secure-login-verify.com', risk: 'Critical', time: '1 min ago' },
                { type: 'Hash', value: 'e3b0c44298fc1c149afbf4c8', risk: 'Medium', time: '5 mins ago' },
                { type: 'IP', value: '45.12.145.88', risk: 'High', time: '12 mins ago' },
              ].map((indicator, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-[10px] font-bold text-zinc-500">
                      {indicator.type}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-zinc-200 truncate max-w-[120px]">{indicator.value}</div>
                      <div className="text-[10px] text-zinc-500">{indicator.time}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    indicator.risk === 'Critical' ? 'text-rose-500 bg-rose-500/10' :
                    indicator.risk === 'High' ? 'text-orange-500 bg-orange-500/10' :
                    'text-amber-500 bg-amber-500/10'
                  }`}>
                    {indicator.risk}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2">
              View All Indicators
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-emerald-500/5 border border-emerald-500/10 p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-emerald-400">System Status</h3>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              All threat intelligence feeds are synchronized and operating normally. 
              AI models are using the latest indicators for real-time detection.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Operational
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
