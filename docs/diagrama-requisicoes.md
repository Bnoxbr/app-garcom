# Diagrama de Requisições - App Garçom

## 🔄 Fluxo de Requisições da Aplicação

### 1. **Fluxo de Autenticação**

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend (React)
    participant S as Supabase Auth
    participant DB as PostgreSQL

    Note over U,DB: Processo de Login
    U->>F: Submete credenciais (email/senha)
    F->>S: supabase.auth.signInWithPassword()
    S->>DB: Valida credenciais
    DB-->>S: Retorna dados do usuário
    S-->>F: Session + User data
    F->>DB: Busca perfil em 'profiles'
    DB-->>F: Dados do perfil base
    F->>DB: Busca dados específicos em 'contratantes'
    DB-->>F: Dados completos do contratante
    F-->>U: Redireciona para dashboard

    Note over U,DB: Processo de Registro
    U->>F: Submete dados de registro
    F->>S: supabase.auth.signUp()
    S->>DB: Cria usuário na auth.users
    DB-->>S: Confirma criação
    F->>DB: INSERT em 'profiles'
    F->>DB: INSERT em 'contratantes'
    DB-->>F: Confirma inserções
    F-->>U: Sucesso no registro
```

### 2. **Fluxo de Gestão de Perfil**

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant DB as Supabase DB

    U->>F: Acessa página de perfil
    F->>DB: SELECT * FROM profiles WHERE id = user.id
    F->>DB: SELECT * FROM contratantes WHERE id = user.id
    DB-->>F: Dados do perfil completo
    F-->>U: Exibe formulário preenchido

    Note over U,DB: Atualização de Perfil
    U->>F: Submete alterações
    F->>DB: UPDATE profiles SET ... WHERE id = user.id
    F->>DB: UPDATE contratantes SET ... WHERE id = user.id
    DB-->>F: Confirma atualizações
    F-->>U: Feedback de sucesso
```

### 3. **Fluxo do Sistema de Leilões**

```mermaid
sequenceDiagram
    participant C as Contratante
    participant F as Frontend
    participant DB as Supabase DB
    participant P as Profissional
    participant RT as Realtime

    Note over C,RT: Criação de Leilão
    C->>F: Cria novo leilão
    F->>DB: INSERT INTO auctions
    DB-->>F: Retorna auction_id
    F->>RT: Notifica novos leilões
    RT-->>P: Push notification (novo leilão)

    Note over P,RT: Envio de Lance
    P->>F: Submete lance
    F->>DB: INSERT INTO bids
    DB-->>F: Confirma lance
    F->>RT: Notifica novo lance
    RT-->>C: Push notification (novo lance)

    Note over C,RT: Aceitação de Lance
    C->>F: Aceita lance específico
    F->>DB: UPDATE auctions SET winner_id, status='CLOSED'
    F->>DB: UPDATE bids SET status='ACCEPTED'
    DB-->>F: Confirma atualizações
    F->>RT: Notifica lance aceito
    RT-->>P: Push notification (lance aceito)
```

### 4. **Fluxo de Pagamentos**

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend
    participant MP as MercadoPago API
    participant DB as Supabase DB

    Note over U,DB: Processamento de Pagamento
    U->>F: Seleciona método de pagamento
    F->>F: Calcula comissões (platform_fee)
    
    alt Pagamento PIX/Cartão
        F->>MP: createPayment(paymentData)
        MP-->>F: Retorna payment_id + QR/URL
        F->>DB: INSERT INTO payments
        F-->>U: Exibe QR Code ou redirect
        
        Note over MP,DB: Webhook de Confirmação
        MP->>F: Webhook payment status
        F->>DB: UPDATE payments SET status
        F->>DB: UPDATE bookings SET payment_status
        
    else Pagamento Bitcoin
        F->>F: Gera endereço Bitcoin
        F->>DB: INSERT INTO payments
        F-->>U: Exibe endereço Bitcoin
    end
```

### 5. **Fluxo de Chat em Tempo Real**

```mermaid
sequenceDiagram
    participant U1 as Usuário 1
    participant F1 as Frontend 1
    participant RT as Supabase Realtime
    participant DB as Supabase DB
    participant F2 as Frontend 2
    participant U2 as Usuário 2

    Note over U1,U2: Inicialização do Chat
    U1->>F1: Abre chat
    F1->>RT: Subscribe to channel 'chat:conversation_id'
    F2->>RT: Subscribe to channel 'chat:conversation_id'
    
    Note over U1,U2: Envio de Mensagem
    U1->>F1: Digita mensagem
    F1->>DB: INSERT INTO messages
    DB->>RT: Trigger realtime event
    RT-->>F2: Broadcast nova mensagem
    F2-->>U2: Exibe mensagem em tempo real
    
    Note over U1,U2: Status de Leitura
    U2->>F2: Visualiza mensagem
    F2->>DB: UPDATE messages SET read_at
    DB->>RT: Trigger read status
    RT-->>F1: Broadcast status lido
    F1-->>U1: Marca como lida
```

## 🔗 Endpoints e APIs Utilizadas

### **Supabase Database Endpoints**
```
Base URL: https://rtcafnmyuybhxkcxkrzz.supabase.co/rest/v1/

Tabelas principais:
- /profiles (GET, POST, PATCH)
- /contratantes (GET, POST, PATCH)
- /auctions (GET, POST, PATCH)
- /bids (GET, POST, PATCH)
- /payments (GET, POST, PATCH)
- /messages (GET, POST, PATCH)
- /bookings (GET, POST, PATCH)
```

### **Supabase Auth Endpoints**
```
Base URL: https://rtcafnmyuybhxkcxkrzz.supabase.co/auth/v1/

Endpoints:
- /signup (POST)
- /token?grant_type=password (POST)
- /logout (POST)
- /recover (POST)
- /user (GET, PUT)
```

### **MercadoPago API**
```
Base URL: https://api.mercadopago.com/

Endpoints utilizados:
- /v1/payments (POST) - Criar pagamento
- /v1/payments/{id} (GET) - Status do pagamento
```

### **Supabase Realtime**
```
WebSocket URL: wss://rtcafnmyuybhxkcxkrzz.supabase.co/realtime/v1/websocket

Channels:
- realtime:public:messages
- realtime:public:auctions
- realtime:public:bids
```

## 📊 Métricas de Performance

### **Tempos de Resposta Esperados**
- **Autenticação:** < 2s
- **Carregamento de perfil:** < 1s
- **Criação de leilão:** < 3s
- **Envio de lance:** < 2s
- **Processamento de pagamento:** < 5s
- **Mensagens em tempo real:** < 500ms

### **Limites de Rate Limiting**
- **Supabase:** 100 req/min por IP
- **MercadoPago:** 1000 req/min por access_token
- **Realtime:** 100 conexões simultâneas

## 🔒 Segurança e Autenticação

### **Row Level Security (RLS) Policies**
```sql
-- Profiles: usuários só veem seus próprios dados
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
USING (id = auth.uid());

-- Auctions: todos podem ver, só criador pode editar
CREATE POLICY "view_all_auctions" ON auctions FOR SELECT
TO authenticated USING (true);

CREATE POLICY "update_own_auctions" ON auctions FOR UPDATE
USING (created_by = auth.uid());

-- Bids: todos podem ver, só criador pode editar
CREATE POLICY "view_auction_bids" ON bids FOR SELECT
TO authenticated USING (true);

-- Payments: só envolvidos podem ver
CREATE POLICY "view_own_payments" ON payments FOR SELECT
USING (client_id = auth.uid() OR provider_id = auth.uid());
```

### **Variáveis de Ambiente**
```env
# Supabase
VITE_SUPABASE_URL=https://rtcafnmyuybhxkcxkrzz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# MercadoPago
VITE_MP_ACCESS_TOKEN=APP_USR-xxx-xxx-xxx
VITE_MP_PUBLIC_KEY=APP_USR-xxx-xxx-xxx
```

---

## 📅 Controle de Versão

**📆 Última Atualização:** 15 de Janeiro de 2025  
**👤 Atualizado por:** Agente Técnico Especializado  
**📝 Versão:** 1.0  

> **⚠️ IMPORTANTE:** Sempre que modificar este documento, atualize a data acima e registre as principais alterações realizadas.

---

*Projeto: App Garçom - Plataforma de Serviços*