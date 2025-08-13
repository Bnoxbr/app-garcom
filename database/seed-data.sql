-- Dados de exemplo para popular o banco de dados

-- Inserir regiões
INSERT INTO regioes (nome, descricao, imagem_url) VALUES
('Centro Histórico', 'Região central da cidade com rica história e arquitetura colonial', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'),
('Zona Sul', 'Área nobre com belas praias e vida noturna agitada', 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=400&h=300&fit=crop'),
('Bairro Boêmio', 'Região conhecida pela gastronomia e entretenimento', 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop'),
('Distrito Gastronômico', 'Centro culinário da cidade com os melhores restaurantes', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop');

-- Inserir categorias
INSERT INTO categories (name, icon) VALUES
('Garçom', '🍽️'),
('Bartender', '🍸'),
('Chef', '👨‍🍳'),
('Sommelier', '🍷'),
('Copeiro', '☕'),
('Auxiliar de Cozinha', '🥄');

-- Inserir profissionais de exemplo
INSERT INTO professionals (name, category, rating, reviews, distance, available, image, description, price) VALUES
('Carlos Silva', 'Garçom', 4.8, 127, '2.3 km', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Garçom experiente com 8 anos de experiência em eventos corporativos e casamentos.', 'R$ 80/hora'),
('Ana Santos', 'Bartender', 4.9, 89, '1.8 km', true, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'Bartender especializada em coquetéis clássicos e autorais.', 'R$ 90/hora'),
('João Oliveira', 'Chef', 4.7, 156, '3.1 km', false, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Chef com especialização em culinária brasileira e internacional.', 'R$ 120/hora'),
('Maria Costa', 'Garçom', 4.6, 94, '1.5 km', true, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Garçom atenciosa com experiência em eventos sociais e corporativos.', 'R$ 75/hora'),
('Pedro Almeida', 'Sommelier', 4.9, 67, '4.2 km', true, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', 'Sommelier certificado com vasta experiência em vinhos nacionais e importados.', 'R$ 150/hora'),
('Lucia Ferreira', 'Copeiro', 4.5, 78, '2.7 km', true, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', 'Copeira especializada em café gourmet e bebidas quentes.', 'R$ 60/hora'),
('Roberto Lima', 'Auxiliar de Cozinha', 4.4, 45, '3.8 km', false, 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face', 'Auxiliar de cozinha com experiência em preparo de pratos executivos.', 'R$ 50/hora'),
('Fernanda Rocha', 'Bartender', 4.8, 112, '2.1 km', true, 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face', 'Bartender criativa especializada em drinks autorais e apresentações especiais.', 'R$ 95/hora'),
('Marcos Souza', 'Garçom', 4.7, 134, '1.9 km', true, 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face', 'Garçom profissional com experiência em restaurantes fine dining.', 'R$ 85/hora'),
('Camila Dias', 'Chef', 4.9, 203, '2.8 km', true, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', 'Chef especializada em culinária contemporânea e pratos veganos.', 'R$ 130/hora');

-- Inserir experiências (usando IDs das regiões e categorias inseridas acima)
INSERT INTO experiences (titulo, descricao, preco, duracao, regiao_id, categoria_id, imagem_url, rating, total_avaliacoes, featured) VALUES
('Jantar Romântico com Chef Particular', 'Experiência gastronômica única com chef especializado preparando um menu degustação para duas pessoas.', 350.00, 180, (SELECT id FROM regioes WHERE nome = 'Centro Histórico' LIMIT 1), (SELECT id FROM categories WHERE name = 'Chef' LIMIT 1), 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop', 4.8, 45, true),
('Coquetelaria Artesanal em Casa', 'Bartender profissional prepara drinks exclusivos no conforto da sua casa com ingredientes premium.', 280.00, 120, (SELECT id FROM regioes WHERE nome = 'Zona Sul' LIMIT 1), (SELECT id FROM categories WHERE name = 'Bartender' LIMIT 1), 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop', 4.9, 67, true),
('Serviço de Garçom para Eventos', 'Garçom experiente para atendimento em eventos corporativos e sociais com excelência no serviço.', 120.00, 240, (SELECT id FROM regioes WHERE nome = 'Bairro Boêmio' LIMIT 1), (SELECT id FROM categories WHERE name = 'Garçom' LIMIT 1), 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=400&h=300&fit=crop', 4.7, 89, true),
('Degustação de Vinhos com Sommelier', 'Experiência exclusiva de degustação com sommelier certificado e seleção de vinhos premium.', 450.00, 150, (SELECT id FROM regioes WHERE nome = 'Distrito Gastronômico' LIMIT 1), (SELECT id FROM categories WHERE name = 'Sommelier' LIMIT 1), 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop', 4.9, 34, true),
('Café Gourmet Experience', 'Serviço especializado de café gourmet com barista profissional e grãos selecionados.', 80.00, 60, (SELECT id FROM regioes WHERE nome = 'Centro Histórico' LIMIT 1), (SELECT id FROM categories WHERE name = 'Copeiro' LIMIT 1), 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop', 4.6, 78, true),
('Aula de Culinária Particular', 'Chef ensina técnicas culinárias avançadas em aula particular personalizada.', 200.00, 180, (SELECT id FROM regioes WHERE nome = 'Distrito Gastronômico' LIMIT 1), (SELECT id FROM categories WHERE name = 'Chef' LIMIT 1), 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', 4.8, 56, false);