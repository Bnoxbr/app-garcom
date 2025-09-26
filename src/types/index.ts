// Types for App Garçom - Two-sided marketplace for hospitality services

export type UserRole = 'contratante' | 'profissional' | 'admin'

// A interface Profile deve conter apenas os campos da tabela 'profiles' do Supabase.
export interface Profile {
  id: string;
  updated_at?: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  website?: string;
  role?: UserRole;
}

// Exportar tipos de leilão
export type { Auction, AuctionBid } from './auction';

// --- Interfaces do Banco de Dados ---

// Tabela 'users'
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  role?: UserRole
  created_at?: string
  updated_at?: string
}

// Tabela 'contratantes'
export interface Contratante {
  id: string
  nome_fantasia: string
  cnpj: string
  endereco: string
  telefone?: string
  avatar_url?: string; // Adicionado para consistência
  // Campos adicionais do formulário de perfil
  description?: string
  document?: string
  document_type: 'cpf' | 'cnpj'
  company_name?: string
  company_address?: string
  company_contact?: string
  company_representative?: string
  payment_methods?: string[]
  saved_credit_cards?: any[]
  bitcoin_wallet?: string
  created_at?: string
  updated_at?: string
}

// Tabela 'profissionais'
export interface Profissional {
  id: string
  nome_completo?: string
  full_name?: string
  telefone: string
  bio?: string
  categoria?: string
  especialidades?: string[]
  anos_experiencia?: number
  formacao?: string[]
  disponibilidade_semanal?: object
  valor_hora?: number
  dados_mei?: object
  dados_financeiros?: object
  // Campos adicionais do formulário de perfil
  avatar_url?: string
  rating?: number
  reviews?: number
  distance?: string
  available?: boolean
  price?: string
  description?: string
  created_at?: string
  updated_at?: string
}

// Tabela 'categories'
export interface Category {
  id: string
  name: string
  icon: string
  created_at?: string
  updated_at?: string
}

// Tabela 'regioes'
export interface Regiao {
  id: string
  nome: string
  descricao?: string
  imagem_url?: string
  ativo: boolean
  created_at?: string
  updated_at?: string
}

// Tabela 'experiences'
export interface Experience {
  id: string
  titulo: string
  descricao: string
  preco: number
  duracao: number
  regiao_id: string
  categoria_id: string
  imagem_url: string
  rating?: number
  total_avaliacoes?: number
  ativo: boolean
  featured: boolean
  created_at?: string
  updated_at?: string
}

// Tabela 'bookings' (anteriormente 'servicos_realizados')
export interface Booking {
  id: string;
  service_date: string;
  price: number;
  job_description: string;
  client_id: string;
  provider_id: string;
  client?: Partial<Profile>;
  professional?: Partial<Profile>;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status?: 'unpaid' | 'paid' | 'released';
  provider_checkin_time?: string | null;
  client_checkin_time?: string | null;
  provider_checked_in?: boolean;
  client_checked_in?: boolean;
}

export interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  status: string;
  is_advance_payment: boolean;
  funds_status: 'held' | 'released' | 'refunded';
  service_confirmed_at?: string;
  created_at?: string;
}

// Tabela 'avaliacoes'
export interface Avaliacao {
  id: string
  id_servico: string
  id_avaliador: string
  id_avaliado: string
  nota: number
  comentario: string
  created_at?: string
}

// --- Interfaces de Componentes ---

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

// Dados de cartão de crédito (apenas tokens)
export interface CreditCard {
  id: string
  last_four: string
  brand: string
  holder_name: string
  expiry_month: number
  expiry_year: number
  token: string
  is_default?: boolean
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

// Tipo para mensagens
export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}