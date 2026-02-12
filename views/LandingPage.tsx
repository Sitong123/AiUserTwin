import React from 'react';
import { UserRole } from '../types';
import { Shield, Zap, Box, ArrowRight, Terminal, Cpu, Network, Lock } from 'lucide-react';

interface LandingPageProps {
  onRoleSelect: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onRoleSelect }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Abstract Tech Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
      
      {/* Hero */}
      <section className="pt-32 pb-32 px-6 border-b border-white/5 relative z-10">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono text-blue-400 uppercase tracking-[0.2em]">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-sm"></span> 
                    Protocol V3.1 Live
                </div>
                <h1 className="text-5xl md:text-7xl font-bold leading-[0.9] tracking-tight text-white">
                    COGNITIVE <br/>
                    <span className="text-zinc-600">ASSET LAYER</span>
                </h1>
                <p className="text-lg text-zinc-400 max-w-lg leading-relaxed font-light border-l-2 border-blue-600/30 pl-6">
                    A decentralized infrastructure for high-fidelity digital twins. 
                    Authorize cognitive data for market simulations. 
                    Ensure cryptographic sovereignty.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button 
                    onClick={() => onRoleSelect(UserRole.INDIVIDUAL)}
                    className="group px-8 py-4 bg-white text-black hover:bg-zinc-200 rounded-sm font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-4"
                    >
                    Initialize Twin <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                    <button 
                    onClick={() => onRoleSelect(UserRole.ENTERPRISE)}
                    className="px-8 py-4 bg-transparent text-zinc-300 border border-zinc-700 hover:border-white rounded-sm font-bold text-xs uppercase tracking-widest transition flex items-center justify-center gap-4 hover:text-white"
                    >
                    Enterprise Console <Terminal size={14} />
                    </button>
                </div>
            </div>

            {/* Abstract Visual - Code Block */}
            <div className="hidden lg:block relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-transparent opacity-20 blur-xl"></div>
                <div className="relative bg-zinc-950 border border-white/10 p-6 rounded-sm font-mono text-xs text-zinc-400 shadow-2xl">
                    <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                        <span className="text-zinc-600">simulation_engine.ts</span>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                            <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p><span className="text-purple-400">import</span> <span className="text-blue-400">{`{ NeuralHash }`}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@protocol/core'</span>;</p>
                        <p className="h-4"></p>
                        <p><span className="text-zinc-500">// Initialize cognitive mapping</span></p>
                        <p><span className="text-purple-400">const</span> <span className="text-yellow-200">identity</span> = <span className="text-purple-400">await</span> NeuralHash.<span className="text-blue-300">construct</span>({`{`}</p>
                        <p className="pl-4"><span className="text-blue-200">source</span>: <span className="text-green-400">'biometric_v2'</span>,</p>
                        <p className="pl-4"><span className="text-blue-200">privacy</span>: <span className="text-green-400">'zero_knowledge'</span>,</p>
                        <p className="pl-4"><span className="text-blue-200">yield_target</span>: <span className="text-orange-400">0.045</span></p>
                        <p>});</p>
                        <p className="h-4"></p>
                        <p><span className="text-zinc-500">// Output: Verified Asset</span></p>
                        <p><span className="text-blue-400">console</span>.<span className="text-yellow-200">log</span>(identity.<span className="text-blue-200">hash</span>);</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="border-b border-white/5 bg-zinc-900/30">
        <div className="max-w-[1200px] mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
                { label: "Active Nodes", val: "1.2M+" },
                { label: "Market Cap", val: "$420M" },
                { label: "Encryption", val: "ZK-Rollup" },
                { label: "Uptime", val: "99.99%" }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col border-l border-white/10 pl-6">
                    <span className="text-2xl font-bold text-white font-mono">{stat.val}</span>
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">{stat.label}</span>
                </div>
            ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-zinc-950">
        <div className="max-w-[1200px] mx-auto">
            <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-widest mb-12">System Modules</h2>
            <div className="grid md:grid-cols-3 gap-6">
                {[
                    { icon: Cpu, title: 'Cognitive Modeling', desc: 'Map behavioral heuristics into portable JSON-LD schemas.' },
                    { icon: Lock, title: 'Sovereign Privacy', desc: 'Differential privacy layers ensure identifier protection.' },
                    { icon: Network, title: 'Yield Network', desc: 'Passive computational farming via enterprise simulation requests.' }
                ].map((f, i) => (
                    <div key={i} className="p-8 border border-white/5 bg-zinc-900/20 hover:bg-zinc-900/40 hover:border-blue-500/30 transition-all duration-300 group">
                        <f.icon className="text-zinc-600 mb-6 group-hover:text-blue-400 transition-colors" size={24} strokeWidth={1.5} />
                        <h3 className="text-lg font-bold mb-3 text-zinc-200">{f.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;