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
        setError(error.message)
        setCategories([]) // Limpa as categorias em caso de erro
        setLoading(false)
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