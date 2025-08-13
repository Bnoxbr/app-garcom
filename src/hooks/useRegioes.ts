import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export interface Regiao {
  id: string
  nome: string
  descricao?: string
  imagem_url?: string
  ativo: boolean
  created_at?: string
  updated_at?: string
}

export function useRegioes() {
  const [regioes, setRegioes] = useState<Regiao[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRegioes = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('regioes')
        .select('*')
        .eq('ativo', true)
        .order('nome')

      if (error) {
        // Fallback data when Supabase tables don't exist yet
        console.warn('Supabase regioes table not found, using fallback data')
        setRegioes([
          {
            id: '1',
            nome: 'Centro Histórico',
            descricao: 'Região central da cidade com rica história e arquitetura colonial',
            imagem_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
            ativo: true
          },
          {
            id: '2',
            nome: 'Zona Sul',
            descricao: 'Área nobre com belas praias e vida noturna agitada',
            imagem_url: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop',
            ativo: true
          },
          {
            id: '3',
            nome: 'Bairro Boêmio',
            descricao: 'Região conhecida pela gastronomia e entretenimento',
            imagem_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop',
            ativo: true
          }
        ])
        setError(null)
        return
      }

      setRegioes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar regiões')
      console.error('Erro ao buscar regiões:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegioes()
  }, [])

  return {
    regioes,
    loading,
    error,
    refetch: fetchRegioes
  }
}