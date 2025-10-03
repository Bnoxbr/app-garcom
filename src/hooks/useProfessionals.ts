import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Profissional, UserRole } from '../types/index'; 

// Esta interface PRECISA incluir TODOS os campos ricos que a RPC retorna
export interface ProfessionalWithProfile extends Profissional {
    full_name: string;
    role: UserRole;
    
    // CAMPOS RICOS DO BACKEND
    average_rating?: number; 
    total_reviews?: number;
    valor_hora?: number;
    is_available?: boolean;
}

export function useProfessionals() {
    // DECLARAÇÃO DOS ESTADOS QUE FALTARAM (RESOLVE O ReferenceError)
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

    // RETORNO COMPLETO, INCLUINDO loading e error
    return { professionals, loading, error, fetchProfessionals };
}