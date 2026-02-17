
import React from 'react';
import { Home, Zap, CreditCard, User, Layout } from 'lucide-react';

export const BottomBar: React.FC = () => {
  return (
    <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
      <div className="glass flex justify-between items-center px-8 py-4 rounded-[28px] border-white/10 shadow-2xl">
        <button onClick={() => window.scrollTo(0, 0)} className="flex flex-col items-center gap-1 text-red-500">
          <Home className="w-6 h-6" />
        </button>
        <a href="#how-it-works" className="flex flex-col items-center gap-1 text-white/40">
          <Zap className="w-6 h-6" />
        </a>
        <a href="#studio" className="flex flex-col items-center gap-1 text-white/40">
          <Layout className="w-6 h-6" />
        </a>
        <a href="#pricing" className="flex flex-col items-center gap-1 text-white/40">
          <CreditCard className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
};
