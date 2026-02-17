
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const faqs = [
  {
    question: "Qu'est-ce que BookAIO précisément ?",
    answer: "BookAIO est une plateforme d'intelligence artificielle conçue pour les créateurs de contenus. Elle permet de transformer n'importe quelle source de savoir (vidéo YouTube, mémo vocal, texte brut ou simple idée) en un produit numérique fini (Ebook PDF) avec sa couverture et ses visuels publicitaires."
  },
  {
    question: "Comment fonctionne l'extraction depuis YouTube ?",
    answer: "Il vous suffit de coller l'URL d'une vidéo YouTube. Notre IA analyse la transcription, extrait les concepts clés et les reformule pour créer un manuscrit structuré, éducatif et agréable à lire, tout en respectant l'essence de votre source."
  },
  {
    question: "Puis-je vendre les ebooks générés sur la plateforme ?",
    answer: "Absolument. Une fois l'ebook généré et téléchargé, vous en êtes le plein propriétaire. Vous pouvez le vendre sur votre propre site, via les réseaux sociaux ou sur des plateformes comme Amazon KDP ou Gumroad."
  },
  {
    question: "Quels sont les moyens de paiement acceptés ?",
    answer: "Nous utilisons Paystack, leader du paiement sécurisé. Vous pouvez payer en Fcfa par Mobile Money (Orange Money, Wave, MTN, Moov) ou par carte bancaire (Visa, Mastercard)."
  },
  {
    question: "Qu'est-ce que l'option 'Vocal' dans l'offre Abondance ?",
    answer: "C'est notre fonctionnalité la plus innovante. Vous enregistrez votre savoir directement dans le studio, et notre IA transforme votre voix en un livre structuré. C'est idéal pour ceux qui préfèrent parler plutôt qu'écrire."
  },
  {
    question: "Y a-t-il une limite de stockage pour mes créations ?",
    answer: "Vos créations sont conservées dans vos archives privées (Laboratoire Elite) pendant 24 heures après leur génération. Nous vous conseillons de les télécharger immédiatement après la production."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 px-6 relative overflow-hidden border-t border-white/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[150px] -z-10 rounded-full" />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/5 mb-2">
            <HelpCircle className="w-3 h-3 text-red-500" />
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/60">Foire aux questions</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif">Des réponses à vos <br /><span className="text-white/40">interrogations.</span></h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`glass-card rounded-[32px] overflow-hidden border-white/5 transition-all duration-500 ${openIndex === idx ? 'border-red-500/20' : 'hover:border-white/10'}`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex items-center justify-between p-8 text-left group"
              >
                <span className={`text-lg font-bold tracking-tight transition-colors ${openIndex === idx ? 'text-red-500' : 'text-white/80 group-hover:text-white'}`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-500 ${openIndex === idx ? 'bg-red-500 border-red-500 rotate-180' : 'border-white/10'}`}>
                  <ChevronDown className={`w-4 h-4 ${openIndex === idx ? 'text-white' : 'text-white/40'}`} />
                </div>
              </button>
              
              <div className={`transition-all duration-500 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="px-8 pb-8 text-white/50 leading-relaxed text-base border-t border-white/5 pt-6">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-10 rounded-[40px] glass border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
           <div className="space-y-2">
             <h4 className="text-xl font-bold flex items-center gap-2 justify-center md:justify-start">
               <Sparkles className="w-5 h-5 text-red-500" /> Toujours des doutes ?
             </h4>
             <p className="text-white/40 text-sm">Discutez en direct avec notre IA ou notre équipe support.</p>
           </div>
           <a href="#" className="px-8 py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all">
             Contacter le support
           </a>
        </div>
      </div>
    </section>
  );
};
