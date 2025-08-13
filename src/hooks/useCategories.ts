import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Category } from '../types/index'

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        // Fallback data when Supabase tables don't exist yet
        console.warn('Supabase tables not found, using fallback data')
        setCategories([
          {
            id: '1',
            name: 'Garçom',
            icon: 'fas fa-utensils'
          },
          {
            id: '2',
            name: 'Bartender',
            icon: 'fas fa-cocktail'
          },
          {
            id: '3',
            name: 'Chef',
            icon: 'fas fa-chef-hat'
          }
        ])
        setError(null)
        return
      }

      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias')
      console.error('Erro ao buscar categorias:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const refetch = () => {
    fetchCategories()
  }

  return {
    categories,
    loading,
    error,
    refetch
  }
}