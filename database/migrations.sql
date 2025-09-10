-- Criação das tabelas para o LocalGuia (App Garçom)

-- Tabela de regiões
CREATE TABLE IF NOT EXISTS regioes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  imagem_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de experiências
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(300) NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2),
  duracao INTEGER, -- em minutos
  regiao_id UUID REFERENCES regioes(id),
  categoria_id UUID REFERENCES categories(id),
  imagem_url TEXT,
  rating DECIMAL(2,1) DEFAULT 0,
  total_avaliacoes INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de profissionais
CREATE TABLE IF NOT EXISTS professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  distance VARCHAR(20),
  available BOOLEAN DEFAULT true,
  image TEXT,
  description TEXT,
  price VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de perfis de usuários (estende auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name VARCHAR(200),
  avatar_url TEXT,
  phone VARCHAR(20),
  address TEXT,
  bio TEXT,
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'provider', 'admin')),
  document VARCHAR(20),
  document_type VARCHAR(10) CHECK (document_type IN ('cpf', 'cnpj')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários (mantida para compatibilidade)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(200) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  service_date DATE NOT NULL,
  service_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL CHECK (method IN ('pix', 'credit_card', 'debit_card', 'bitcoin')),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transaction_id VARCHAR(100),
  payment_url TEXT,
  qr_code TEXT,
  customer_name VARCHAR(200),
  customer_email VARCHAR(255),
  customer_document VARCHAR(20),
  description TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_professionals_category ON professionals(category);
CREATE INDEX IF NOT EXISTS idx_professionals_available ON professionals(available);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_professional_id ON bookings(professional_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(method);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Função RPC para buscar experiências em destaque aleatórias
CREATE OR REPLACE FUNCTION get_random_featured_experiences(limit_count INTEGER DEFAULT 6)
RETURNS TABLE (
  id UUID,
  titulo VARCHAR,
  descricao TEXT,
  preco DECIMAL,
  duracao INTEGER,
  regiao_id UUID,
  categoria_id UUID,
  imagem_url TEXT,
  rating DECIMAL,
  total_avaliacoes INTEGER,
  ativo BOOLEAN,
  featured BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT e.*
  FROM experiences e
  WHERE e.featured = true AND e.ativo = true
  ORDER BY RANDOM()
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_regioes_updated_at BEFORE UPDATE ON regioes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas RLS (Row Level Security)
ALTER TABLE regioes ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Políticas para regioes (leitura pública)
CREATE POLICY "Regiões são visíveis para todos" ON regioes FOR SELECT USING (true);

-- Políticas para categories (leitura pública)
CREATE POLICY "Categories são visíveis para todos" ON categories FOR SELECT USING (true);

-- Políticas para experiences (leitura pública)
CREATE POLICY "Experiências são visíveis para todos" ON experiences FOR SELECT USING (true);

-- Políticas para professionals (leitura pública)
CREATE POLICY "Professionals são visíveis para todos" ON professionals FOR SELECT USING (true);

-- Políticas para profiles (usuários podem ver e editar apenas seus próprios dados)
CREATE POLICY "Usuários podem ver seus próprios perfis" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuários podem inserir seus próprios perfis" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para users (usuários podem ver e editar apenas seus próprios dados)
CREATE POLICY "Usuários podem ver seus próprios dados" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários podem atualizar seus próprios dados" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Usuários podem inserir seus próprios dados" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para bookings (usuários podem ver e gerenciar apenas seus próprios agendamentos)
CREATE POLICY "Usuários podem ver seus próprios agendamentos" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar agendamentos" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus próprios agendamentos" ON bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seus próprios agendamentos" ON bookings FOR DELETE USING (auth.uid() = user_id);

-- Políticas para payments (usuários podem ver e gerenciar apenas seus próprios pagamentos)
CREATE POLICY "Usuários podem ver seus próprios pagamentos" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem criar pagamentos" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus próprios pagamentos" ON payments FOR UPDATE USING (auth.uid() = user_id);