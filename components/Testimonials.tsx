
import React from 'react';
import { Twitter, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface TestimonialsProps {
  isLoggedIn: boolean;
  onAuthClick: () => void;
}

const testimonials = [
  {
    name: "Koffi Mensah",
    handle: "@koffi_digital",
    text: "Incroyable ! J'ai transformé une simple vidéo de ma formation en ebook de 45 pages. Vendu 12 exemplaires la première semaine. 🚀",
    avatar: "https://monadia-bucket.sfo3.digitaloceanspaces.com/Untitled%20design%20(8).jpg"
  },
  {
    name: "Fatou Diop",
    handle: "@fatoud",
    text: "Le générateur de covers est d'un niveau supérieur. On dirait que j'ai payé un designer pro 500€. BookAIO c'est de la triche ! 😂",
    avatar: "https://monadia-bucket.sfo3.digitaloceanspaces.com/Untitled%20design%20(5).jpg"
  },
  {
    name: "Amadou Diallo",
    handle: "@amadou_coach",
    text: "Enfin un outil qui comprend les besoins des créateurs africains. Le paiement en Fcfa et la rapidité sont top. Mon ebook sur le trading est prêt.",
    avatar: "https://monadia-bucket.sfo3.digitaloceanspaces.com/Untitled%20design%20(6).jpg"
  },
  {
    name: "Moussa Traoré",
    handle: "@moussa_biz",
    text: "Je pensais que c'était encore une IA bidon. Mais non, le contenu est structuré, intelligent. 14900 Fcfa rentabilisés en un clic.",
    avatar: "https://monadia-bucket.sfo3.digitaloceanspaces.com/Capture%20d%E2%80%99%C3%A9cran%20(690).png"
  },
  {
    name: "Aissatou Sow",
    handle: "@aissa_creative",
    text: "Le chatbot m'a aidé à trouver une niche rentable dans le domaine culinaire. Résultat : 5 ebooks générés en 15 minutes. Merci BookAIO !",
    avatar: "https://i.pravatar.cc/150?u=aissatou"
  },
  {
    name: "Abdoulaye Koné",
    handle: "@abdou_k",
    text: "L'option de vocal pour générer l'ebook est géniale. J'ai juste parlé, l'IA a fait le reste. La qualité est bluffante.",
    avatar: "https://monadia-bucket.sfo3.digitaloceanspaces.com/Gemini_Generated_Image_3szo3c3szo3c3szo.png"
  }
];

export const Testimonials: React.FC<TestimonialsProps> = ({ isLoggedIn, onAuthClick }) => {
  return (
    <section className="py-24 px-6 relative overflow-hidden bg-white/[0.01] border-y border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20 items-center">
        <div className="flex-1 space-y-8 text-center md:text-left">
          <div className="space-y-4">
            <p className="text-red-500 font-bold uppercase tracking-[0.4em] text-[10px]">Ce que les gens disent de nous</p>
            <p className="text-white/40 text-lg max-w-md">Rejoignez des centaines de créateurs qui ont automatisé leur business.</p>
          </div>
          
          <div className="pt-4">
            {isLoggedIn ? (
              <a href="#studio" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl border border-red-500/30 bg-red-500/5 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-500/10 transition-all group">
                Accéder au Studio <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <button 
                onClick={onAuthClick}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl gradient-amber text-white font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-xl shadow-red-500/10 group shine-effect"
              >
                Rejoindre l'Aventure <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 relative h-[500px] w-full overflow-hidden">
          {/* Vertical scroll effect via CSS animation */}
          <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
          
          <div className="space-y-6 animate-vertical-scroll">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={idx} className="glass-card p-6 rounded-[28px] border-white/5 space-y-4 hover:border-red-500/20 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} className="w-10 h-10 rounded-full border border-white/10" alt={t.name} />
                    <div>
                      <p className="text-sm font-bold flex items-center gap-1">{t.name} <CheckCircle2 className="w-3 h-3 text-red-500" /></p>
                      <p className="text-[10px] text-white/30 uppercase tracking-widest">{t.handle}</p>
                    </div>
                  </div>
                  <Twitter className="w-4 h-4 text-red-500/40" />
                </div>
                <p className="text-sm text-white/70 leading-relaxed italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes vertical-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-vertical-scroll {
          animation: vertical-scroll 30s linear infinite;
        }
        .animate-vertical-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};
