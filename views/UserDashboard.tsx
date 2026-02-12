import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Activity, ShieldCheck, Mic, Database, Hash, BarChart, Clock, Fingerprint } from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const mockEarningsData = [
  { day: 'Mon', amount: 0.12 }, { day: 'Tue', amount: 0.45 }, { day: 'Wed', amount: 0.38 },
  { day: 'Thu', amount: 0.92 }, { day: 'Fri', amount: 1.30 }, { day: 'Sat', amount: 0.88 }, { day: 'Sun', amount: 1.23 },
];

const UserDashboard: React.FC<{ profile: UserProfile | null }> = ({ profile }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'listening' | 'processing'>('idle');

  if (!profile) return null;

  const toggleSync = () => {
    if (isSyncing) {
      setIsSyncing(false);
      setSyncStatus('idle');
    } else {
      setIsSyncing(true);
      setSyncStatus('listening');
      setTimeout(() => setSyncStatus('processing'), 3000);
      setTimeout(() => {
        setIsSyncing(false);
        setSyncStatus('idle');
      }, 6000);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6 animate-in fade-in duration-500">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-500">
                <Hash size={18} />
            </div>
            <div>
                <h1 className="text-xl font-bold tracking-tight text-white leading-none">COMMAND CENTER</h1>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-sm"></span>
                    Node Active
                    <span className="text-zinc-700">|</span>
                    {profile.id}
                </div>
            </div>
        </div>
        
        <button 
          onClick={toggleSync}
          className={`px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-widest flex items-center gap-3 transition-all border ${isSyncing ? 'bg-red-900/10 text-red-400 border-red-900/30' : 'bg-zinc-900 text-zinc-300 border-white/10 hover:bg-zinc-800'}`}
        >
          {isSyncing ? (
            <> <div className="animate-pulse w-2 h-2 bg-red-500 rounded-full"></div> {syncStatus === 'listening' ? 'CAPTURING AUDIO...' : 'ENCODING...'} </>
          ) : (
            <> <Mic size={14} /> VOICE_SYNC_INIT </>
          )}
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left Column: Identity Card */}
        <div className="lg:col-span-3 space-y-6">
          <div className="tech-panel p-1 rounded-sm">
            <div className="bg-zinc-950 p-6 rounded-sm relative overflow-hidden">
                {/* ID Card Header */}
                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                    <Fingerprint size={24} className="text-zinc-700" />
                    <div className="text-[9px] font-mono text-zinc-600 uppercase text-right">
                        Digital Entity<br/>Class A
                    </div>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 bg-zinc-900 border border-white/10 rounded-sm overflow-hidden mb-4 relative group">
                        <img 
                            src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name}`} 
                            className="w-full h-full object-cover opacity-90 grayscale group-hover:grayscale-0 transition-all duration-500" 
                            alt="Twin" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-2 left-2 text-[9px] font-mono text-white/70">IMG_REF_092</div>
                    </div>
                    <h2 className="text-lg font-bold text-white mb-0.5">{profile.name}</h2>
                    <div className="text-xs font-mono text-zinc-500 uppercase">{profile.occupation}</div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono text-zinc-500 uppercase">
                            <span>Maturity</span>
                            <span className="text-blue-400">{profile.twinMaturity}%</span>
                        </div>
                        <div className="w-full bg-zinc-900 h-1">
                            <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${profile.twinMaturity}%` }}></div>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 flex justify-center">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 bg-emerald-900/10 px-3 py-1.5 rounded-sm border border-emerald-900/20 uppercase tracking-widest">
                            <ShieldCheck size={10} /> Verified On-Chain
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>

        {/* Center/Right: Data */}
        <div className="lg:col-span-9 grid gap-6 grid-rows-[auto_1fr]">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Yield Balance", val: `$${profile.earnings.toFixed(2)}`, sub: "+12.5% this week", icon: Database },
                    { label: "Query Requests", val: "1,402", sub: "Enterprise Sources", icon: Activity },
                    { label: "Data Fidelity", val: "94.2%", sub: "High Confidence", icon: ShieldCheck }
                ].map((stat, i) => (
                    <div key={i} className="tech-panel p-5 rounded-sm flex flex-col justify-between">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                            <stat.icon size={14} className="text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white tracking-tight">{stat.val}</div>
                            <div className="text-[10px] text-zinc-500 mt-1">{stat.sub}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Chart */}
                <div className="lg:col-span-2 tech-panel p-6 rounded-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2 uppercase tracking-wide">
                            <BarChart size={14} className="text-blue-500" /> Revenue Stream
                        </h3>
                        <div className="flex gap-1 text-[9px] font-mono">
                            <button className="px-2 py-1 bg-zinc-800 text-white rounded-sm">7D</button>
                            <button className="px-2 py-1 bg-transparent text-zinc-600 hover:text-zinc-400">30D</button>
                        </div>
                    </div>
                    <div className="flex-grow min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockEarningsData}>
                            <defs>
                                <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#27272a" />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#52525b', fontSize: 10, fontFamily: 'monospace'}} dy={10} />
                            <YAxis hide />
                            <Tooltip 
                                contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '0px', fontSize: '11px', color: '#fff'}} 
                                itemStyle={{color: '#fff'}}
                                formatter={(value) => [`$${value}`, 'Yield']}
                            />
                            <Area type="step" dataKey="amount" stroke="#2563eb" strokeWidth={1.5} fillOpacity={1} fill="url(#colorYield)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Parameters */}
                <div className="tech-panel p-6 rounded-sm">
                     <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2 uppercase tracking-wide mb-6">
                        <Clock size={14} className="text-blue-500" /> Cognitive State
                    </h3>
                    <div className="space-y-4">
                         <div className="group">
                             <div className="text-[9px] font-mono text-zinc-500 uppercase mb-1 flex justify-between">
                                <span>Psychographics</span>
                                <span className="text-zinc-700 opacity-0 group-hover:opacity-100 transition">EDIT</span>
                             </div>
                             <div className="p-3 bg-zinc-950 border border-white/5 rounded-sm text-xs text-zinc-300 leading-relaxed font-mono">
                                {profile.personality}
                             </div>
                         </div>
                         <div className="group">
                             <div className="text-[9px] font-mono text-zinc-500 uppercase mb-1">
                                Value Logic
                             </div>
                             <div className="p-3 bg-zinc-950 border border-white/5 rounded-sm text-xs text-zinc-300 leading-relaxed font-mono">
                                {profile.values}
                             </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;