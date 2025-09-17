-- Migração para Mr. Staffer - Two-sided marketplace for hospitality services
-- Remove tabela experiences e atualiza estrutura para marketplace de hospitalidade

-- 1. Remover tabela experiences e dependências
DROP TABLE IF EXISTS experiences CASCADE;
DROP FUNCTION IF EXISTS get_random_featured_experiences();

-- 2. Atualizar tabela profiles para Mr. Staffer
ALTER TABLE profiles 
  -- Campos obrigatórios
  ALTER COLUMN full_name SET NOT NULL,
  ADD COLUMN IF NOT EXISTS email VARCHAR(255),
  ALTER COLUMN role TYPE VARCHAR(20),
  ADD COLUMN IF NOT EXISTS document VARCHAR(20) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS document_type VARCHAR(10) NOT NULL DEFAULT 'cpf',
  
  -- Campos específicos para prestadores
  ADD COLUMN IF NOT EXISTS specialties TEXT[],
  ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS experience_years INTEGER,
  ADD COLUMN IF NOT EXISTS mei_number VARCHAR(20),
  ADD COLUMN IF NOT EXISTS portfolio_images TEXT[],
  
  -- Endereço completo (JSONB para flexibilidade)
  ADD COLUMN IF NOT EXISTS address JSONB,
  
  -- Dados bancários (JSONB para flexibilidade)
  ADD COLUMN IF NOT EXISTS banking_data JSONB,
  
  -- Avaliações
  ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS reviews_count INTEGER DEFAULT 0,
  
  -- Status
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS available BOOLEAN DEFAULT TRUE;

-- 3. Atualizar constraint de role para novos valores
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('contratante', 'prestador', 'admin'));

-- 4. Atualizar constraint de document_type
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_document_type_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_document_type_check 
  CHECK (document_type IN ('cpf', 'cnpj'));

-- 5. Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_specialties ON profiles USING GIN(specialties);
CREATE INDEX IF NOT EXISTS idx_profiles_available ON profiles(available) WHERE role = 'prestador';
CREATE INDEX IF NOT EXISTS idx_profiles_rating ON profiles(rating) WHERE role = 'prestador';
CREATE INDEX IF NOT EXISTS idx_profiles_hourly_rate ON profiles(hourly_rate) WHERE role = 'prestador';

-- 6. Atualizar categorias para hospitalidade
DELETE FROM categories;
INSERT INTO categories (id, name, icon) VALUES
  ('garcom', 'Garçom', '🍽️'),
  ('chef', 'Chef de Cozinha', '👨‍🍳'),
  ('bartender', 'Bartender', '🍸'),
  ('sommelier', 'Sommelier', '🍷'),
  ('copeiro', 'Copeiro', '☕'),
  ('auxiliar_cozinha', 'Auxiliar de Cozinha', '🥄'),
  ('maitre', 'Maître', '🎩'),
  ('hostess', 'Hostess', '💁‍♀️'),
  ('limpeza', 'Limpeza', '🧹'),
  ('seguranca', 'Segurança', '🛡️');

-- 7. Criar tabela de bookings atualizada para Mr. Staffer
DROP TABLE IF EXISTS bookings CASCADE;
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Detalhes do serviço
  service_type VARCHAR(50) NOT NULL, -- garcom, chef, bartender, etc.
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours INTEGER NOT NULL DEFAULT 4,
  hourly_rate DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Localização do evento
  event_address JSONB NOT NULL,
  
  -- Descrição e requisitos
  description TEXT,
  requirements TEXT,
  
  -- Status do booking
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid')),
  
  -- Check-in do prestador e cliente
  provider_checked_in BOOLEAN DEFAULT FALSE,
  client_checked_in BOOLEAN DEFAULT FALSE,
  provider_checkin_time TIMESTAMP WITH TIME ZONE,
  client_checkin_time TIMESTAMP WITH TIME ZONE,
  
  -- Avaliação (após conclusão)
  client_rating INTEGER CHECK (client_rating >= 1 AND client_rating <= 5),
  client_review TEXT,
  provider_rating INTEGER CHECK (provider_rating >= 1 AND provider_rating <= 5),
  provider_review TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 8. Criar índices para bookings
CREATE INDEX idx_bookings_client_id ON bookings(client_id);
CREATE INDEX idx_bookings_provider_id ON bookings(provider_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_event_date ON bookings(event_date);
CREATE INDEX idx_bookings_service_type ON bookings(service_type);

-- 9. Criar tabela de pagamentos
DROP TABLE IF EXISTS payments CASCADE;
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Valores
  amount DECIMAL(10,2) NOT NULL,
  platform_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  provider_amount DECIMAL(10,2) NOT NULL,
  
  -- Método de pagamento
  payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'debit_card', 'bitcoin')),
  payment_data JSONB, -- Dados específicos do método de pagamento
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
  
  -- Pagamento antecipado e retenção de fundos
  is_advance_payment BOOLEAN DEFAULT FALSE,
  funds_status VARCHAR(20) DEFAULT 'released' CHECK (funds_status IN ('held', 'released')),
  service_confirmed_at TIMESTAMP WITH TIME ZONE,
  
  -- IDs externos (gateway de pagamento)
  external_payment_id VARCHAR(255),
  external_transaction_id VARCHAR(255),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 10. Criar índices para payments
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_method ON payments(payment_method);

-- 11. Atualizar triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 12. Atualizar RLS (Row Level Security)
-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;



DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = client_id OR auth.uid() = provider_id);

CREATE POLICY "Clients can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = client_id OR auth.uid() = provider_id);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE bookings.id = payments.booking_id 
      AND (bookings.client_id = auth.uid() OR bookings.provider_id = auth.uid())
    )
  );

-- 13. Funções auxiliares para Mr. Staffer

-- Função para buscar prestadores disponíveis
CREATE OR REPLACE FUNCTION get_available_providers(
  p_service_type TEXT DEFAULT NULL,
  p_location JSONB DEFAULT NULL,
  p_min_rating DECIMAL DEFAULT 0,
  p_max_hourly_rate DECIMAL DEFAULT NULL,
  p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  avatar_url TEXT,
  specialties TEXT[],
  hourly_rate DECIMAL,
  rating DECIMAL,
  reviews_count INTEGER,
  experience_years INTEGER,
  bio TEXT,
  available BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.full_name,
    p.avatar_url,
    p.specialties,
    p.hourly_rate,
    p.rating,
    p.reviews_count,
    p.experience_years,
    p.bio,
    p.available
  FROM profiles p
  WHERE p.role = 'prestador'
    AND p.available = true
    AND p.verified = true
    AND (p_service_type IS NULL OR p_service_type = ANY(p.specialties))
    AND (p_min_rating IS NULL OR p.rating >= p_min_rating)
    AND (p_max_hourly_rate IS NULL OR p.hourly_rate <= p_max_hourly_rate)
  ORDER BY p.rating DESC, p.reviews_count DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular estatísticas do prestador
CREATE OR REPLACE FUNCTION update_provider_stats(provider_uuid UUID)
RETURNS VOID AS $$
DECLARE
  avg_rating DECIMAL;
  total_reviews INTEGER;
BEGIN
  SELECT 
    AVG(client_rating)::DECIMAL(3,2),
    COUNT(*)
  INTO avg_rating, total_reviews
  FROM bookings 
  WHERE provider_id = provider_uuid 
    AND status = 'completed' 
    AND client_rating IS NOT NULL;

  UPDATE profiles 
  SET 
    rating = COALESCE(avg_rating, 0),
    reviews_count = COALESCE(total_reviews, 0),
    updated_at = NOW()
  WHERE id = provider_uuid;
END;
$$ LANGUAGE plpgsql;

-- 14. Migrar dados existentes (se houver)
UPDATE profiles 
SET 
  role = CASE 
    WHEN role = 'client' THEN 'contratante'
    WHEN role = 'provider' THEN 'prestador'
    ELSE role
  END,
  document = COALESCE(document, ''),
  document_type = COALESCE(document_type, 'cpf'),
  verified = false,
  available = CASE WHEN role IN ('provider', 'prestador') THEN true ELSE false END
WHERE role IN ('client', 'provider');

-- 15. Comentários para documentação
COMMENT ON TABLE profiles IS 'Perfis de usuários do Mr. Staffer - marketplace de hospitalidade';
COMMENT ON TABLE bookings IS 'Reservas de serviços entre contratantes e prestadores';
COMMENT ON TABLE payments IS 'Pagamentos das reservas de serviços';
COMMENT ON COLUMN profiles.specialties IS 'Array de especialidades do prestador (garcom, chef, bartender, etc.)';
COMMENT ON COLUMN profiles.address IS 'Endereço completo em formato JSON';
COMMENT ON COLUMN profiles.banking_data IS 'Dados bancários para pagamento em formato JSON';

-- Finalização
SELECT 'Migração Mr. Staffer concluída com sucesso!' as status;