// useProfessionals.ts

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/index'

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = async () => {
    try {
      setLoading(true)

      // --- CORREÇÃO AQUI: Trocamos 'profiles' por 'professionals'
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name') // Ordena por 'full_name', que é o nome correto da coluna
      
      if (error) {
        console.error('Supabase error:', error);
        setError(error.message)
        setLoading(false)
        return
      }

      console.log('Supabase data:', data);
      
      setProfessionals(data || [])
      setLoading(false)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar profissionais')
      setLoading(false)
      console.error('Erro ao buscar profissionais:', err)
    }
  }

  useEffect(() => {
    fetchProfessionals()
  }, [])

  const refetch = () => {
    fetchProfessionals()
  }

  return {
    professionals,
    loading,
    error,
    refetch
  }
}