
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.7';

// Nouveaux identifiants fournis
const supabaseUrl = 'https://rkixjkwjgwzkrubvsipa.supabase.co';
const supabaseAnonKey = 'sb_publishable_RLH07P2NFPiQsDqHEsaOSQ_fMHwZLFT';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
