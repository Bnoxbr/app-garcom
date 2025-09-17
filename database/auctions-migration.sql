-- Criação da tabela de leilões (auctions)
CREATE TABLE IF NOT EXISTS auctions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  client_id UUID REFERENCES profiles(id) NOT NULL,
  location TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours NUMERIC(5,2) NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  min_rating NUMERIC(3,1) DEFAULT 0.0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  winner_id UUID REFERENCES profiles(id),
  final_price NUMERIC(10,2),
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de lances (bids)
CREATE TABLE IF NOT EXISTS auction_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID REFERENCES auctions(id) NOT NULL,
  professional_id UUID REFERENCES profiles(id) NOT NULL,
  bid_amount NUMERIC(10,2) NOT NULL,
  service_fee NUMERIC(10,2) NOT NULL,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(auction_id, professional_id)
);

-- Criação da tabela de notificações de leilão
CREATE TABLE IF NOT EXISTS auction_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id UUID REFERENCES auctions(id) NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('new_auction', 'new_bid', 'auction_ending', 'auction_completed', 'bid_accepted')),
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhorar a performance
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_category ON auctions(category_id);
CREATE INDEX IF NOT EXISTS idx_auctions_client ON auctions(client_id);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction ON auction_bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_professional ON auction_bids(professional_id);
CREATE INDEX IF NOT EXISTS idx_auction_notifications_user ON auction_notifications(user_id);

-- Trigger para atualizar a coluna updated_at
CREATE TRIGGER set_updated_at_auctions
BEFORE UPDATE ON auctions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_auction_bids
BEFORE UPDATE ON auction_bids
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Função para finalizar leilões automaticamente
CREATE OR REPLACE FUNCTION finalize_expired_auctions()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualiza o status de leilões expirados para 'completed'
  UPDATE auctions
  SET status = 'completed'
  WHERE status = 'active' AND end_time <= NOW();
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para verificar leilões expirados
CREATE TRIGGER check_expired_auctions
AFTER INSERT OR UPDATE ON auctions
FOR EACH STATEMENT
EXECUTE FUNCTION finalize_expired_auctions();

-- Políticas RLS para auctions
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver leilões ativos
CREATE POLICY "Leilões ativos visíveis para todos" ON auctions
FOR SELECT USING (status = 'active');

-- Contratantes podem ver seus próprios leilões (ativos, completados ou cancelados)
CREATE POLICY "Contratantes podem ver seus próprios leilões" ON auctions
FOR SELECT USING (client_id = auth.uid());

-- Profissionais podem ver leilões onde foram vencedores
CREATE POLICY "Profissionais podem ver leilões onde foram vencedores" ON auctions
FOR SELECT USING (winner_id = auth.uid());

-- Apenas contratantes podem criar leilões
CREATE POLICY "Apenas contratantes podem criar leilões" ON auctions
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'contratante'
  )
);

-- Contratantes só podem atualizar seus próprios leilões
CREATE POLICY "Contratantes só podem atualizar seus próprios leilões" ON auctions
FOR UPDATE USING (client_id = auth.uid());

-- Contratantes só podem excluir seus próprios leilões
CREATE POLICY "Contratantes só podem excluir seus próprios leilões" ON auctions
FOR DELETE USING (client_id = auth.uid());

-- Políticas RLS para auction_bids
ALTER TABLE auction_bids ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver lances em leilões ativos
CREATE POLICY "Lances visíveis para todos em leilões ativos" ON auction_bids
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM auctions
    WHERE auctions.id = auction_bids.auction_id AND auctions.status = 'active'
  )
);

-- Profissionais podem ver seus próprios lances
CREATE POLICY "Profissionais podem ver seus próprios lances" ON auction_bids
FOR SELECT USING (professional_id = auth.uid());

-- Contratantes podem ver lances em seus próprios leilões
CREATE POLICY "Contratantes podem ver lances em seus leilões" ON auction_bids
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM auctions
    WHERE auctions.id = auction_bids.auction_id AND auctions.client_id = auth.uid()
  )
);

-- Apenas profissionais podem criar lances
CREATE POLICY "Apenas profissionais podem criar lances" ON auction_bids
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'profissional'
  )
);

-- Profissionais só podem atualizar seus próprios lances
CREATE POLICY "Profissionais só podem atualizar seus próprios lances" ON auction_bids
FOR UPDATE USING (professional_id = auth.uid());

-- Políticas RLS para auction_notifications
ALTER TABLE auction_notifications ENABLE ROW LEVEL SECURITY;

-- Usuários só podem ver suas próprias notificações
CREATE POLICY "Usuários só podem ver suas próprias notificações" ON auction_notifications
FOR SELECT USING (user_id = auth.uid());

-- Usuários só podem atualizar suas próprias notificações (marcar como lidas)
CREATE POLICY "Usuários só podem atualizar suas próprias notificações" ON auction_notifications
FOR UPDATE USING (user_id = auth.uid());