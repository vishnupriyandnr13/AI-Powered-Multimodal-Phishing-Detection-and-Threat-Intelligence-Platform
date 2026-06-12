/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  ShieldAlert, 
  ShieldCheck, 
  Loader2, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  ExternalLink,
  Lock,
  Flag,
  Activity,
  Rss,
  TrendingUp,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';
import { analyzePhishing } from '../services/gemini';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../App';
import { useToast } from '../components/ToastProvider';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PhishingDetection: React.FC = () => {
  const [url, setUrl] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url && !emailContent && !image) return;

    setIsAnalyzing(true);
    setResult(null);

    try {
      const analysis = await analyzePhishing({
        url: url || undefined,
        emailBody: emailContent || undefined,
        image: image || undefined,
        communicationType: image ? 'Screenshot' : (url ? 'Website' : 'Email')
      });

      setResult(analysis);
      showToast(`Analysis complete: ${analysis.riskLevel} risk detected.`, analysis.riskLevel === 'Critical' || analysis.riskLevel === 'High' ? 'error' : 'success');

      // Save to Firestore
      if (user) {
        try {
          await addDoc(collection(db, 'incidents'), {
            incidentTitle: analysis.attackName,
            detectionConfidenceScore: analysis.confidence,
            detectionMethod: image ? 'CNN Visual Analysis' : 'Multimodal AI',
            incidentSeverity: analysis.riskLevel,
            communicationType: image ? 'Screenshot' : (url ? 'Website' : 'Email'),
            detectionTimestamp: new Date().toISOString(),
            status: 'Open',
            reportedBy: user.uid,
            aiRiskScore: analysis.confidence,
            description: analysis.findings.join('. '),
            suspiciousUrl: url || null,
            createdAt: serverTimestamp()
          });
          showToast('Incident logged in response system.', 'info');
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'incidents');
        }
      }
    } catch (error) {
      showToast('Analysis failed. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight text-zinc-100">AI Threat Analyzer</h2>
        <p className="text-zinc-500 max-w-2xl mx-auto">
          Submit suspicious URLs or email content for real-time multimodal analysis using advanced deep learning models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl space-y-6">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Website URL</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  type="url" 
                  placeholder="https://suspicious-site.com" 
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#09090b] px-2 text-zinc-600 font-bold tracking-widest">OR</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Email Content</label>
              <textarea 
                placeholder="Paste the email subject and body here..." 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-4 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all min-h-[150px] resize-none"
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#09090b] px-2 text-zinc-600 font-bold tracking-widest">OR</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1">Visual Analysis (CNN)</label>
              <div className="relative">
                {!image ? (
                  <label className="flex flex-col items-center justify-center w-full h-32 bg-zinc-950 border-2 border-dashed border-zinc-800 rounded-2xl cursor-pointer hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-zinc-500 group-hover:text-emerald-500 mb-2 transition-colors" />
                      <p className="text-xs text-zinc-500 group-hover:text-zinc-300 transition-colors">Upload screenshot for visual scanning</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                ) : (
                  <div className="relative rounded-2xl overflow-hidden border border-zinc-800">
                    <img src={image} alt="Upload preview" className="w-full h-32 object-cover opacity-50" />
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/60">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg">
                        <ImageIcon className="w-4 h-4 text-emerald-500" />
                        <span className="text-xs font-medium text-zinc-300">Image Ready</span>
                        <button 
                          type="button"
                          onClick={() => setImage(null)}
                          className="ml-2 p-1 hover:bg-zinc-800 rounded-md text-zinc-500 hover:text-rose-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit"
              disabled={isAnalyzing || (!url && !emailContent && !image)}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Threat...
                </>
              ) : (
                <>
                  <ShieldAlert className="w-5 h-5" />
                  Run Multimodal Analysis
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl min-h-[500px] flex flex-col">
          {!result && !isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center">
                <Search className="w-10 h-10 text-zinc-600" />
              </div>
              <p className="text-zinc-500 font-medium">Results will appear here after analysis.</p>
            </div>
          ) : isAnalyzing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <ShieldAlert className="absolute inset-0 m-auto w-10 h-10 text-emerald-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-zinc-200">Processing Multimodal Data</h3>
                <p className="text-zinc-500 text-sm max-w-xs">Checking URL features, analyzing content sentiment, and scanning for malicious patterns...</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-zinc-100">{result.attackName}</h3>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-zinc-500">Confidence Score:</span>
                    <span className="text-emerald-400 font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className={cn(
                  "px-4 py-2 rounded-xl font-bold uppercase tracking-widest text-xs border",
                  result.isPhishing 
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                )}>
                  {result.isPhishing ? 'Phishing Detected' : 'Legitimate'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Risk Level</p>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={cn(
                      "w-4 h-4",
                      result.riskLevel === 'Critical' ? "text-rose-500" :
                      result.riskLevel === 'High' ? "text-orange-500" :
                      "text-amber-500"
                    )} />
                    <span className="font-bold text-zinc-200">{result.riskLevel}</span>
                  </div>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    {result.isPhishing ? <XCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    <span className="font-bold text-zinc-200">{result.isPhishing ? 'Malicious' : 'Safe'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Key Findings</h4>
                <ul className="space-y-3">
                  {result.findings.map((finding: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Recommended Action</h4>
                <p className="text-sm text-zinc-300 font-medium">{result.recommendedAction}</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button className="flex-1 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  <Flag className="w-4 h-4" />
                  Flag Incident
                </button>
                <button className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" />
                  Block Source
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Section: How it Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-zinc-800/50">
        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h4 className="text-zinc-100 font-bold">Random Forest</h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Our URL classifier uses an ensemble of decision trees to analyze structural features like domain age, SSL status, and character patterns to detect malicious redirects.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <Rss className="w-6 h-6 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h4 className="text-zinc-100 font-bold">NLP (Natural Language)</h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Advanced Natural Language Processing scans email bodies for semantic urgency, deceptive sentiment, and grammatical anomalies typical of social engineering attacks.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 rounded-2xl space-y-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-purple-500" />
          </div>
          <div className="space-y-2">
            <h4 className="text-zinc-100 font-bold">CNN (Visual Analysis)</h4>
            <p className="text-zinc-500 text-xs leading-relaxed">
              Convolutional Neural Networks analyze website screenshots to detect visual spoofing, identifying pages that mimic legitimate brands with pixel-perfect precision.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
