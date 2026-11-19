import { createClient } from '@supabase/supabase-js';

// Compatible à la fois avec Vite (import.meta.env) et Node.js (process.env / fallback direct)
const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  process.env.VITE_SUPABASE_URL ||
  'https://zluyajawlefypnsgzeqx.supabase.co';

const supabaseKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_glAkrvjzdvbRAm_-Qkmmfw_wUl17zJR';

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL ou clé publiable manquante !");
}

export const supabase = createClient(supabaseUrl, supabaseKey);
