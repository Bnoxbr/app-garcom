-- Script SQL para inserir os 11 novos profissionais no Supabase
-- Execute este script no SQL Editor do Supabase

INSERT INTO professionals (name, category, rating, reviews, distance, available, image, description, price) VALUES
('Carlos Oliveira', 'Chef', 4.7, 156, '3.1 km', true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Chef com especialização em culinária brasileira e internacional.', 'R$ 120/hora'),
('Ana Costa', 'Garçom', 4.6, 94, '1.5 km', true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Garçom atenciosa com experiência em eventos sociais e corporativos.', 'R$ 75/hora'),
('Pedro Almeida', 'Sommelier', 4.9, 67, '4.2 km', true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Sommelier certificado com vasta experiência em vinhos nacionais e importados.', 'R$ 150/hora'),
('Lucia Ferreira', 'Copeiro', 4.5, 78, '2.7 km', true, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 'Copeira especializada em café gourmet e bebidas quentes.', 'R$ 60/hora'),
('Roberto Lima', 'Auxiliar de Cozinha', 4.4, 45, '3.8 km', true, 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face', 'Auxiliar de cozinha com experiência em preparo de pratos executivos.', 'R$ 50/hora'),
('Marcos Souza', 'Garçom', 4.7, 134, '1.9 km', true, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face', 'Garçom profissional com experiência em restaurantes fine dining.', 'R$ 85/hora'),
('Camila Dias', 'Chef', 4.9, 203, '2.8 km', true, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', 'Chef especializada em culinária contemporânea e pratos veganos.', 'R$ 130/hora'),
('Rafael Mendes', 'Bartender', 4.8, 112, '2.1 km', true, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Bartender especializado em coquetéis autorais e drinks clássicos.', 'R$ 95/hora'),
('Fernanda Silva', 'Recepcionista', 4.6, 87, '1.7 km', true, 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face', 'Recepcionista experiente em atendimento ao cliente e eventos corporativos.', 'R$ 65/hora'),
('Diego Santos', 'Segurança', 4.5, 56, '3.5 km', true, 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face', 'Segurança profissional com experiência em eventos e estabelecimentos.', 'R$ 70/hora'),
('Juliana Rocha', 'Hostess', 4.7, 92, '2.3 km', true, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', 'Hostess experiente em recepção e atendimento em eventos sociais.', 'R$ 80/hora');

-- Verificar se os dados foram inseridos corretamente
SELECT COUNT(*) as total_professionals FROM professionals;
SELECT name, category, rating, reviews FROM professionals ORDER BY name;