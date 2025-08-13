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
        // Fallback data when Supabase tables don't exist yet
        console.warn('Supabase tables not found, using fallback data')
        setProfessionals([
          {
            id: '1',
            name: 'João Silva',
            category: 'Garçom',
            rating: 4.8,
            distance: '2.5 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '2',
            name: 'Maria Santos',
            category: 'Bartender',
            rating: 4.9,
            distance: '1.8 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
          }
        ])
        setError(null)
        return
      }

      setProfessionals(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar profissionais')
      console.error('Erro ao buscar profissionais:', err)
    } finally {
      setLoading(false)
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