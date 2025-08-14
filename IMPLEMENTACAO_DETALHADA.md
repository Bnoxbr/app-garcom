# Implementação Detalhada - Plataforma de Serviços Gastronômicos

## 📊 Análise da Estrutura Atual

### ✅ O que já temos implementado:
- **Frontend Base:** React + TypeScript + Tailwind CSS
- **Roteamento:** React Router DOM já instalado
- **Backend:** Supabase configurado
- **Database:** Schema básico com tabelas principais
- **Hooks:** Sistema de hooks para dados (useCategories, useProfessionals, useRegioes, useExperiences)
- **Componentes:** Loading, ErrorMessage
- **Tipos:** Interfaces TypeScript definidas

### 🔍 O que precisa ser implementado:
- Sistema de roteamento multi-portal
- Autenticação com roles
- Portais específicos (Cliente, Prestador, Admin)
- Sistema de leilão
- Integração de pagamentos
- Chat em tempo real

## 🚀 Plano de Implementação Fase por Fase

### FASE 1: Estruturação Base (Semana 1)

#### 1.1 Reestruturação de Diretórios
```
src/
├── App.tsx                    # Router principal
├── main.tsx                   # Entry point
├── index.css                  # Estilos globais
├── components/                # Componentes compartilhados
│   ├── ui/                   # Componentes de UI base
│   ├── layout/               # Layouts compartilhados
│   └── common/               # Componentes comuns
├── pages/                     # Páginas da aplicação
│   ├── mobile/               # App mobile atual
│   ├── client-portal/        # Portal do cliente
│   ├── provider-portal/      # Portal do prestador
│   ├── auction/              # Sistema de leilão
│   ├── admin/                # Painel administrativo
│   └── auth/                 # Páginas de autenticação
├── hooks/                     # Hooks customizados
├── lib/                       # Configurações e utilitários
├── types/                     # Definições TypeScript
├── utils/                     # Funções utilitárias
└── contexts/                  # Contextos React
```

#### 1.2 Sistema de Roteamento
- Configurar React Router com rotas aninhadas
- Implementar proteção de rotas por role
- Sistema de redirecionamento baseado em perfil

#### 1.3 Expansão do Banco de Dados
```sql
-- Novas tabelas necessárias
CREATE TABLE establishments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name VARCHAR NOT NULL,
  type VARCHAR NOT NULL, -- restaurant, event_hall, catering
  address TEXT,
  phone VARCHAR,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id),
  title VARCHAR NOT NULL,
  description TEXT,
  event_date TIMESTAMP,
  location TEXT,
  guest_count INTEGER,
  budget_range VARCHAR,
  status VARCHAR DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE auctions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  title VARCHAR NOT NULL,
  description TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  min_budget DECIMAL,
  max_budget DECIMAL,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auction_id UUID REFERENCES auctions(id),
  provider_id UUID REFERENCES profiles(id),
  price DECIMAL NOT NULL,
  description TEXT,
  estimated_duration INTEGER,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  amount DECIMAL NOT NULL,
  currency VARCHAR DEFAULT 'BRL',
  payment_method VARCHAR,
  status VARCHAR DEFAULT 'pending',
  stripe_payment_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  reviewer_id UUID REFERENCES profiles(id),
  reviewed_id UUID REFERENCES profiles(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  booking_id UUID REFERENCES bookings(id),
  content TEXT NOT NULL,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES profiles(id),
  date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### FASE 2: Sistema de Autenticação Multi-Perfil (Semana 2)

#### 2.1 Expansão do Sistema de Auth
- Implementar roles no Supabase
- Criar fluxos de onboarding específicos
- Sistema de aprovação para prestadores

#### 2.2 Contextos de Autenticação
```typescript
// contexts/AuthContext.tsx
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  role: 'client' | 'provider' | 'admin' | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}
```

#### 2.3 Proteção de Rotas
```typescript
// components/ProtectedRoute.tsx
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}
```

### FASE 3: Portal do Cliente Web (Semana 3)

#### 3.1 Estrutura do Portal
```
pages/client-portal/
├── Dashboard.tsx             # Visão geral
├── Events.tsx               # Gestão de eventos
├── Establishments.tsx       # Gestão de estabelecimentos
├── Bookings.tsx            # Histórico de contratações
├── Professionals.tsx       # Busca de profissionais
├── Auctions.tsx            # Leilões ativos
├── Messages.tsx            # Chat com prestadores
├── Payments.tsx            # Gestão financeira
└── Settings.tsx            # Configurações
```

#### 3.2 Funcionalidades Principais
- Dashboard com métricas
- Criação e gestão de eventos
- Sistema de busca avançada
- Gestão de agendamentos
- Chat integrado

### FASE 4: Portal do Prestador Web (Semana 4)

#### 4.1 Estrutura do Portal
```
pages/provider-portal/
├── Dashboard.tsx            # Visão geral
├── Profile.tsx             # Perfil profissional
├── Availability.tsx        # Gestão de agenda
├── Proposals.tsx           # Propostas enviadas
├── Bookings.tsx           # Trabalhos confirmados
├── Portfolio.tsx          # Portfolio e certificações
├── Messages.tsx           # Chat com clientes
├── Earnings.tsx           # Relatórios financeiros
└── Settings.tsx           # Configurações
```

#### 4.2 Funcionalidades Principais
- Perfil profissional completo
- Sistema de agenda
- Gestão de propostas
- Portfolio visual
- Certificações

### FASE 5: Sistema de Leilão (Semana 5)

#### 5.1 Estrutura do Leilão
```
pages/auction/
├── AuctionList.tsx         # Lista de leilões
├── AuctionDetail.tsx       # Detalhes do leilão
├── CreateAuction.tsx       # Criar leilão (cliente)
├── SubmitProposal.tsx      # Enviar proposta (prestador)
├── ProposalList.tsx        # Lista de propostas
└── AuctionResults.tsx      # Resultados
```

#### 5.2 Funcionalidades do Leilão
- Leilão reverso (menor preço ganha)
- Sistema de propostas em tempo real
- Notificações automáticas
- Avaliação de propostas
- Sistema de urgência

### FASE 6: Migração do App Mobile (Semana 6)

#### 6.1 Reestruturação do App.tsx
- Mover conteúdo atual para `pages/mobile/`
- Implementar roteamento principal
- Manter funcionalidades existentes

#### 6.2 Componentes Mobile
```
pages/mobile/
├── Home.tsx                # Tela inicial atual
├── Search.tsx             # Busca de profissionais
├── Categories.tsx         # Categorias de serviços
├── Professional.tsx       # Perfil do profissional
├── Booking.tsx           # Agendamento
├── Chat.tsx              # Chat mobile
└── Profile.tsx           # Perfil do usuário
```

### FASE 7: Sistema de Pagamentos (Semana 7)

#### 7.1 Integração Stripe
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

#### 7.2 Fluxos de Pagamento
- Pré-pagamento para reservas
- Pagamento na conclusão
- Sistema de escrow
- Reembolsos automáticos

### FASE 8: Chat em Tempo Real (Semana 8)

#### 8.1 Implementação com Supabase Realtime
```typescript
// hooks/useChat.ts
const useChat = (bookingId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `booking_id=eq.${bookingId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
      
    return () => subscription.unsubscribe();
  }, [bookingId]);
};
```

### FASE 9: Painel Administrativo (Semana 9)

#### 9.1 Funcionalidades Admin
- Gestão de usuários
- Moderação de conteúdo
- Relatórios e analytics
- Configurações da plataforma
- Suporte ao cliente

### FASE 10: Testes e Otimização (Semana 10)

#### 10.1 Testes
- Testes unitários com Jest
- Testes de integração
- Testes E2E com Cypress
- Testes de performance

#### 10.2 Otimizações
- Code splitting
- Lazy loading
- Otimização de imagens
- Cache strategies

## 🔧 Dependências Adicionais Necessárias

```json
{
  "dependencies": {
    "@stripe/stripe-js": "^2.0.0",
    "@stripe/react-stripe-js": "^2.0.0",
    "@tanstack/react-query": "^5.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.0.0",
    "@hookform/resolvers": "^3.0.0",
    "date-fns": "^3.0.0",
    "react-hot-toast": "^2.0.0",
    "framer-motion": "^11.0.0",
    "recharts": "^2.0.0",
    "react-dropzone": "^14.0.0",
    "socket.io-client": "^4.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jest": "^29.0.0",
    "cypress": "^13.0.0"
  }
}
```

## 📋 Checklist de Implementação

### Semana 1: Base
- [ ] Reestruturar diretórios
- [ ] Configurar roteamento
- [ ] Expandir banco de dados
- [ ] Implementar contextos base

### Semana 2: Autenticação
- [ ] Sistema de roles
- [ ] Fluxos de onboarding
- [ ] Proteção de rotas
- [ ] Aprovação de prestadores

### Semana 3: Portal Cliente
- [ ] Dashboard cliente
- [ ] Gestão de eventos
- [ ] Sistema de busca
- [ ] Agendamentos

### Semana 4: Portal Prestador
- [ ] Dashboard prestador
- [ ] Perfil profissional
- [ ] Sistema de agenda
- [ ] Gestão de propostas

### Semana 5: Sistema de Leilão
- [ ] Criação de leilões
- [ ] Sistema de propostas
- [ ] Notificações
- [ ] Avaliação de propostas

### Semana 6: App Mobile
- [ ] Migração do código atual
- [ ] Roteamento mobile
- [ ] Manter funcionalidades
- [ ] Integração com novos sistemas

### Semana 7: Pagamentos
- [ ] Integração Stripe
- [ ] Fluxos de pagamento
- [ ] Sistema de escrow
- [ ] Reembolsos

### Semana 8: Chat
- [ ] Chat em tempo real
- [ ] Notificações
- [ ] Histórico de mensagens
- [ ] Interface responsiva

### Semana 9: Admin
- [ ] Painel administrativo
- [ ] Gestão de usuários
- [ ] Relatórios
- [ ] Moderação

### Semana 10: Finalização
- [ ] Testes completos
- [ ] Otimizações
- [ ] Deploy
- [ ] Documentação

## 🎯 Próximos Passos Imediatos

1. **Confirmar o plano** com o usuário
2. **Analisar frontends existentes** mencionados
3. **Iniciar reestruturação** de diretórios
4. **Expandir banco de dados** com novas tabelas
5. **Implementar sistema de roteamento** multi-portal

Este plano detalhado fornece um roadmap claro para transformar a aplicação atual em uma plataforma completa e robusta para o mercado de serviços gastronômicos.