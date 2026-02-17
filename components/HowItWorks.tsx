
import { MousePointer2, Edit3, Image, Rocket, ArrowRight } from 'lucide-react';
import React from 'react';

const steps = [
  {
    title: 'Extraction du Savoir',
    description: 'Importez vos sources (YouTube, Audio, Texte). Notre IA distille l\'essentiel pour bâtir un manuscrit cohérent et structuré.',
    icon: MousePointer2,
    color: 'from-red-500/20 to-transparent',
    link: '#studio-ebook'
  },
  {
    title: 'Design de Marque',
    description: 'Créez une couverture impactante. L\'esthétique de votre livre est le premier facteur de confiance pour vos futurs lecteurs.',
    icon: Edit3,
    color: 'from-red-600/20 to-transparent',
    link: '#studio-cover'
  },
  {
    title: 'Mise en Scène 3D',
    description: 'Transformez votre PDF en objet physique virtuel. Les mockups 3D augmentent drastiquement la valeur perçue de votre produit.',
    icon: Image,
    color: 'from-red-700/20 to-transparent',
    link: '#studio-mockup'
  },
  {
    title: 'Lancement Commercial',
    description: 'Générez vos visuels publicitaires et lancez votre campagne. Vous avez désormais un actif prêt à générer des revenus.',
    icon: Rocket,
    color: 'from-rose-600/20 to-transparent',
    link: '#studio-ad'
  }
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-red-600/5 blur-[100px] -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-20">
          <p className="text-red-500 font-bold uppercase tracking-[0.4em] text-[10px]">De l'expertise au produit fini</p>
          <h2 className="text-4xl md:text-6xl font-serif">Bâtissez votre <br /><span className="text-white/40">Patrimoine Numérique.</span></h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="glass-card rounded-[32px] p-10 space-y-6 relative overflow-hidden group hover:border-red-500/30 transition-all duration-500">
              <div className={`absolute inset-0 bg-gradient-to-b ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <step.icon className="w-6 h-6 text-red-500" />
              </div>
              <div className="space-y-4 relative z-10">
                <h3 className="text-xl font-bold tracking-tight">{step.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed font-medium">{step.description}</p>
                <a href={step.link} className="flex items-center gap-2 text-red-500/40 group-hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest pt-4">
                    En savoir plus <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <div className="absolute top-4 right-8 text-8xl font-bold text-white/[0.03] font-serif select-none pointer-events-none">{idx + 1}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
