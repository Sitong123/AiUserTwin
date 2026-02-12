
import React, { useState, useEffect } from 'react';
import { UserProfile, VirtualMerchant, InteractionLog } from '../types';
import { Save, ArrowRight, Brain, User, CheckCircle2, ShieldAlert, Image as ImageIcon, Loader2, Play, Building2, MessageSquare, Briefcase } from 'lucide-react';
import { generateVisualPersona, generateVirtualMerchants, simulateMerchantInteraction } from '../services/geminiService';

interface ModelingWizardProps {
  profile: UserProfile | null;
  onUpdate: (profile: UserProfile) => void;
}

const ModelingWizard: React.FC<ModelingWizardProps> = ({ profile, onUpdate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile || {
    name: '', occupation: '', age: 25, industries: ['Tech'],
    surveyAnswers: { q1: '', q2: '', q3: '' }
  });
  
  // State for Visual Asset
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);

  // State for Merchant Simulation
  const [isScanningMerchants, setIsScanningMerchants] = useState(false);
  const [merchants, setMerchants] = useState<VirtualMerchant[]>([]);
  const [simulationLogs, setSimulationLogs] = useState<InteractionLog[]>([]);
  const [activeMerchantIndex, setActiveMerchantIndex] = useState<number>(-1);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  // --- Step Logic Handlers ---

  // Step 4: Generate Merchants when entering the step
  useEffect(() => {
    if (step === 4 && merchants.length === 0) {
      const scan = async () => {
        setIsScanningMerchants(true);
        // Simulate scanning delay for effect
        await new Promise(r => setTimeout(r, 1500));
        const results = await generateVirtualMerchants(formData as UserProfile);
        setMerchants(results);
        setIsScanningMerchants(false);
      };
      scan();
    }
  }, [step]);

  // Step 4.5: Auto-run simulation when merchants are loaded
  const runSimulation = async () => {
    if (merchants.length === 0) return;
    
    setActiveMerchantIndex(0);
    setSimulationLogs([]);

    for (let i = 0; i < merchants.length; i++) {
        setActiveMerchantIndex(i);
        await new Promise(r => setTimeout(r, 1000)); // Pause between merchants
        
        const interaction = await simulateMerchantInteraction(formData as UserProfile, merchants[i]);
        if (interaction) {
            setSimulationLogs(prev => [...prev, interaction]);
        }
        
        await new Promise(r => setTimeout(r, 2000)); // Read time
    }
    setActiveMerchantIndex(-1);
    setStep(5); // Go to completion
  };

  const handleGenerateAvatar = async () => {
    setIsGeneratingAvatar(true);
    const url = await generateVisualPersona(formData as UserProfile);
    if (url) {
      setFormData(prev => ({ ...prev, avatarUrl: url }));
    }
    setIsGeneratingAvatar(false);
  };

  const finalizeProfile = () => {
    if (profile) {
        const updated = { 
          ...profile, 
          ...formData as UserProfile, 
          twinMaturity: 100 
        };
        onUpdate(updated);
        window.location.hash = "/dashboard";
    }
  };

  const steps = [
    { title: 'BIO_DATA', icon: User },
    { title: 'LIFESTYLE_SURVEY', icon: MessageSquare },
    { title: 'TWIN_MODELING', icon: Brain },
    { title: 'MARKET_SIMULATION', icon: Building2 },
    { title: 'ACTIVATION', icon: CheckCircle2 }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 animate-in fade-in duration-500 min-h-[600px]">
      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        
        {/* Step Indicator (Sidebar) */}
        <div className="space-y-8 border-r border-white/5 pr-8 hidden md:block">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">USER JOURNEY</h2>
            <p className="text-[10px] text-zinc-500 font-mono">INIT_PROTOCOL_SEQUENCE</p>
          </div>
          <div className="space-y-1">
            {steps.map((s, i) => (
              <div 
                key={i} 
                className={`flex items-center gap-3 py-3 px-2 border-l-2 transition-all ${
                    step === i + 1 
                        ? 'border-blue-500 text-white bg-blue-500/5' 
                        : step > i + 1 
                            ? 'border-emerald-500/50 text-emerald-500' 
                            : 'border-transparent text-zinc-600'
                }`}
              >
                <div className="text-[10px] font-mono opacity-50">0{i + 1}</div>
                <div className="text-xs font-bold tracking-widest uppercase">{s.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="tech-panel p-8 rounded-sm bg-zinc-900/30 relative overflow-hidden flex flex-col">
          
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white">Identity Calibration</h3>
                <p className="text-xs text-zinc-500 mt-1">Establish the baseline demographic parameters for your Digital Twin.</p>
              </div>
              <div className="grid gap-6 max-w-xl">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Legal Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-white focus:border-blue-600 outline-none transition placeholder-zinc-700 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Age</label>
                        <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-white focus:border-blue-600 outline-none transition placeholder-zinc-700 font-mono" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Gender</label>
                        <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-white focus:border-blue-600 outline-none transition font-mono">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Non-binary">Non-binary</option>
                        </select>
                    </div>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">Primary Occupation</label>
                  <input type="text" value={formData.occupation} onChange={e => setFormData({...formData, occupation: e.target.value})} className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-white focus:border-blue-600 outline-none transition placeholder-zinc-700 font-mono" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SURVEY */}
          {step === 2 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
               <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white">Cognitive Mapping Survey</h3>
                <p className="text-xs text-zinc-500 mt-1">Help the AI understand your decision-making logic.</p>
              </div>
              <div className="max-w-xl space-y-6">
                 <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">How do you usually spend your weekends?</label>
                    <textarea 
                        value={formData.surveyAnswers?.q1 || ''} 
                        onChange={e => setFormData({...formData, surveyAnswers: {...formData.surveyAnswers, q1: e.target.value}})}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-white focus:border-blue-600 outline-none h-24 resize-none font-mono"
                        placeholder="e.g. Hiking, gaming, coding side projects..."
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-mono text-zinc-500 uppercase mb-2">What are your top 3 spending categories?</label>
                    <textarea 
                        value={formData.surveyAnswers?.q2 || ''} 
                        onChange={e => setFormData({...formData, surveyAnswers: {...formData.surveyAnswers, q2: e.target.value}})}
                        className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 rounded-sm text-sm text-white focus:border-blue-600 outline-none h-24 resize-none font-mono"
                        placeholder="e.g. Tech gadgets, travel, dining out..."
                    />
                 </div>
              </div>
            </div>
          )}

          {/* STEP 3: VISUAL MODELING */}
          {step === 3 && (
            <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white">Visual Synthesis</h3>
                <p className="text-xs text-zinc-500 mt-1">Generate your Digital Twin's visual avatar.</p>
              </div>
              
              <div className="flex gap-8 items-start">
                <div className="w-64 h-64 bg-zinc-950 border border-zinc-800 rounded-sm flex flex-col items-center justify-center overflow-hidden relative shrink-0">
                  {formData.avatarUrl ? (
                    <img src={formData.avatarUrl} className="w-full h-full object-cover" alt="Generated Avatar" />
                  ) : (
                    <div className="text-zinc-700 flex flex-col items-center">
                        {isGeneratingAvatar ? <Loader2 className="animate-spin text-blue-600" size={24} /> : <ImageIcon size={24} />}
                        <span className="text-[10px] font-mono mt-4 uppercase tracking-widest">{isGeneratingAvatar ? 'RENDERING...' : 'AWAITING_GEN'}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
                </div>

                <div className="space-y-4">
                     {!formData.avatarUrl && !isGeneratingAvatar && (
                        <button onClick={handleGenerateAvatar} className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 border border-white/10 rounded-sm text-xs font-bold uppercase tracking-wide text-white transition flex items-center gap-2">
                            <Brain size={14} /> Generate Asset
                        </button>
                    )}
                     <div className="text-[10px] text-zinc-500 max-w-xs leading-relaxed font-mono">
                        System will generate a high-fidelity visual representation based on your demographic and survey inputs.
                     </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MERCHANT SIMULATION */}
          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300 h-full flex flex-col">
              <div className="border-b border-white/5 pb-4 flex justify-between items-end">
                <div>
                    <h3 className="text-lg font-bold text-white">Ecosystem Simulation</h3>
                    <p className="text-xs text-zinc-500 mt-1">
                        {isScanningMerchants ? 'Scanning for compatible enterprise nodes...' : 'Connecting your Twin to the virtual market...'}
                    </p>
                </div>
                {!isScanningMerchants && merchants.length > 0 && simulationLogs.length === 0 && (
                     <button onClick={runSimulation} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-sm flex items-center gap-2 animate-pulse">
                        <Play size={12} fill="currentColor" /> Start Simulation
                     </button>
                )}
              </div>

              {isScanningMerchants ? (
                  <div className="flex-grow flex flex-col items-center justify-center text-zinc-600 gap-4 min-h-[300px]">
                      <Loader2 className="animate-spin" size={32} />
                      <div className="text-xs font-mono uppercase tracking-widest">Indexing Vertical Markets...</div>
                  </div>
              ) : (
                  <div className="grid md:grid-cols-2 gap-6 flex-grow">
                      {/* Left: Merchants List */}
                      <div className="space-y-4">
                          <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Identified Opportunities</h4>
                          {merchants.map((m, i) => (
                              <div key={i} className={`p-4 border rounded-sm transition-all duration-300 ${activeMerchantIndex === i ? 'bg-zinc-900 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-zinc-950/50 border-white/5 opacity-60'}`}>
                                  <div className="flex items-center gap-3 mb-2">
                                      <div className="w-8 h-8 rounded-sm flex items-center justify-center text-white font-bold text-xs" style={{backgroundColor: m.logoColor}}>
                                          {m.name.substring(0, 2).toUpperCase()}
                                      </div>
                                      <div>
                                          <div className="text-sm font-bold text-zinc-200">{m.name}</div>
                                          <div className="text-[9px] text-zinc-500 font-mono uppercase">{m.industry}</div>
                                      </div>
                                      {activeMerchantIndex === i && <div className="ml-auto text-[9px] text-blue-400 font-mono animate-pulse">● LIVE</div>}
                                  </div>
                                  <div className="text-xs text-zinc-400 leading-relaxed pl-11">
                                      Intent: {m.intent}
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Right: Conversation Log */}
                      <div className="tech-panel bg-black/40 p-4 rounded-sm flex flex-col h-[400px]">
                          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4 pb-2 border-b border-white/5">
                              <MessageSquare size={12} /> Interaction Log
                          </div>
                          <div className="flex-grow overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                              {simulationLogs.length === 0 ? (
                                  <div className="h-full flex items-center justify-center text-zinc-700 text-xs font-mono">
                                      Waiting for simulation start...
                                  </div>
                              ) : (
                                  simulationLogs.map((log, i) => (
                                      <div key={i} className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                          <div className="flex gap-3">
                                              <div className="text-[10px] font-bold text-zinc-500 uppercase w-16 shrink-0 pt-1 text-right">{log.merchantName}</div>
                                              <div className="p-2 bg-zinc-900 rounded-sm rounded-tl-none border border-white/5 text-xs text-zinc-300">
                                                  {log.question}
                                              </div>
                                          </div>
                                          <div className="flex gap-3 flex-row-reverse">
                                               <div className="text-[10px] font-bold text-blue-500 uppercase w-16 shrink-0 pt-1 text-left">You (AI)</div>
                                              <div className="p-2 bg-blue-900/20 rounded-sm rounded-tr-none border border-blue-500/20 text-xs text-blue-100">
                                                  {log.answer}
                                              </div>
                                          </div>
                                      </div>
                                  ))
                              )}
                          </div>
                      </div>
                  </div>
              )}
            </div>
          )}

          {/* STEP 5: COMPLETION */}
          {step === 5 && (
            <div className="space-y-8 animate-in zoom-in-95 duration-500 py-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center border border-emerald-500/20 mb-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={32} />
              </div>
              <div className="max-w-md">
                 <h3 className="text-xl font-bold text-white mb-2">DIGITAL TWIN ONLINE</h3>
                 <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Your cognitive asset has been successfully modeled and verified against 3 commercial nodes. 
                    It is now ready to generate passive yield on the marketplace.
                 </p>
                 <div className="flex justify-center gap-8 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-t border-white/5 pt-6">
                    <div>
                        <div className="text-xl font-bold text-white mb-1">100%</div>
                        Maturity
                    </div>
                     <div>
                        <div className="text-xl font-bold text-white mb-1">3</div>
                        Active Leads
                    </div>
                 </div>
              </div>
              <button onClick={finalizeProfile} className="mt-8 px-10 py-4 bg-white text-black font-bold rounded-sm text-xs hover:bg-zinc-200 transition uppercase tracking-widest flex items-center gap-2">
                Enter Dashboard <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          {step < 5 && (
            <div className="mt-auto pt-8 border-t border-white/5 flex justify-between">
              <button disabled={step === 1 || isScanningMerchants} onClick={handleBack} className="px-6 py-2 font-mono text-xs text-zinc-500 hover:text-white transition disabled:opacity-0 uppercase tracking-widest">
                Back
              </button>
              
              {/* Custom Next Buttons based on step */}
              {step === 3 ? (
                 <button onClick={handleNext} disabled={!formData.avatarUrl} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-sm text-xs flex items-center gap-2 hover:bg-blue-500 transition disabled:opacity-50 disabled:grayscale uppercase tracking-widest">
                    Run Market Simulation <ArrowRight size={14} />
                 </button>
              ) : step === 4 ? (
                 <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest flex items-center gap-2">
                    {simulationLogs.length > 0 ? "Simulation Complete" : "Waiting for Protocol..."}
                 </div>
              ) : (
                 <button onClick={handleNext} className="px-8 py-3 bg-blue-600 text-white font-bold rounded-sm text-xs flex items-center gap-2 hover:bg-blue-500 transition uppercase tracking-widest">
                    Next Phase <ArrowRight size={14} />
                 </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModelingWizard;
