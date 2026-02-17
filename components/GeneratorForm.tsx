
import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon, Youtube, Instagram, Music, Video, FileText, Lightbulb, User, Palette, BookOpen, Layers, Type as FontIcon, CheckCircle2, Upload, ChevronRight, ChevronLeft, Loader2, AlertCircle, Terminal, Download, FileText as FileIcon, Layout, RefreshCw, Wand2, Clock, Mic, Square, Lock, AlertTriangle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { GenerationForm, Step } from '../types';
import { uploadToCloudinary } from '../services/cloudinaryService';
import { sendToWebhook, saveToHistory } from '../services/webhookService';
import { supabase } from '../services/supabaseClient';

interface GeneratorProps {
  sharedForm: GenerationForm;
  onSharedFormUpdate: (updates: GenerationForm) => void;
  onModeChange: (mode: any) => void;
  profile: any;
  user: any;
}

interface StepProps {
  form: GenerationForm;
  updateForm: (updates: Partial<GenerationForm>) => void;
  onNext: (data?: any) => void;
  onPrev: () => void;
  onFail?: () => void;
  onModeChange?: (mode: any) => void;
  profile: any;
  user: any;
}

const StepContent: React.FC<StepProps> = ({ form, updateForm, onNext, profile }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);

  const plan = profile?.plan || 'free';
  const isFree = plan === 'free';
  const maxPages = isFree ? 8 : 40;

  const sources = [
    { id: 'idea', icon: Lightbulb, label: 'Idée' },
    { id: 'text', icon: FileText, label: 'Texte' },
    { id: 'youtube', icon: Youtube, label: 'YouTube' },
    { id: 'reel', icon: Instagram, label: 'Reel' },
    { id: 'tiktok', icon: Video, label: 'TikTok' },
    { id: 'video', icon: Video, label: 'Vidéo' },
    { id: 'audio', icon: Music, label: 'Audio' },
    { id: 'vocal', icon: Mic, label: 'Vocal', locked: isFree },
  ];

  const startRecording = async () => {
    if (isFree) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
        setIsUploading(true);
        try { const url = await uploadToCloudinary(file); updateForm({ media_url: url }); } catch (error) { alert("Erreur vocal."); } finally { setIsUploading(false); }
      };
      mediaRecorder.start();
      setIsRecording(true);
      setRecordTime(0);
      timerRef.current = window.setInterval(() => setRecordTime(prev => prev + 1), 1000);
    } catch (err) { alert("Microphone inaccessible."); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current && isRecording) { mediaRecorderRef.current.stop(); setIsRecording(false); if (timerRef.current) clearInterval(timerRef.current); } };

  const handlePageChange = (val: string) => {
    const num = parseInt(val) || 0;
    if (num > maxPages) {
      updateForm({ nombre_pages: maxPages });
    } else {
      updateForm({ nombre_pages: num });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sources.map((src) => (
          <button key={src.id} type="button" disabled={src.locked} onClick={() => updateForm({ source_type: src.id as any })} className={`p-6 rounded-[28px] flex flex-col items-center gap-3 transition-all border relative overflow-hidden ${form.source_type === src.id ? 'border-red-500 bg-red-500/10 text-white shadow-lg' : 'border-white/5 bg-white/5 text-white/40 hover:bg-white/10 hover:border-white/10'} ${src.locked ? 'opacity-50' : ''}`}>
            {src.locked && <Lock className="absolute top-2 right-2 w-3 h-3 text-red-500" />}
            <src.icon className={`w-7 h-7 ${form.source_type === src.id ? 'text-red-500' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{src.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {['youtube', 'reel', 'tiktok'].includes(form.source_type) && <input type="url" placeholder="Lien source..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white focus:border-red-500/50 outline-none" value={form.media_url || ''} onChange={(e) => updateForm({ media_url: e.target.value })} />}
        {form.source_type === 'vocal' && !isFree && (
            <div className="flex flex-col items-center justify-center gap-6 p-12 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl">
              {isRecording ? (
                <div className="flex flex-col items-center gap-4">
                  <Square className="w-12 h-12 text-red-500 animate-pulse" />
                  <p className="text-2xl font-mono text-red-500 font-bold">{Math.floor(recordTime/60)}:{ (recordTime%60).toString().padStart(2,'0') }</p>
                  <button onClick={stopRecording} className="px-8 py-3 rounded-xl bg-red-500 text-white font-bold uppercase text-xs">Arrêter</button>
                </div>
              ) : <button onClick={startRecording} className="px-8 py-3 rounded-xl bg-red-500 text-white font-bold uppercase text-xs">Démarrer Vocal</button>}
            </div>
        )}
        {['idea', 'text'].includes(form.source_type) && <textarea rows={4} placeholder="Décrivez votre ebook..." className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-white focus:border-red-500/50 outline-none resize-none" value={form.source_content || ''} onChange={(e) => updateForm({ source_content: e.target.value })} />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Pages (Max {maxPages})</label>
          <div className="relative">
             <input type="number" min="1" max={maxPages} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold pr-12 outline-none" value={form.nombre_pages} onChange={(e) => handlePageChange(e.target.value)} />
             {form.nombre_pages >= maxPages && <Sparkles className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-red-500" />}
          </div>
        </div>
        <div className="space-y-3"><label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Chapitres</label><input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none" value={form.nombre_chapitres} onChange={(e) => updateForm({ nombre_chapitres: parseInt(e.target.value) || 0 })} /></div>
        <div className="space-y-3"><label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Mots/Page</label><input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold outline-none" value={form.mots_par_page} onChange={(e) => updateForm({ mots_par_page: parseInt(e.target.value) || 0 })} /></div>
      </div>

      <button onClick={() => onNext()} className="w-full py-6 rounded-2xl gradient-amber text-white font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-red-500/10">Suivant <ChevronRight className="w-6 h-6" /></button>
    </div>
  );
};

const StepNaming: React.FC<StepProps> = ({ form, updateForm, onNext, onPrev }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Titre de l'Ebook</label>
          <input type="text" placeholder="Titre..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-white text-lg focus:border-red-500/50 outline-none" value={form['1.titre']} onChange={(e) => updateForm({ '1.titre': e.target.value })} />
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Auteur</label>
          <input type="text" placeholder="Nom..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-white text-lg focus:border-red-500/50 outline-none" value={form.auteur} onChange={(e) => updateForm({ auteur: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={onPrev} className="flex-1 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase text-xs">Retour</button>
        <button onClick={() => onNext()} className="flex-[2] py-6 rounded-2xl gradient-amber text-white font-bold text-xl">Suivant</button>
      </div>
    </div>
);

const StepDesign: React.FC<StepProps> = ({ form, updateForm, onNext, onPrev, onModeChange, profile, user }) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isFree = (profile?.plan || 'free') === 'free';

  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      setIsUploading(true);
      try {
        const url = await uploadToCloudinary(file);
        updateForm({ '2. cover_url': url });
        saveToHistory(user.id, { 
          title: form['1.titre'] || 'Design Importé', 
          type: 'cover', 
          url 
        });
      } catch (error) {
        alert("Erreur lors de l'upload de la couverture.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Couverture {isFree && '(Vérouillée)'}</label>
          {isFree ? (
            <div className="glass-card p-8 rounded-[32px] border-red-500/10 space-y-4">
               <Lock className="w-6 h-6 text-red-500" />
               <p className="text-sm font-bold">Inaccessible en mode Gratuit</p>
               <p className="text-xs text-white/40">Le design de couverture est réservé aux membres payants.</p>
               <a href="#pricing" className="block text-[10px] font-bold text-red-500 pt-2 uppercase tracking-widest">Débloquer maintenant</a>
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={() => onModeChange?.('cover')} 
                className="w-full flex items-center gap-4 p-6 rounded-3xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-left transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Créer avec l'IA</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Générateur Magique</p>
                </div>
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full flex items-center gap-4 p-6 rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {isUploading ? <Loader2 className="w-6 h-6 text-white/40 animate-spin" /> : <Upload className="w-6 h-6 text-white/40" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Uploader ma Cover</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Fichier JPG / PNG</p>
                </div>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleManualUpload} className="hidden" accept="image/*" />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em]">Aperçu du Design</label>
          <div className="aspect-[2/3] glass-card rounded-[40px] overflow-hidden border border-white/10 shadow-2xl relative group">
            {form['2. cover_url'] ? (
              <>
                <img src={form['2. cover_url']} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Preview" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h4 className="font-serif text-xl leading-tight text-white mb-1">{form['1.titre']}</h4>
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/60">{form.auteur}</p>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center text-white/10 gap-4">
                <ImageIcon className="w-16 h-16 opacity-10" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em]">En attente de design</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={onPrev} className="flex-1 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase text-xs">Retour</button>
        <button onClick={() => onNext()} className="flex-[2] py-6 rounded-2xl gradient-amber text-white font-bold text-xl shadow-lg shadow-red-500/20">Suivant</button>
      </div>
    </div>
  );
};

const StepMockup: React.FC<StepProps> = ({ form, onPrev, onNext, onFail, profile, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [checking, setChecking] = useState(true);

  const checkUsage = async () => {
    if (!user) return;
    
    const plan = profile?.plan || 'free';
    const limits = { free: 1, essential: 3, abundance: 10 };
    const max = limits[plan as keyof typeof limits] || 1;

    const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed');

    if (!error && count !== null && count >= max) setLimitReached(true);
    setChecking(false);
  };

  useEffect(() => { checkUsage(); }, [profile, user]);

  const handleFinalSubmit = async () => {
    if (limitReached || !user) return;
    setIsSubmitting(true);
    const result = await sendToWebhook(form, 'ebook');
    if (result) {
      await supabase.from('orders').insert({
        user_id: user.id,
        title: form['1.titre'],
        status: 'completed',
        nombre_pages: form.nombre_pages,
        cover_url: form['2. cover_url']
      });
      
      const downloadUrl = result instanceof Blob ? URL.createObjectURL(result) : result.download_url;
      saveToHistory(user.id, { 
        title: form['1.titre'] || 'Ebook Sans Titre', 
        type: 'ebook', 
        url: downloadUrl 
      });
      onNext({ download_url: downloadUrl });
    } else { if (onFail) onFail(); }
    setIsSubmitting(false);
  };

  if (checking) return <div className="py-20 flex flex-col items-center gap-4"><Loader2 className="w-10 h-10 animate-spin text-red-500" /><p className="text-white/40 uppercase tracking-widest text-xs">Vérification...</p></div>;

  return (
    <div className="space-y-10 text-center animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-8">
        <div className="w-48 aspect-[2/3] glass-card rounded-[24px] overflow-hidden shadow-2xl relative border-red-500/20">
           {form['2. cover_url'] && <img src={form['2. cover_url']} className="absolute inset-0 w-full h-full object-cover" />}
           <div className="absolute inset-0 bg-black/40 p-4 flex flex-col justify-end text-left">
              <h4 className="font-serif text-lg leading-tight text-white">{form['1.titre']}</h4>
              <p className="text-[6px] uppercase tracking-widest text-white/50">{form.auteur}</p>
           </div>
        </div>
        <h3 className="text-3xl font-serif">Prêt pour la Production</h3>
        {limitReached && (
          <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 max-w-sm flex flex-col items-center gap-2">
             <AlertTriangle className="w-6 h-6" />
             <p className="font-bold text-sm">Limite atteinte ({profile?.plan || 'Free'})</p>
             <a href="#pricing" className="text-[10px] font-bold uppercase tracking-widest underline mt-2">Voir les tarifs</a>
          </div>
        )}
      </div>
      <div className="flex gap-4">
        <button onClick={onPrev} disabled={isSubmitting} className="flex-1 py-6 rounded-2xl bg-white/5 border border-white/10 text-white font-bold uppercase text-xs">Modifier</button>
        <button onClick={handleFinalSubmit} disabled={isSubmitting || limitReached} className={`flex-[2] py-6 rounded-2xl font-bold text-xl ${limitReached ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'gradient-amber text-white shadow-xl shadow-red-500/20'}`}>
          {isSubmitting ? <Loader2 className="w-7 h-7 animate-spin mx-auto" /> : (limitReached ? "Limite Atteinte" : "Lancer la production")}
        </button>
      </div>
    </div>
  );
};

const DashboardStep: React.FC<{ resultData: any; onNext: () => void }> = ({ resultData, onNext }) => {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(() => setIsFinished(true), 500); return 100; }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 text-center py-10 animate-in fade-in duration-700">
      <h3 className="text-3xl font-serif">Production en cours</h3>
      <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90"><circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" /><circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (progress / 100) * 440} className="text-red-500 transition-all duration-300" /></svg>
        <span className="absolute text-2xl font-bold text-white">{progress}%</span>
      </div>
      {isFinished && (
        <button onClick={() => { const a = document.createElement('a'); a.href = resultData.download_url; a.download = "Ebook_Elite.pdf"; a.click(); onNext(); }} className="w-full py-6 rounded-2xl gradient-amber text-white font-bold text-xl flex items-center justify-center gap-4 animate-bounce">
          <Download className="w-6 h-6" /> Télécharger mon Ebook
        </button>
      )}
    </div>
  );
}

const SuccessStep: React.FC<{ onGoToDashboard: () => void }> = ({ onGoToDashboard }) => (
  <div className="flex flex-col items-center text-center gap-10 py-16 animate-in zoom-in">
    <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30"><CheckCircle2 className="w-12 h-12 text-emerald-500" /></div>
    <div className="space-y-4"><h2 className="text-4xl font-serif">Actif Créé !</h2><p className="text-white/40 max-w-sm">Votre produit digital a été ajouté à votre coffre-fort Elite.</p></div>
    <div className="flex gap-4 w-full max-w-md">
      <button onClick={() => window.location.reload()} className="flex-1 py-5 rounded-2xl border border-white/10 text-white font-bold uppercase text-xs">Nouveau Projet</button>
      <button onClick={onGoToDashboard} className="flex-1 py-5 rounded-2xl bg-white/5 text-white font-bold uppercase text-xs">Mes Archives</button>
    </div>
  </div>
);

export const GeneratorForm: React.FC<GeneratorProps> = ({ sharedForm, onSharedFormUpdate, onModeChange, profile, user }) => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.CONTENT);
  const [resultData, setResultData] = useState<any>(null);
  const updateForm = (u: any) => onSharedFormUpdate({ ...sharedForm, ...u });
  const next = (d?: any) => { if (d) setResultData(d); setCurrentStep(s => s + 1); };
  const prev = () => setCurrentStep(s => s - 1);
  const fail = () => setCurrentStep(Step.ERROR);

  return (
    <div className="max-w-3xl mx-auto">
      {currentStep === Step.CONTENT && <StepContent form={sharedForm} updateForm={updateForm} onNext={next} onPrev={prev} profile={profile} user={user} />}
      {currentStep === Step.NAMING && <StepNaming form={sharedForm} updateForm={updateForm} onNext={next} onPrev={prev} profile={profile} user={user} />}
      {currentStep === Step.DESIGN && <StepDesign form={sharedForm} updateForm={updateForm} onNext={next} onPrev={prev} onModeChange={onModeChange} profile={profile} user={user} />}
      {currentStep === Step.MOCKUP && <StepMockup form={sharedForm} updateForm={updateForm} onPrev={prev} onNext={next} onFail={fail} profile={profile} user={user} />}
      {currentStep === Step.DASHBOARD && <DashboardStep resultData={resultData} onNext={() => next()} />}
      {currentStep === Step.SUCCESS && <SuccessStep onGoToDashboard={() => onModeChange('history')} />}
      {currentStep === Step.ERROR && <div className="py-20 text-center"><AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" /><h2 className="text-3xl font-serif mb-6">Erreur Technique</h2><button onClick={() => setCurrentStep(Step.MOCKUP)} className="px-10 py-4 rounded-xl gradient-amber font-bold">Réessayer</button></div>}
    </div>
  );
};
