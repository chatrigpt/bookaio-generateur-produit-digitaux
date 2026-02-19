
import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, Image as ImageIcon, Box, Megaphone, Loader2, Upload, ChevronRight, CheckCircle2, Layout, Download, Clock, History, Trash2, ExternalLink, Type as TextIcon, Sparkles, Lock, Zap, Video, Play, FileText, AlertTriangle } from 'lucide-react';
import { GeneratorForm } from './GeneratorForm';
import { sendToWebhook, saveToHistory } from '../services/webhookService';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { GenerationForm, GeneratedItem } from '../types';
import { supabase } from '../services/supabaseClient';

type StudioMode = 'cover' | 'ebook' | 'mockup' | 'ad' | 'video' | 'history';

interface StudioProps {
  user: any;
  profile: any;
  onAuthRequired: () => void;
}

export const Studio: React.FC<StudioProps> = ({ user, profile, onAuthRequired }) => {
  const [mode, setMode] = useState<StudioMode>('cover');
  const [usageCount, setUsageCount] = useState(0);
  const [ebookForm, setEbookForm] = useState<GenerationForm>({
    nombre_pages: 5, nombre_chapitres: 3, mots_par_page: 300, avec_image: true,
    auteur: '', '1.titre': '', '2. cover_url': '', source_type: 'idea',
  });

  const plan = profile?.plan || 'free';
  const limits = { free: 1, essential: 3, abundance: 10 };
  const currentLimit = limits[plan as keyof typeof limits] || 1;

  const fetchUsage = async () => {
    if (!user) return;
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'completed');
    setUsageCount(count || 0);
  };

  useEffect(() => { fetchUsage(); }, [user, profile]);

  return (
    <section id="studio" className="py-24 px-6 relative min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card mb-12 p-8 rounded-[40px] border-red-500/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl -z-10" />
           <div className="flex items-center gap-6">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${plan !== 'free' ? 'gradient-amber shadow-red-500/40 rotate-12' : 'bg-white/5 border border-white/10'}`}>
                {plan === 'free' ? <Lock className="w-8 h-8 text-white/20" /> : <Zap className="w-8 h-8 text-white" />}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 mb-1">Status de Privilège</p>
                <h3 className="text-2xl font-serif">Plan <span className="capitalize text-white">{plan}</span> Elite</h3>
              </div>
           </div>
           <div className="flex-1 w-full max-w-md space-y-3">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                <span className="text-white/40">Consommation Ebooks</span>
                <span className="text-red-500">{usageCount} / {currentLimit}</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div className={`h-full rounded-full transition-all duration-1000 shadow-lg ${usageCount >= currentLimit ? 'bg-zinc-600' : 'gradient-amber shadow-red-500/30'}`} style={{ width: `${Math.min((usageCount / currentLimit) * 100, 100)}%` }} />
              </div>
           </div>
           {usageCount >= currentLimit && <a href="#pricing" className="px-8 py-4 rounded-2xl gradient-amber text-white font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Upgrade</a>}
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-80 space-y-2 sticky top-32">
            {[
              { id: 'cover', icon: ImageIcon, label: 'Design de Cover' },
              { id: 'ebook', icon: BookOpen, label: "Générer l'Ebook" },
              { id: 'mockup', icon: Box, label: 'Mockup 3D Elite' },
              { id: 'ad', icon: Megaphone, label: 'Arsenal Publicitaire' },
              { id: 'history', icon: History, label: 'Archives & Logs' },
            ].map((m) => (
              <button key={m.id} disabled={m.locked} onClick={() => setMode(m.id as any)} className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all border ${mode === m.id ? 'bg-red-500/10 border-red-500/40 text-white' : 'hover:bg-white/5 border-transparent text-white/40'} ${m.locked ? 'opacity-30 cursor-not-allowed' : ''}`}>
                <div className="flex items-center gap-4"><m.icon className={`w-5 h-5 ${mode === m.id ? 'text-red-500' : ''}`} /> <span className="font-bold text-sm">{m.label}</span></div>
                {m.locked ? <Lock className="w-3 h-3" /> : <ChevronRight className="w-4 h-4 opacity-30" />}
              </button>
            ))}
          </div>

          <div className="flex-1 w-full">
            <div className="glass-card rounded-[48px] p-8 md:p-14 relative overflow-hidden border-red-500/5 min-h-[600px]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[100px] -z-10 rounded-full" />
              {mode === 'ebook' && <GeneratorForm sharedForm={ebookForm} onSharedFormUpdate={setEbookForm} onModeChange={setMode} profile={profile} user={user} />}
              {mode === 'cover' && <CoverForm onUseInEbook={(url) => { setEbookForm({ ...ebookForm, '2. cover_url': url }); setMode('ebook'); }} user={user} profile={profile} />}
              {mode === 'mockup' && <MockupForm user={user} profile={profile} />}
              {mode === 'ad' && <AdForm user={user} profile={profile} />}
              {mode === 'video' && <VideoForm user={user} profile={profile} />}
              {mode === 'history' && <HistoryUI user={user} />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// HELPER: Convertit le Blob binaire en URL Cloudinary et enregistre dans les Logs
const persistAndLog = async (userId: string, blob: Blob, title: string, type: any, filename: string) => {
  const file = new File([blob], filename, { type: blob.type });
  const url = await uploadToCloudinary(file);
  saveToHistory(userId, { title, type, url });
  return url;
};

const CoverForm: React.FC<{ onUseInEbook: (url: string) => void; user: any; profile: any }> = ({ onUseInEbook, user, profile }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [prompt, setPrompt] = useState('');
  const [refUrl, setRefUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const blob = await sendToWebhook({ prompt, refUrl, type: 'cover' }, 'cover');
    if (blob instanceof Blob && user) {
      setResult(blob);
      await persistAndLog(user.id, blob, `Cover: ${prompt.slice(0, 30)}`, 'cover', 'cover_ia.png');
    }
    setLoading(false);
  };

  const handleRefUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setLoading(true); const url = await uploadToCloudinary(file); setRefUrl(url); setLoading(false); }
  };

  if (result) return <SuccessUI onReset={() => setResult(null)} title="Design Terminé" blob={result} filename="cover.png" onUseInEbook={onUseInEbook} user={user} />;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
      <div className="space-y-3"><h3 className="text-4xl font-serif">Direction Artistique</h3><p className="text-white/40 text-lg">Générez un visuel iconique (Attente max 5 min).</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <textarea required rows={6} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Décrivez l'univers visuel souhaité..." className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-white focus:border-red-500/30 outline-none resize-none text-lg" />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="h-full min-h-[160px] border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center hover:bg-white/5 transition-all">
          {refUrl ? <img src={refUrl} className="h-full w-full object-cover rounded-3xl" /> : <><Upload className="text-red-500" /> <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Inspiration (Optionnel)</span></>}
        </button>
        <input type="file" ref={fileInputRef} onChange={handleRefUpload} className="hidden" accept="image/*" />
      </div>
      <button disabled={loading} className="w-full py-6 rounded-2xl gradient-amber text-white font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-red-500/10">
        {loading ? <div className="flex items-center gap-3"><Loader2 className="animate-spin" /> Production en cours...</div> : <><Sparkles className="w-6 h-6" /> Générer la Couverture</>}
      </button>
    </form>
  );
};

const MockupForm: React.FC<{ user: any; profile: any }> = ({ user, profile }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [mockupType, setMockupType] = useState('solo');
  const [coverUrl, setCoverUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!coverUrl) return alert("Veuillez d'abord importer une couverture.");
    setLoading(true);
    const blob = await sendToWebhook({ coverUrl, mockupType }, 'mockup');
    if (blob instanceof Blob && user) {
      setResult(blob);
      await persistAndLog(user.id, blob, `Mockup 3D (${mockupType})`, 'mockup', 'mockup_elite.png');
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setLoading(true); const url = await uploadToCloudinary(file); setCoverUrl(url); setLoading(false); }
  };

  if (result) return <SuccessUI onReset={() => setResult(null)} title="Mockup Prêt" blob={result} filename="mockup.png" user={user} />;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-3"><h3 className="text-4xl font-serif">Mise en Scène 3D</h3><p className="text-white/40 text-lg">Convertissez votre design en un objet tangible haute définition.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <button onClick={() => fileInputRef.current?.click()} className="h-64 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center group overflow-hidden relative">
          {coverUrl ? <img src={coverUrl} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <><Upload className="text-red-500 mb-2" /> <span className="text-xs font-bold uppercase text-white/40 tracking-widest">Importer Cover</span></>}
        </button>
        <div className="space-y-4">
          <label className="text-xs font-bold uppercase text-white/40 tracking-widest">Type de Rendu</label>
          <div className="grid grid-cols-2 gap-3">
            {['solo', 'pack', 'tablet', 'box'].map(t => (
              <button key={t} onClick={() => setMockupType(t)} className={`p-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${mockupType === t ? 'border-red-500 bg-red-500/10 text-white shadow-lg shadow-red-500/10' : 'border-white/10 hover:bg-white/5 text-white/40'}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
      <button onClick={handleSubmit} disabled={loading || !coverUrl} className="w-full py-6 rounded-2xl gradient-amber text-white font-bold text-xl flex items-center justify-center gap-3 shadow-xl">
        {loading ? <div className="flex items-center gap-3"><Loader2 className="animate-spin" /> Rendu 3D en cours...</div> : "Lancer le Rendu Elite"}
      </button>
    </div>
  );
};

const AdForm: React.FC<{ user: any; profile: any }> = ({ user, profile }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [refImg, setRefImg] = useState('');
  const [description, setDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    setLoading(true);
    const blob = await sendToWebhook({ refImg, description }, 'ad');
    if (blob instanceof Blob && user) {
      setResult(blob);
      await persistAndLog(user.id, blob, `Arsenal Ad: ${description.slice(0, 20)}`, 'ad', 'ad_pro.png');
    }
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setLoading(true); const url = await uploadToCloudinary(file); setRefImg(url); setLoading(false); }
  };

  if (result) return <SuccessUI onReset={() => setResult(null)} title="Visuel Prêt" blob={result} filename="ad.png" user={user} />;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-3"><h3 className="text-4xl font-serif">Arsenal Publicitaire</h3><p className="text-white/40 text-lg">Générez des affiches marketing à haut taux de conversion.</p></div>
      <div className="space-y-8">
        <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez votre offre ou vos arguments marketing..." className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 text-white focus:border-red-500/40 outline-none resize-none text-lg" />
        <button onClick={() => fileInputRef.current?.click()} className="w-full h-48 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center hover:bg-white/5 transition-all">
            {refImg ? <img src={refImg} className="h-full w-full object-contain p-4" /> : <><Upload className="text-red-500 w-8 h-8 mb-4" /> <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Uploader Cover</span></>}
        </button>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
      <button onClick={handleSubmit} disabled={loading} className="w-full py-6 rounded-2xl gradient-amber text-white font-bold text-xl shadow-2xl shadow-red-500/20">
        {loading ? <div className="flex items-center gap-3"><Loader2 className="animate-spin" /> Création en cours...</div> : "Générer mon Arsenal"}
      </button>
    </div>
  );
};

const VideoForm: React.FC<{ user: any; profile: any }> = ({ user, profile }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    const blob = await sendToWebhook({ description, type: 'video' }, 'video');
    if (blob instanceof Blob && user) {
      setResult(blob);
      await persistAndLog(user.id, blob, `Vidéo Promo Elite`, 'video', 'promo_elite.mp4');
    }
    setLoading(false);
  };

  if (result) return <SuccessUI onReset={() => setResult(null)} title="Vidéo Générée" blob={result} filename="promo.mp4" user={user} />;

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="space-y-3"><h3 className="text-4xl font-serif">Production Vidéo Elite</h3><p className="text-white/40 text-lg">Créez un spot publicitaire cinématographique (Attente max 5 min).</p></div>
      <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Décrivez l'ambiance, les textes et le style de la vidéo promo..." className="w-full bg-white/5 border border-white/10 rounded-[32px] p-8 text-white focus:border-red-500/40 outline-none resize-none text-lg" />
      <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/20 flex items-start gap-4">
         <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-1" />
         <p className="text-xs text-white/60 leading-relaxed">La production vidéo est un processus lourd. Ne fermez pas votre onglet. Nous avons augmenté le délai d'attente à 5 minutes pour garantir la réception du fichier.</p>
      </div>
      <button onClick={handleSubmit} disabled={loading} className="w-full py-6 rounded-2xl gradient-amber text-white font-bold text-xl shadow-2xl shadow-red-500/20">
        {loading ? <div className="flex items-center gap-3 justify-center"><Loader2 className="animate-spin" /> Rendu vidéo cinématographique (5min max)...</div> : "Lancer la production vidéo"}
      </button>
    </div>
  );
};

const HistoryUI: React.FC<{ user: any }> = ({ user }) => {
  const [history, setHistory] = useState<GeneratedItem[]>([]);
  const loadHistory = () => { if (user) setHistory(JSON.parse(localStorage.getItem(`bookaio_history_${user.id}`) || '[]')); };
  
  useEffect(() => { 
    loadHistory();
    window.addEventListener('historyUpdated', loadHistory);
    return () => window.removeEventListener('historyUpdated', loadHistory);
  }, [user]);
  
  const clear = () => { if(confirm("Voulez-vous vider définitivement vos archives ?")) { localStorage.removeItem(`bookaio_history_${user.id}`); setHistory([]); } };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div><h3 className="text-3xl font-serif">Laboratoire d'Archives</h3><p className="text-white/40 text-sm">Tous vos actifs (Images, Vidéos, PDF) sauvegardés durablement.</p></div>
        <button onClick={clear} className="p-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
      </div>
      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] flex flex-col items-center gap-4">
             <Clock className="w-12 h-12 text-white/5" />
             <p className="text-white/20 font-bold uppercase tracking-widest text-[10px]">Votre coffre-fort est vide</p>
          </div>
        ) : history.map(item => (
          <div key={item.id} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all hover:border-red-500/20">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                {item.type === 'ebook' ? <FileText className="w-5 h-5 text-red-500" /> : item.type === 'video' ? <Play className="w-5 h-5 text-red-500" /> : <Layout className="w-5 h-5 text-red-500" />}
              </div>
              <div><p className="text-sm font-bold text-white truncate max-w-[200px]">{item.title}</p><p className="text-[10px] text-white/20 uppercase tracking-widest">{item.type} • {new Date(item.timestamp).toLocaleString()}</p></div>
            </div>
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500 hover:text-white transition-all"><ExternalLink className="w-5 h-5" /></a>
          </div>
        ))}
      </div>
    </div>
  );
};

const SuccessUI: React.FC<{ onReset: () => void; title: string; blob: Blob | null; filename: string; onUseInEbook?: (url: string) => void; user: any }> = ({ onReset, title, blob, filename, onUseInEbook, user }) => {
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const isVideo = filename.endsWith('.mp4');

  useEffect(() => { if (blob) { const url = URL.createObjectURL(blob); setMediaUrl(url); return () => URL.revokeObjectURL(url); } }, [blob]);
  
  return (
    <div className="flex flex-col items-center text-center gap-10 py-16 animate-in zoom-in">
      <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30 shadow-[0_0_30px_rgba(225,29,72,0.2)]"><CheckCircle2 className="w-12 h-12 text-red-500" /></div>
      <div className="space-y-2">
        <h3 className="text-4xl font-serif">{title}</h3>
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em]">Actif sauvegardé dans votre Coffre-fort</p>
      </div>
      {mediaUrl && (
        <div className="w-full max-w-md aspect-video rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-black/40">
          {isVideo ? <video src={mediaUrl} controls className="w-full h-full object-contain" /> : <img src={mediaUrl} className="w-full h-full object-cover" />}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
        <button onClick={() => { const a = document.createElement('a'); a.href = mediaUrl!; a.download = filename; a.click(); }} className="py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
           <Download className="w-4 h-4" /> Télécharger mon Actif
        </button>
        <button onClick={onReset} className="py-5 rounded-2xl border border-white/10 text-white/40 font-bold uppercase text-[10px] tracking-widest hover:bg-white/5 transition-all">Nouveau Projet</button>
      </div>
    </div>
  );
};
