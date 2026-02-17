
import React from 'react';
import { Layers, MousePointer2, Zap, FileText, Share2, Sparkles, Layout } from 'lucide-react';

export const HeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center pointer-events-none">
      {/* Central Core - AI Engine */}
      <div className="relative z-10 w-40 h-40 rounded-[48px] glass border border-red-500/30 flex items-center justify-center shadow-[0_0_100px_rgba(225,29,72,0.15)] animate-float-slow">
        <div className="absolute inset-2 rounded-[40px] bg-red-500/5" />
        <Zap className="w-14 h-14 text-red-500" />
        
        {/* Orbital Rings */}
        <div className="absolute -inset-8 border border-red-500/10 rounded-full animate-[spin_10s_linear_infinite]" />
        <div className="absolute -inset-16 border border-red-500/5 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
      </div>

      {/* Floating Infographic Components */}
      <div className="absolute top-0 left-[15%] glass-card px-6 py-4 rounded-2xl flex items-center gap-4 animate-float-slow border-red-500/20" style={{ animationDelay: '1s' }}>
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-left">
            <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">Contenu</p>
            <p className="text-xs font-bold text-white">Rédaction IA</p>
        </div>
      </div>

      <div className="absolute bottom-10 left-[20%] glass-card px-6 py-4 rounded-2xl flex items-center gap-4 animate-float-slow border-red-500/20" style={{ animationDelay: '2.5s' }}>
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Layout className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-left">
            <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">Layout</p>
            <p className="text-xs font-bold text-white">Formatage PDF</p>
        </div>
      </div>

      <div className="absolute top-[20%] right-[15%] glass-card px-6 py-4 rounded-2xl flex items-center gap-4 animate-float-slow border-red-500/20" style={{ animationDelay: '0.5s' }}>
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Layers className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-left">
            <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">Design</p>
            <p className="text-xs font-bold text-white">Mockups 3D</p>
        </div>
      </div>

      <div className="absolute bottom-[20%] right-[20%] glass-card px-6 py-4 rounded-2xl flex items-center gap-4 animate-float-slow border-red-500/20" style={{ animationDelay: '1.8s' }}>
        <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Share2 className="w-4 h-4 text-red-500" />
        </div>
        <div className="text-left">
            <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">Ads</p>
            <p className="text-xs font-bold text-white">Visuels Promo</p>
        </div>
      </div>

      {/* Decorative Schema Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 400">
        <path d="M250 150 Q500 100 500 200" stroke="#e11d48" strokeWidth="1" fill="none" strokeDasharray="5 5" />
        <path d="M750 150 Q500 100 500 200" stroke="#e11d48" strokeWidth="1" fill="none" strokeDasharray="5 5" />
        <path d="M300 300 Q500 350 500 200" stroke="#e11d48" strokeWidth="1" fill="none" strokeDasharray="5 5" />
        <path d="M700 300 Q500 350 500 200" stroke="#e11d48" strokeWidth="1" fill="none" strokeDasharray="5 5" />
      </svg>
    </div>
  );
};
