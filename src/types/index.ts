// Types for the application

export interface Regiao {
  id: string
  nome: string
  descricao?: string
  imagem_url?: string
  ativo: boolean
  created_at?: string
  updated_at?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  created_at?: string
  updated_at?: string
}

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

export interface Professional {
  id: string
  name: string
  category: string
  rating: number
  distance: string
  available: boolean
  image_url?: string
  created_at?: string
  updated_at?: string
}

export interface Profile {
  id: string
  full_name?: string
  avatar_url?: string
  phone?: string
  address?: string
  bio?: string
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  created_at?: string
  updated_at?: string
}

export interface Booking {
  id: string
  user_id: string
  professional_id: string
  service_date: string
  service_time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  created_at?: string
  updated_at?: string
}