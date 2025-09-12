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
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('name')

      if (error) {
        // Define o estado de erro e desativa o carregamento
        setError(error.message)
        setLoading(false)
        return // Termina a execução para não ir para o próximo bloco
      }

      // Define os dados e desativa o carregamento
      setProfessionals(data || [])
      setLoading(false)
    } catch (err) {
      // Em caso de erro de rede ou outro problema, lide com o erro aqui
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