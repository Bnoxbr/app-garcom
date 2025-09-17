# Configuração do Supabase e Banco de Dados

## 📊 Status Atual

O aplicativo está configurado para usar o Supabase como backend. As credenciais estão definidas no arquivo `.env`:

```env
VITE_SUPABASE_URL=https://rtcafnmyuybhxkcxkrzz.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

## 🔧 Passos para Configuração

### 1. Acesse o Painel do Supabase

1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto: `rtcafnmyuybhxkcxkrzz` (ou crie um novo)
4. Vá para a seção **SQL Editor**

### 2. Execute as Migrações

1. Copie todo o conteúdo do arquivo `database/migrations.sql`
2. Cole no SQL Editor do Supabase
3. Clique em **Run** para executar

### 3. Popule com Dados de Exemplo

1. Copie todo o conteúdo do arquivo `database/seed-data.sql`
2. Cole no SQL Editor do Supabase
3. Clique em **Run** para executar

### 4. Configure RLS (Row Level Security)

Para garantir a segurança dos dados, execute os scripts de configuração de RLS:

1. Execute o arquivo `database/fix-rls-policy.sql`
2. Execute o arquivo `database/fix-rls-providers.sql`
3. Execute o arquivo `database/fix-rls-and-warnings.sql`

### 5. Verifique a Configuração

Após executar as migrações, verifique se:

- [ ] Todas as tabelas foram criadas
- [ ] Os dados de exemplo foram inseridos
- [ ] As políticas RLS estão ativas
- [ ] A conexão com o frontend está funcionando

## 📋 Estrutura do Banco de Dados

### Tabelas Principais

1. **regioes** - Regiões/destinos disponíveis
2. **categories** - Categorias de serviços
3. **experiences** - Experiências oferecidas
4. **professionals** - Profissionais cadastrados
5. **profiles** - Perfis de usuários (estende auth.users)
6. **users** - Dados de usuários (compatibilidade)
7. **bookings** - Agendamentos/reservas
8. **payments** - Registros de pagamentos

### Funções RPC

- `get_random_featured_experiences(limit_count)` - Busca experiências em destaque aleatórias
- `update_updated_at_column()` - Atualiza timestamp automaticamente

## 🔍 Teste de Conexão

Para verificar se a conexão com o Supabase está funcionando corretamente, você pode usar a função `testConnection()` do arquivo `src/lib/supabase.ts`:

```typescript
import { supabase } from './lib/supabase';

// Teste a conexão
supabase.testConnection()
  .then(() => console.log('Conexão com Supabase estabelecida!'))
  .catch(err => console.error('Erro ao conectar com Supabase:', err));
```

---

**Nota:** Este documento substitui os arquivos SETUP_DATABASE.md e SUPABASE_SETUP.md, consolidando as informações mais atuais e relevantes sobre a configuração do Supabase e do banco de dados.