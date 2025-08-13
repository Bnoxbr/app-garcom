# Configuração do Supabase

## Status Atual

O aplicativo está funcionando com **dados de fallback** temporários. Os erros 404 foram resolvidos, mas você precisa configurar o Supabase corretamente para usar dados reais.

## Passos para Configurar o Supabase

### 1. Criar as Tabelas no Supabase

Acesse o painel do Supabase e execute as seguintes queries SQL:

```sql
-- Criar tabela de categorias
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar tabela de profissionais
CREATE TABLE professionals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category VARCHAR(100) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  distance VARCHAR(20),
  available BOOLEAN DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados de exemplo
INSERT INTO categories (name, icon) VALUES
('Garçom', 'fas fa-utensils'),
('Bartender', 'fas fa-cocktail'),
('Chef', 'fas fa-chef-hat');

INSERT INTO professionals (name, category, rating, distance, available, image_url) VALUES
('João Silva', 'Garçom', 4.8, '2.5 km', true, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'),
('Maria Santos', 'Bartender', 4.9, '1.8 km', true, 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face');
```

### 2. Configurar RLS (Row Level Security)

```sql
-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

-- Criar políticas para leitura pública
CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on professionals" ON professionals
  FOR SELECT USING (true);
```

### 3. Verificar Configuração

Após executar as queries:

1. Verifique se as tabelas foram criadas corretamente
2. Confirme que os dados de exemplo foram inseridos
3. Teste a aplicação - ela deve carregar os dados reais do Supabase

### 4. Remover Dados de Fallback (Opcional)

Quando o Supabase estiver funcionando, você pode remover os dados de fallback dos hooks:

- `src/hooks/useProfessionals.ts`
- `src/hooks/useCategories.ts`

Substitua o bloco `if (error)` por `if (error) throw error`

## Troubleshooting

- **Erro 404**: Tabelas não existem no Supabase
- **Erro 401**: Problemas de autenticação/RLS
- **Dados vazios**: Verifique se os dados foram inseridos corretamente

## Próximos Passos

1. Configurar autenticação de usuários
2. Implementar sistema de reservas
3. Adicionar mais funcionalidades ao app