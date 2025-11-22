import { createClient } from '@supabase/supabase-js';

// Leitura das variáveis
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validação Crítica
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('🚨 ERRO FATAL: Variáveis de ambiente ausentes.');
  throw new Error('Missing Supabase environment variables');
}

// [CONFIGURAÇÃO ESTÁVEL]
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true, // Deixe o Supabase gerenciar a renovação
    persistSession: true,
    detectSessionInUrl: false, // <--- MUITO IMPORTANTE: FALSE para evitar loop com React Router
  },
  global: {
    headers: { 
      'apikey': supabaseAnonKey,
    },
  },
});