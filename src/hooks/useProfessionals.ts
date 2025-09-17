// useProfessionals.ts

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Professional } from '../types/index'

export const useProfessionals = () => {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfessionals = async () => {
    try {
      setLoading(true)

      // Busca todos os profissionais da tabela 'professionals'
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name') // Ordena por 'name', que é o nome da coluna na tabela
      
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