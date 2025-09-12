// Types for Mr. Staffer - Two-sided marketplace for hospitality services

export type UserRole = 'contratante' | 'prestador' | 'admin'

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

// Especialidades de hospitalidade
export interface Specialty {
  id: string
  name: string
  category: 'garcom' | 'chef' | 'bartender' | 'sommelier' | 'copeiro' | 'auxiliar_cozinha'
  description?: string
}

// Dados bancários
export interface BankingData {
  pix_key?: string
  pix_type?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random'
  bitcoin_address?: string
  bank_name?: string
  bank_agency?: string
  bank_account?: string
  bank_account_type?: 'corrente' | 'poupanca'
}

// Endereço completo
export interface Address {
  cep: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  country: string
}

// Profissional atualizado para Mr. Staffer
export interface Professional {
  id: string
  name: string
  category: string
  specialties?: string[]
  rating: number
  reviews: number
  distance?: string
  available: boolean
  image?: string
  price?: string
  description?: string
  created_at?: string
  updated_at?: string
}

// Profile expandido para Mr. Staffer
export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  avatar_url?: string
  phone?: string
  bio?: string

  // Documentação
  document: string
  document_type: 'cpf' | 'cnpj'
  mei_number?: string

  // Endereço
  address?: Address

  // Para prestadores
  specialties?: string[]
  hourly_rate?: number
  experience_years?: number
  portfolio_images?: string[]

  // Dados bancários
  banking_data?: BankingData

  // Avaliações
  rating?: number
  reviews_count?: number

  // Status
  verified: boolean
  available: boolean

  created_at: string
  updated_at: string
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