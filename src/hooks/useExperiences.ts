import { useState, useEffect } from 'react'
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
        // Fallback data when Supabase tables don't exist yet
        console.warn('Supabase experiences table not found, using fallback data')
        setExperiences([
          {
            id: '1',
            titulo: 'Jantar Romântico com Chef Particular',
            descricao: 'Experiência gastronômica única com chef especializado preparando um menu degustação para duas pessoas.',
            preco: 350.00,
            duracao: 180,
            imagem_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
            rating: 4.8,
            total_avaliacoes: 45,
            ativo: true,
            featured: true
          },
          {
            id: '2',
            titulo: 'Coquetelaria Artesanal em Casa',
            descricao: 'Bartender profissional prepara drinks exclusivos no conforto da sua casa com ingredientes premium.',
            preco: 280.00,
            duracao: 120,
            imagem_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
            rating: 4.9,
            total_avaliacoes: 67,
            ativo: true,
            featured: true
          },
          {
            id: '3',
            titulo: 'Serviço de Garçom para Eventos',
            descricao: 'Garçom experiente para atendimento em eventos corporativos e sociais com excelência no serviço.',
            preco: 120.00,
            duracao: 240,
            imagem_url: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop',
            rating: 4.7,
            total_avaliacoes: 89,
            ativo: true,
            featured: true
          }
        ])
        setError(null)
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

  const fetchFeaturedExperiences = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .rpc('get_random_featured_experiences', { limit_count: limit })

      if (error) {
        // Fallback para experiências em destaque
        console.warn('Supabase RPC not found, using fallback featured experiences')
        setFeaturedExperiences([
          {
            id: '1',
            titulo: 'Jantar Romântico com Chef Particular',
            descricao: 'Experiência gastronômica única com chef especializado.',
            preco: 350.00,
            duracao: 180,
            imagem_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop',
            rating: 4.8,
            total_avaliacoes: 45,
            ativo: true,
            featured: true
          },
          {
            id: '2',
            titulo: 'Coquetelaria Artesanal em Casa',
            descricao: 'Bartender profissional prepara drinks exclusivos.',
            preco: 280.00,
            duracao: 120,
            imagem_url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
            rating: 4.9,
            total_avaliacoes: 67,
            ativo: true,
            featured: true
          }
        ])
        setError(null)
        return
      }

      setFeaturedExperiences(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar experiências em destaque')
      console.error('Erro ao buscar experiências em destaque:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeaturedExperiences()
  }, [limit])

  return {
    featuredExperiences,
    loading,
    error,
    refetch: fetchFeaturedExperiences
  }
}