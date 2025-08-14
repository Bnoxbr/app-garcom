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
          },
          {
            id: '3',
            name: 'Carlos Oliveira',
            category: 'Chef',
            rating: 4.7,
            distance: '3.1 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '4',
            name: 'Ana Costa',
            category: 'Garçom',
            rating: 4.6,
            distance: '1.5 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '5',
            name: 'Pedro Almeida',
            category: 'Sommelier',
            rating: 4.9,
            distance: '4.2 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '6',
            name: 'Lucia Ferreira',
            category: 'Copeiro',
            rating: 4.5,
            distance: '2.7 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '7',
            name: 'Roberto Lima',
            category: 'Auxiliar de Cozinha',
            rating: 4.4,
            distance: '3.8 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '8',
            name: 'Marcos Souza',
            category: 'Garçom',
            rating: 4.7,
            distance: '1.9 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '9',
            name: 'Camila Dias',
            category: 'Chef',
            rating: 4.9,
            distance: '2.8 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '10',
            name: 'Rafael Mendes',
            category: 'Bartender',
            rating: 4.8,
            distance: '2.1 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '11',
            name: 'Fernanda Silva',
            category: 'Recepcionista',
            rating: 4.6,
            distance: '1.7 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '12',
            name: 'Diego Santos',
            category: 'Segurança',
            rating: 4.5,
            distance: '3.5 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face'
          },
          {
            id: '13',
            name: 'Juliana Rocha',
            category: 'Hostess',
            rating: 4.7,
            distance: '2.3 km',
            available: true,
            image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face'
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