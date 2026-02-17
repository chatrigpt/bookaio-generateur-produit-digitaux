
import React from 'react';
import { X, CheckCircle2, Zap, Layout, Mic, BookOpen, ShieldCheck, ChevronRight } from 'lucide-react';

interface PaymentSuccessModalProps {
  plan: 'essential' | 'abundance' | null;
  onClose: () => void;
}

export const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({ plan, onClose }) => {
  if (!plan) return null;

  const benefits = {
    essential: [
      { icon: BookOpen, text: "Génération de 3 Ebooks complets par mois" },
      { icon: Layout, text: "Accès illimité au module Design de Cover" },
      { icon: Zap, text: "Accès au Chatbot assistant de niche" },
      { icon: ShieldCheck, text: "Formatage PDF Premium sans filigrane" }
    ],
    abundance: [
      { icon: BookOpen, text: "Production massive : 10 Ebooks par mois" },
      { icon: Layout, text: "15 Mockups 3D Haute Résolution par mois" },
      { icon: Mic, text: "Option Vocal débloquée (votre voix en Ebook)" },
      { icon: Zap, text: "Arsenal Publicitaire complet débloqué" },
      { icon: ShieldCheck, text: "Support VIP Prioritaire 24/7" }
    ]
  };

  const currentBenefits = benefits[plan];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass-card rounded-[48px] p-10 md:p-16 border-red-500/20 animate-in zoom-in duration-500 shadow-[0_0_100px_rgba(225,29,72,0.15)] overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] -z-10 rounded-full" />
        <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors">
          <X className="w-8 h-8" />
        </button>

        <div className="text-center space-y-6 mb-12">
          <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20 mb-4">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-4xl font-serif">Paiement Validé</h2>
          <p className="text-white/40 text-lg uppercase tracking-widest font-bold">Bienvenue dans l'offre <span className="text-red-500">{plan === 'essential' ? 'Essentiel' : 'Abondance'}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {currentBenefits.map((benefit, idx) => (
            <div key={idx} className="flex items-start gap-4 p-5 rounded-3xl bg-white/5 border border-white/5 group hover:border-red-500/20 transition-all">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                <benefit.icon className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm text-white/70 leading-relaxed pt-1">{benefit.text}</p>
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="w-full py-6 rounded-2xl gradient-amber text-white font-bold uppercase tracking-[0.2em] text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          Accéder à mon Studio <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
