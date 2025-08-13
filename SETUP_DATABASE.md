# Configuração da Base de Dados - LocalGuia

## Visão Geral

Este documento contém as instruções para configurar a base de dados do LocalGuia no Supabase, baseado no diagrama de requisições detalhado.

## Estrutura da Base de Dados

### Tabelas Principais

1. **regioes** - Regiões/destinos disponíveis
2. **categories** - Categorias de serviços
3. **experiences** - Experiências oferecidas
4. **professionals** - Profissionais cadastrados
5. **profiles** - Perfis de usuários (estende auth.users)
6. **users** - Dados de usuários (compatibilidade)
7. **bookings** - Agendamentos/reservas

### Funções RPC

- `get_random_featured_experiences(limit_count)` - Busca experiências em destaque aleatórias
- `update_updated_at_column()` - Atualiza timestamp automaticamente

## Passos para Configuração

### 1. Acesse o Painel do Supabase

1. Vá para [https://supabase.com](https://supabase.com)
2. Faça login na sua conta
3. Selecione o projeto: `rtcafnmyuybhxkcxkrzz`
4. Vá para a seção **SQL Editor**

### 2. Execute as Migrações

1. Copie todo o conteúdo do arquivo `database/migrations.sql`
2. Cole no SQL Editor do Supabase
3. Clique em **Run** para executar

### 3. Popule com Dados de Exemplo

1. Copie todo o conteúdo do arquivo `database/seed-data.sql`
2. Cole no SQL Editor do Supabase
3. Clique em **Run** para executar

### 4. Verificar Configuração

Após executar as migrações, verifique se:

- [ ] Todas as tabelas foram criadas
- [ ] Os dados de exemplo foram inseridos
- [ ] As políticas RLS estão ativas
- [ ] A função RPC está disponível

### 5. Testar a Aplicação

1. Reinicie o servidor de desenvolvimento: `npm run dev`
2. Acesse `http://localhost:5175/`
3. Verifique se os dados reais do Supabase são carregados

## Fluxos de Requisições Implementados

### Fluxo 1: Carregamento da Página Inicial

```
Frontend → Supabase API:
- GET /rest/v1/regioes?select=*
- POST /rest/v1/rpc/get_random_featured_experiences
```

### Fluxo 2: Autenticação

```
Frontend → Supabase Auth:
- POST /auth/v1/token?grant_type=password
- Busca automática do perfil na tabela profiles
```

### Fluxo 3: Atualização de Perfil

```
Frontend → Supabase Storage: (upload de avatar)
- POST /storage/v1/object/avatars/...
- GET /storage/v1/object/public/avatars/...

Frontend → Supabase API:
- PATCH /rest/v1/profiles?id=eq.<user_id>
```

## Configuração de Storage (Opcional)

Para upload de avatares:

1. Vá para **Storage** no painel do Supabase
2. Crie um bucket chamado `avatars`
3. Configure as políticas de acesso:

```sql
-- Política para upload de avatares
CREATE POLICY "Usuários podem fazer upload de avatares" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Política para visualização pública
CREATE POLICY "Avatares são públicos" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

## Troubleshooting

### Erro: "relation does not exist"
- Verifique se as migrações foram executadas corretamente
- Confirme que está no projeto correto do Supabase

### Erro: "permission denied"
- Verifique as políticas RLS
- Confirme que o usuário está autenticado

### Dados não aparecem
- Verifique se os dados de exemplo foram inseridos
- Confirme que as políticas permitem leitura pública

## Próximos Passos

1. Implementar autenticação no frontend
2. Criar páginas para experiências e regiões
3. Implementar sistema de reservas
4. Adicionar funcionalidades de perfil de usuário
5. Configurar notificações em tempo real

---

**Nota**: Após a configuração bem-sucedida, você pode remover os dados de fallback dos hooks `useProfessionals.ts` e `useCategories.ts`.