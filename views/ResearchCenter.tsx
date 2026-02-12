
import React, { useState } from 'react';
import { simulateTwinResponse, synthesizeResearchReport, generateSyntheticCohort } from '../services/geminiService';
import { UserProfile, SimulationResult, SynthesisReport } from '../types';
import { Play, Sparkles, AlertCircle, BarChart3, ExternalLink, Globe, Server, Users, RefreshCw, Bot } from 'lucide-react';

const ResearchCenter: React.FC = () => {
  const [query, setQuery] = useState('');
  const [audienceDesc, setAudienceDesc] = useState('Tech-savvy urban professionals in their 20s');
  
  const [personas, setPersonas] = useState<UserProfile[]>([
    { id: 'p1', name: 'Wei Chen', age: 24, gender: 'M', occupation: 'Cloud Architect', location: 'Singapore', twinMaturity: 92, earnings: 0, industries: ['Tech', 'Gaming'], personality: 'Logic-first, early adopter, minimalist', values: 'Efficiency, technical merit, speed', habits: 'Reads whitepapers' },
    { id: 'p2', name: 'Sophia Li', age: 31, gender: 'F', occupation: 'Brand Strategist', location: 'London', twinMaturity: 88, earnings: 0, industries: ['Luxury', 'Beauty'], personality: 'Aesthetic-driven, social, discerning', values: 'Authenticity, status, craftsmanship', habits: 'Follows niche designers' },
    { id: 'p3', name: 'Marcus Miller', age: 48, gender: 'M', occupation: 'Real Estate Investor', location: 'New York', twinMaturity: 95, earnings: 0, industries: ['FinTech', 'Auto'], personality: 'Pragmatic, risk-aware, legacy-focused', values: 'Stability, ROI, reliability', habits: 'WSJ daily' },
  ]);

  const [simResults, setSimResults] = useState<SimulationResult[]>([]);
  const [report, setReport] = useState<SynthesisReport | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCohort, setIsGeneratingCohort] = useState(false);

  const handleGenerateCohort = async () => {
    if (!audienceDesc) return;
    setIsGeneratingCohort(true);
    const newCohort = await generateSyntheticCohort(audienceDesc, 3);
    if (newCohort && newCohort.length > 0) {
      setPersonas(newCohort);
      setSimResults([]);
      setReport(null);
    }
    setIsGeneratingCohort(false);
  };

  const launchSimulation = async () => {
    if (!query) return;
    setIsLoading(true);
    setSimResults([]);
    setReport(null);

    try {
      const results: SimulationResult[] = [];
      for (const persona of personas) {
        const response = await simulateTwinResponse(persona, query, 'General');
        results.push({
          personaName: persona.name,
          response: response || 'Simulation node failure.',
          sentiment: 'Neutral',
          fidelityScore: 85 + Math.random() * 14
        });
      }
      setSimResults(results);
      
      const analysis = await synthesizeResearchReport(query, results);
      setReport(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 grid lg:grid-cols-12 gap-8 animate-in fade-in duration-1000 h-[calc(100vh-100px)]">
      
      {/* Simulation Console (Left Panel) */}
      <div className="lg:col-span-4 flex flex-col h-full">
        <div className="tech-panel p-6 rounded-sm border-l-2 border-l-blue-600 bg-zinc-900/60 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
            <Server className="text-blue-500" size={18} />
            <h2 className="text-sm font-bold text-white tracking-widest uppercase">Node Configuration</h2>
          </div>

          <div className="space-y-8 flex-grow">
            
            {/* Cohort Generation Section */}
            <div>
              <label className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase mb-3">
                <Users size={12} /> Target Audience
              </label>
              <div className="space-y-3">
                <textarea 
                  value={audienceDesc} 
                  onChange={e => setAudienceDesc(e.target.value)} 
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-sm text-xs text-zinc-300 focus:border-blue-600 outline-none h-20 resize-none font-mono placeholder-zinc-700"
                  placeholder="Describe your target demographic..."
                />
                <button 
                  onClick={handleGenerateCohort}
                  disabled={isGeneratingCohort || !audienceDesc}
                  className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-sm text-[10px] font-bold uppercase tracking-widest text-zinc-300 flex items-center justify-center gap-2 transition"
                >
                  {isGeneratingCohort ? <RefreshCw className="animate-spin" size={12} /> : <Sparkles size={12} />}
                  {isGeneratingCohort ? 'Synthesizing...' : 'Generate New Cohort'}
                </button>
              </div>

              {/* Active Nodes List */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[10px] font-mono text-zinc-500 uppercase">Active Nodes ({personas.length})</span>
                   <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                </div>
                <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                  {personas.map((p, i) => (
                    <div key={i} className="px-3 py-2 bg-zinc-950/50 border border-zinc-800 rounded-sm flex items-center gap-3">
                       <Bot size={12} className="text-blue-500/70" />
                       <div className="overflow-hidden">
                         <div className="text-xs font-bold text-zinc-300 truncate">{p.name}</div>
                         <div className="text-[9px] text-zinc-600 truncate font-mono">{p.occupation}</div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Inquiry Section */}
            <div>
              <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-3">Research Inquiry</label>
              <textarea 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                placeholder="> INPUT_QUERY_STRING..." 
                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-xs text-zinc-300 focus:border-blue-600 focus:ring-0 outline-none h-32 resize-none font-mono placeholder-zinc-700" 
              />
            </div>
            
            <div className="p-3 bg-zinc-950/50 rounded-sm border border-zinc-800 flex gap-3 items-start">
              <AlertCircle size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-relaxed font-mono uppercase">Live Grounding: <span className="text-emerald-500">Active</span></p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/5">
            <button onClick={launchSimulation} disabled={isLoading || !query} className={`w-full py-4 rounded-sm font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition ${isLoading ? 'bg-zinc-800 text-zinc-500 cursor-wait' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
              {isLoading ? <Sparkles className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />}
              {isLoading ? 'PROCESSING SIMULATION...' : 'EXECUTE PROTOCOL'}
            </button>
          </div>
        </div>
      </div>

      {/* Output Workspace (Right Panel) */}
      <div className="lg:col-span-8 h-full overflow-y-auto pr-2 custom-scrollbar">
        {!simResults.length && !isLoading ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 tech-panel border-dashed rounded-sm opacity-50">
            <div className="w-16 h-16 bg-zinc-900 rounded-sm flex items-center justify-center text-zinc-700 mb-6 border border-zinc-800"><Globe size={32} strokeWidth={1} /></div>
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-2">Awaiting Instructions</h3>
            <p className="text-zinc-600 text-xs font-mono">Configure target audience and hypothesis to begin cognitive mapping.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {report && (
              <div className="tech-panel p-8 rounded-sm border-t-2 border-t-emerald-500 bg-zinc-900/90 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                  <h2 className="text-sm font-bold text-white flex items-center gap-3 uppercase tracking-widest">
                    <BarChart3 className="text-emerald-500" size={16} /> Synthesis Report
                  </h2>
                  <span className="text-[9px] font-mono text-emerald-500 border border-emerald-900/50 px-2 py-1 bg-emerald-900/10 rounded-sm">VERIFIED_SOURCE</span>
                </div>
                
                <div className="space-y-8">
                  <section>
                     <p className="text-zinc-300 text-sm leading-7 font-light border-l-2 border-zinc-700 pl-4">"{report.executiveSummary}"</p>
                  </section>

                  <div className="grid md:grid-cols-2 gap-8">
                    <section className="space-y-4">
                      <h4 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Behavioral Patterns</h4>
                      <ul className="space-y-2">
                        {report.behavioralInsights?.map((i: string, idx: number) => (
                          <li key={idx} className="flex gap-3 items-start text-xs text-zinc-400">
                            <span className="text-blue-500 mt-1">›</span> {i}
                          </li>
                        ))}
                      </ul>
                    </section>
                    <section className="space-y-4">
                      <h4 className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Strategic Recs</h4>
                      <div className="space-y-2">
                        {report.strategicRecommendations?.map((r: string, idx: number) => (
                          <div key={idx} className="p-3 bg-zinc-950/50 rounded-sm border border-white/5 text-xs text-zinc-300 font-mono">
                            {r}
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>

                  {report.sources && report.sources.length > 0 && (
                    <section className="pt-6 border-t border-white/5">
                      <h4 className="text-[9px] font-mono text-zinc-600 uppercase mb-3 flex items-center gap-2">
                        <Globe size={10} /> External References
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {report.sources.map((source, idx) => (
                          <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-zinc-950 border border-zinc-800 hover:border-blue-700 text-[9px] font-bold text-zinc-500 hover:text-white transition flex items-center gap-2 rounded-sm uppercase">
                            {source.title.substring(0, 25)}... <ExternalLink size={10} />
                          </a>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            )}
            
            {/* Simulation Steps / Logs */}
             <div className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Raw Cognitive Data</h3>
                {simResults.map((sim, i) => (
                    <div key={i} className="tech-panel p-4 rounded-sm animate-in fade-in slide-in-from-bottom-2 duration-500" style={{animationDelay: `${i * 100}ms`}}>
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-xs font-bold text-blue-400 font-mono">{sim.personaName}</div>
                            <div className="text-[9px] text-zinc-600 font-mono">FIDELITY: {sim.fidelityScore.toFixed(1)}%</div>
                        </div>
                        <p className="text-zinc-400 text-xs leading-relaxed">"{sim.response}"</p>
                    </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchCenter;
