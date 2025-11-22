import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export interface Experience {
  id: string
  titulo: string
  descricao?: string
  preco?: number
  duracao?: number // em minutos
  regiao_id?: string
  categoria_id?: string
  imagem_url?: string
  rating: number
  total_avaliacoes: number
  ativo: boolean
  featured: boolean
  created_at?: string
  updated_at?: string
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false })

      if (error) {
        setError(error.message)
        setExperiences([])
        setLoading(false)
        return
      }

      setExperiences(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar experiências')
      console.error('Erro ao buscar experiências:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  return {
    experiences,
    loading,
    error,
    refetch: fetchExperiences
  }
}

// Hook específico para experiências em destaque (usando RPC)
export function useFeaturedExperiences(limit: number = 6) {
  const [featuredExperiences, setFeaturedExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeaturedExperiences = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .rpc('get_random_featured_experiences', { limit_count: limit })

      if (error) {
        setError(error.message)
        setFeaturedExperiences([])
        setLoading(false)
        return
      }

      setFeaturedExperiences(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar experiências em destaque')
      console.error('Erro ao buscar experiências em destaque:', err)
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetchFeaturedExperiences()
  }, [fetchFeaturedExperiences])

  return {
    featuredExperiences,
    loading,
    error,
    refetch: fetchFeaturedExperiences
  }
}
