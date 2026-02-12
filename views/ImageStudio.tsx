
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { editVisualAsset } from '../services/geminiService';
import { Layers, Command, Download, Upload, Image as ImageIcon, ArrowRight, Loader2, RefreshCw, Zap } from 'lucide-react';

interface ImageStudioProps {
  profile: UserProfile | null;
}

const ImageStudio: React.FC<ImageStudioProps> = ({ profile }) => {
  const [currentImage, setCurrentImage] = useState<string | null>(profile?.avatarUrl || null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentImage(reader.result as string);
        setProcessedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!currentImage || !prompt) return;
    setIsProcessing(true);
    const result = await editVisualAsset(processedImage || currentImage, prompt);
    if (result) {
      setProcessedImage(result);
    }
    setIsProcessing(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-800 pb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
            <Layers className="text-blue-500" /> Visual Asset Studio
          </h1>
          <p className="text-slate-400 font-medium max-w-2xl">
            Modify your digital twin's visual identifiers using natural language commands.
            Powered by <span className="text-blue-400 font-mono text-xs border border-blue-900/50 bg-blue-900/20 px-1 py-0.5 rounded">GEMINI-2.5-FLASH-IMAGE</span>.
          </p>
        </div>
        <div className="flex gap-3">
            <label className="cursor-pointer px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg border border-slate-700 transition flex items-center gap-2">
                <Upload size={16} /> Upload Source
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 h-[600px]">
        {/* Source / Canvas */}
        <div className="glass rounded-lg p-1 flex flex-col relative group">
            <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs font-mono text-slate-300 border border-white/10">
                SOURCE_ASSET
            </div>
            <div className="flex-grow bg-slate-950/50 rounded flex items-center justify-center overflow-hidden relative">
                {currentImage ? (
                    <img src={currentImage} alt="Source" className="max-w-full max-h-full object-contain" />
                ) : (
                    <div className="text-slate-600 flex flex-col items-center">
                        <ImageIcon size={48} className="mb-4 opacity-50" />
                        <span className="text-sm font-mono uppercase tracking-widest">No Asset Loaded</span>
                    </div>
                )}
            </div>
        </div>

        {/* Result */}
        <div className="glass rounded-lg p-1 flex flex-col relative">
             <div className="absolute top-4 left-4 z-10 bg-blue-900/60 backdrop-blur px-3 py-1 rounded text-xs font-mono text-blue-200 border border-blue-500/30">
                PROCESSED_OUTPUT
            </div>
            <div className="flex-grow bg-slate-950/50 rounded flex items-center justify-center overflow-hidden relative">
                {isProcessing ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="animate-spin text-blue-500" size={48} />
                        <span className="text-xs font-mono text-blue-400 animate-pulse">PROCESSING VISUAL DATA...</span>
                    </div>
                ) : processedImage ? (
                    <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain" />
                ) : (
                    <div className="text-slate-700 flex flex-col items-center border border-dashed border-slate-800 p-12 rounded-lg">
                        <ArrowRight size={48} className="mb-4 opacity-50" />
                        <span className="text-sm font-mono uppercase tracking-widest">Awaiting Command</span>
                    </div>
                )}
            </div>
            {processedImage && (
                <button 
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href = processedImage;
                        link.download = `twin-asset-${Date.now()}.png`;
                        link.click();
                    }}
                    className="absolute bottom-6 right-6 px-4 py-2 bg-slate-900/80 hover:bg-black text-white text-xs font-bold rounded border border-white/10 flex items-center gap-2 backdrop-blur transition"
                >
                    <Download size={14} /> SAVE ASSET
                </button>
            )}
        </div>
      </div>

      {/* Command Interface */}
      <div className="glass p-6 rounded-lg border-t-2 border-t-blue-600/50">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <Command size={14} /> Modification Command
        </label>
        <div className="flex gap-4">
            <input 
                type="text" 
                value={prompt} 
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                placeholder="e.g. Add a cyberpunk visor, change background to a clean office, apply a monochrome filter..." 
                className="flex-grow bg-slate-950 border border-slate-700 text-slate-200 px-6 py-4 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono text-sm transition"
            />
            <button 
                onClick={handleProcess} 
                disabled={!currentImage || !prompt || isProcessing}
                className="px-8 py-4 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shadow-lg shadow-blue-900/20"
            >
                {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} fill="currentColor" />}
                EXECUTE
            </button>
        </div>
        <div className="mt-4 flex gap-2 text-xs text-slate-500 font-mono">
            <span>SUGGESTED:</span>
            <button onClick={() => setPrompt("Make it look like a pencil sketch")} className="hover:text-blue-400 underline decoration-slate-700">Pencil Sketch</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => setPrompt("Change the background to a futuristic server room")} className="hover:text-blue-400 underline decoration-slate-700">Server Room BG</button>
            <span className="text-slate-700">|</span>
            <button onClick={() => setPrompt("Add professional glasses")} className="hover:text-blue-400 underline decoration-slate-700">Add Glasses</button>
        </div>
      </div>
    </div>
  );
};

export default ImageStudio;
