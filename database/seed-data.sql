-- Dados de exemplo para Mr. Staffer - Marketplace de Hospitalidade

-- Inserir regiões
INSERT INTO regioes (nome, descricao, imagem_url) VALUES
('Centro Histórico', 'Região central da cidade com rica história e arquitetura colonial', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'),
('Zona Sul', 'Área nobre com belas praias e vida noturna agitada', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop'),
('Bairro Boêmio', 'Região conhecida pela gastronomia e entretenimento', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop'),
('Distrito Gastronômico', 'Centro culinário da cidade com os melhores restaurantes', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop');

-- Inserir categorias de hospitalidade
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
('seguranca', 'Segurança', '🛡️')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon;

-- Inserir prestadores de serviços de exemplo
INSERT INTO profiles (
  id, full_name, email, role, document, document_type, phone, bio, 
  specialties, hourly_rate, experience_years, rating, reviews_count, 
  verified, available, avatar_url,
  address, banking_data,
  created_at, updated_at
) VALUES
-- Prestadores
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Carlos Silva',
  'carlos.silva@email.com',
  'prestador',
  '123.456.789-01',
  'cpf',
  '(11) 99999-0001',
  'Garçom experiente com 8 anos de experiência em eventos corporativos e casamentos. Especializado em atendimento de alta qualidade.',
  ARRAY['garcom'],
  80.00,
  8,
  4.8,
  127,
  true,
  true,
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  '{"cep": "01310-100", "street": "Av. Paulista", "number": "1000", "neighborhood": "Bela Vista", "city": "São Paulo", "state": "SP", "country": "Brasil"}',
  '{"pix_key": "123.456.789-01", "pix_type": "cpf"}',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Ana Santos',
  'ana.santos@email.com',
  'prestador',
  '234.567.890-12',
  'cpf',
  '(11) 99999-0002',
  'Bartender especializada em coquetéis clássicos e autorais. Formação em mixologia internacional.',
  ARRAY['bartender'],
  90.00,
  6,
  4.9,
  89,
  true,
  true,
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  '{"cep": "22071-900", "street": "Av. Atlântica", "number": "500", "neighborhood": "Copacabana", "city": "Rio de Janeiro", "state": "RJ", "country": "Brasil"}',
  '{"pix_key": "ana.santos@email.com", "pix_type": "email"}',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'João Oliveira',
  'joao.oliveira@email.com',
  'prestador',
  '345.678.901-23',
  'cpf',
  '(11) 99999-0003',
  'Chef com especialização em culinária brasileira e internacional. Graduado em Gastronomia.',
  ARRAY['chef'],
  120.00,
  12,
  4.7,
  156,
  true,
  false,
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  '{"cep": "04038-001", "street": "Rua dos Pinheiros", "number": "200", "neighborhood": "Pinheiros", "city": "São Paulo", "state": "SP", "country": "Brasil"}',
  '{"pix_key": "(11) 99999-0003", "pix_type": "phone"}',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Maria Costa',
  'maria.costa@email.com',
  'prestador',
  '456.789.012-34',
  'cpf',
  '(11) 99999-0004',
  'Garçom atenciosa com experiência em eventos sociais e corporativos. Especializada em fine dining.',
  ARRAY['garcom'],
  75.00,
  5,
  4.6,
  94,
  true,
  true,
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  '{"cep": "01310-200", "street": "Rua Augusta", "number": "300", "neighborhood": "Consolação", "city": "São Paulo", "state": "SP", "country": "Brasil"}',
  '{"pix_key": "456.789.012-34", "pix_type": "cpf"}',
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Pedro Almeida',
  'pedro.almeida@email.com',
  'prestador',
  '567.890.123-45',
  'cpf',
  '(11) 99999-0005',
  'Sommelier certificado com vasta experiência em vinhos nacionais e importados. Curso na França.',
  ARRAY['sommelier'],
  150.00,
  10,
  4.9,
  67,
  true,
  true,
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  '{"cep": "01419-001", "street": "Rua Oscar Freire", "number": "100", "neighborhood": "Jardins", "city": "São Paulo", "state": "SP", "country": "Brasil"}',
  '{"pix_key": "pedro.almeida@email.com", "pix_type": "email"}',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Inserir contratantes de exemplo
INSERT INTO profiles (
  id, full_name, email, role, document, document_type, phone, 
  verified, available,
  created_at, updated_at
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440010',
  'Empresa Eventos Ltda',
  'contato@eventosltda.com',
  'contratante',
  '12.345.678/0001-90',
  'cnpj',
  '(11) 3333-0001',
  true,
  false,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440011',
  'Restaurante Bella Vista',
  'rh@bellavista.com',
  'contratante',
  '23.456.789/0001-01',
  'cnpj',
  '(11) 3333-0002',
  true,
  false,
  NOW(),
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440012',
  'Fernanda Lima',
  'fernanda.lima@email.com',
  'contratante',
  '789.012.345-67',
  'cpf',
  '(11) 99999-0012',
  true,
  false,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Inserir bookings de exemplo
INSERT INTO bookings (
  id, client_id, provider_id, service_type, event_date, duration_hours, 
  hourly_rate, total_amount, event_address, description, status,
  client_rating, client_review, created_at, updated_at
) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440010',
  '550e8400-e29b-41d4-a716-446655440001',
  'garcom',
  '2024-02-15 19:00:00+00',
  6,
  80.00,
  480.00,
  '{"street": "Rua das Flores, 123", "neighborhood": "Jardins", "city": "São Paulo", "state": "SP"}',
  'Evento corporativo para 50 pessoas',
  'completed',
  5,
  'Excelente profissional, muito atencioso e pontual.',
  NOW() - INTERVAL '30 days',
  NOW() - INTERVAL '25 days'
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440011',
  '550e8400-e29b-41d4-a716-446655440002',
  'bartender',
  '2024-02-20 20:00:00+00',
  4,
  90.00,
  360.00,
  '{"street": "Av. Paulista, 1000", "neighborhood": "Bela Vista", "city": "São Paulo", "state": "SP"}',
  'Evento de lançamento de produto',
  'completed',
  5,
  'Drinks incríveis, todos os convidados elogiaram!',
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '15 days'
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440012',
  '550e8400-e29b-41d4-a716-446655440005',
  'sommelier',
  '2024-03-01 19:30:00+00',
  3,
  150.00,
  450.00,
  '{"street": "Rua Oscar Freire, 500", "neighborhood": "Jardins", "city": "São Paulo", "state": "SP"}',
  'Jantar íntimo com degustação de vinhos',
  'pending',
  NULL,
  NULL,
  NOW() - INTERVAL '5 days',
  NOW() - INTERVAL '5 days'
)
ON CONFLICT (id) DO NOTHING;

-- Comentário final
SELECT 'Dados de exemplo do Mr. Staffer inseridos com sucesso!' as status;