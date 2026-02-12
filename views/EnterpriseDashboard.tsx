import React from 'react';
import { Plus, BarChart3, Users2, Clock, Play, FileText, ChevronRight, Zap, Target, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const EnterpriseDashboard: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-8 animate-in fade-in duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">SIMULATION SANDBOX</h1>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">DEPLOY_HYPOTHESIS // COGNITIVE_POOLS</p>
        </div>
        <Link to="/research" className="px-6 py-3 bg-blue-600 text-white font-bold rounded-sm hover:bg-blue-500 transition flex items-center gap-2 text-xs uppercase tracking-widest">
          <Plus size={14} /> New Study
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Network Nodes', value: '1.4M', icon: Users2 },
          { label: 'Avg Fidelity', value: '94.2%', icon: Target },
          { label: 'Compute Saved', value: '1,280h', icon: Zap },
          { label: 'Active Jobs', value: '14', icon: Play },
        ].map((m, i) => (
          <div key={i} className="tech-panel p-6 rounded-sm bg-zinc-900/40">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-1.5 rounded-sm bg-zinc-800 text-zinc-400`}>
                  <m.icon size={16} />
                </div>
                {i === 3 && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
            </div>
            <div className="text-3xl font-bold text-white mb-1 tracking-tight">{m.value}</div>
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="tech-panel rounded-sm overflow-hidden bg-zinc-900/20">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-zinc-950/50">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Active Simulations</h3>
          <div className="flex items-center gap-4">
              <Search size={14} className="text-zinc-600" />
              <div className="flex text-[10px] font-bold border border-white/10 rounded-sm overflow-hidden font-mono">
                <button className="px-3 py-1.5 bg-zinc-800 text-white">RUNNING</button>
                <button className="px-3 py-1.5 bg-transparent text-zinc-500 hover:bg-zinc-900 transition">ARCHIVED</button>
              </div>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          <div className="grid grid-cols-12 px-6 py-3 text-[9px] font-mono text-zinc-600 uppercase tracking-widest bg-zinc-950/30">
              <div className="col-span-5">Simulation Name</div>
              <div className="col-span-3">Target Audience</div>
              <div className="col-span-2">Sample Size</div>
              <div className="col-span-2 text-right">Status</div>
          </div>
          {[
            { title: 'Gen-Z Sustainable Fashion Logic', industry: 'Retail', audience: 'F, 18-24', status: 'Active', twins: 500 },
            { title: 'DeFi User Friction Study', industry: 'FinTech', audience: 'Global, 25-45', status: 'Queued', twins: 1200 },
            { title: 'RPG Gacha Monetization Test', industry: 'Gaming', audience: 'M, Core Gamer', status: 'Done', twins: 2500 },
          ].map((p, i) => (
            <div key={i} className="px-6 py-4 hover:bg-zinc-800/20 transition grid grid-cols-12 items-center group">
              <div className="col-span-5 flex items-center gap-4">
                 <FileText size={16} className="text-zinc-600 group-hover:text-blue-500 transition" />
                 <div>
                   <div className="text-sm font-bold text-zinc-200 group-hover:text-blue-400 transition">{p.title}</div>
                   <div className="text-[10px] text-zinc-600 font-mono mt-0.5">{p.industry.toUpperCase()}</div>
                 </div>
              </div>
              <div className="col-span-3 text-xs text-zinc-400 font-mono">
                 {p.audience}
              </div>
              <div className="col-span-2 text-xs text-zinc-300 font-mono">
                  {p.twins} NODES
              </div>
              <div className="col-span-2 flex justify-end items-center gap-4">
                 <div className={`px-2 py-0.5 rounded-sm text-[9px] font-mono font-bold uppercase tracking-widest ${p.status === 'Active' ? 'text-blue-400 bg-blue-900/20 border border-blue-900/40' : 'text-zinc-500 bg-zinc-900 border border-zinc-800'}`}>
                   {p.status}
                 </div>
                 <ChevronRight className="text-zinc-700 group-hover:text-white transition-all" size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;