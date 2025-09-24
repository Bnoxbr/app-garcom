import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profissional, UserRole } from '../types/index';

// Combinando as interfaces para o resultado esperado
export interface ProfessionalWithProfile extends Profissional {
  // These fields come from the 'profiles' table via the RPC function
  full_name: string;
  role: UserRole;
}

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<ProfessionalWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfessionals = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('get_all_professionals_with_profiles');

      if (rpcError) {
        console.error('Erro ao buscar profissionais via RPC:', rpcError);
        throw new Error(`Erro na chamada RPC: ${rpcError.message}`);
      }

      setProfessionals(data || []);

    } catch (err: any) {
      console.error('Falha ao buscar profissionais:', err);
      setError(err.message || 'Ocorreu um erro ao carregar os profissionais.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessionals();
  }, [fetchProfessionals]);

  return { professionals, loading, error, fetchProfessionals };
}