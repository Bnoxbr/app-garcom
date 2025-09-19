# Área Técnica

Este documento contém informações técnicas sobre o projeto, incluindo configuração, implementação e outros detalhes.

# Documentação Técnica Consolidada

## Chat em Tempo Real com Supabase

### Visão Geral

Este documento descreve a arquitetura e implementação de um sistema de chat em tempo real usando Supabase, focado em escalabilidade, segurança e eficiência. A solução utiliza o Realtime e as Funções de Borda (Edge Functions) do Supabase para garantir uma comunicação fluida e segura entre clientes e prestadores de serviço.

### Funcionalidades Principais

- **Mensagens em Tempo Real:** Troca de mensagens instantâneas entre usuários.
- **Status de Presença:** Exibição do status online/offline dos usuários.
- **Confirmação de Leitura:** Indicador de que a mensagem foi lida pelo destinatário.
- **Notificações:** Alertas sobre novas mensagens, mesmo quando o aplicativo está em segundo plano.
- **Segurança:** Políticas de RLS (Row Level Security) para garantir que apenas os usuários autorizados possam acessar as conversas.

### Arquitetura

1.  **Banco de Dados (PostgreSQL):**
    *   Tabelas para armazenar mensagens, conversas e participantes.
    *   Políticas de RLS para controlar o acesso aos dados.
2.  **Realtime (Supabase):**
    *   Utiliza websockets para transmitir mensagens em tempo real.
    *   Os clientes se inscrevem em "canais" específicos (por exemplo, um canal por conversa).
3.  **Edge Functions (Deno):**
    *   Lógica de negócios mais complexa, como o envio de notificações push.
    *   Validação de dados e processamento de eventos.
4.  **Cliente (React/Next.js):**
    *   Interface do usuário para o chat.
    *   Utiliza a biblioteca `supabase-js` para interagir com o backend.

### Estrutura do Banco de Dados

```sql
-- Tabela de Conversas
CREATE TABLE conversas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de Participantes da Conversa
CREATE TABLE participantes_conversa (
  conversa_id UUID REFERENCES conversas(id),
  user_id UUID REFERENCES auth.users(id),
  PRIMARY KEY (conversa_id, user_id)
);

-- Tabela de Mensagens
CREATE TABLE mensagens (
  id BIGSERIAL PRIMARY KEY,
  conversa_id UUID REFERENCES conversas(id),
  sender_id UUID REFERENCES auth.users(id),
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  read_at TIMESTAMPTZ
);
```

### Políticas de Segurança (RLS)

As políticas de RLS são cruciais para a segurança do chat.

```sql
-- Permite que usuários vejam apenas as conversas das quais participam.
CREATE POLICY "select_conversas" ON conversas FOR SELECT
USING (id IN (
  SELECT conversa_id FROM participantes_conversa WHERE user_id = auth.uid()
));

-- Permite que usuários vejam apenas as mensagens das conversas das quais participam.
CREATE POLICY "select_mensagens" ON mensagens FOR SELECT
USING (conversa_id IN (
  SELECT conversa_id FROM participantes_conversa WHERE user_id = auth.uid()
));

-- Permite que usuários insiram mensagens apenas nas conversas das quais participam.
CREATE POLICY "insert_mensagens" ON mensagens FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  conversa_id IN (
    SELECT conversa_id FROM participantes_conversa WHERE user_id = auth.uid()
  )
);
```

### Implementação do Cliente (React)

O cliente React usará a biblioteca `supabase-js` para se conectar ao Supabase.

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Inscrever-se para receber novas mensagens em uma conversa
const channel = supabase.channel(`conversa:${conversaId}`);

channel
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'mensagens',
    filter: `conversa_id=eq.${conversaId}`
  }, (payload) => {
    console.log('Nova mensagem:', payload.new);
    // Adicionar a nova mensagem à interface do usuário
  })
  .subscribe();

// Enviar uma nova mensagem
async function enviarMensagem(conversaId, texto) {
  const { data, error } = await supabase
    .from('mensagens')
    .insert([{ conversa_id: conversaId, content: texto, sender_id: supabase.auth.user().id }]);

  if (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
}
```

### Notificações Push com Edge Functions

Uma Edge Function pode ser usada para enviar notificações push quando uma nova mensagem é inserida.

1.  **Criação de um gatilho (trigger) no banco de dados:**
    *   Um gatilho na tabela `mensagens` chama uma função PostgreSQL sempre que uma nova mensagem é inserida.
2.  **Função PostgreSQL:**
    *   Esta função envia uma requisição HTTP para a Edge Function, passando os detalhes da mensagem.
3.  **Edge Function:**
    *   Recebe a requisição, busca os tokens de notificação dos destinatários e envia a notificação push através de um serviço como o Firebase Cloud Messaging (FCM).

Este é um resumo da implementação do chat em tempo real. A combinação de Realtime, Edge Functions e RLS do Supabase oferece uma solução poderosa e segura.

## Plano de Implementação Faseado

### Visão Geral

Este plano de implementação faseado foi projetado para garantir uma entrega incremental e de alta qualidade da plataforma. Cada fase foca em um conjunto específico de funcionalidades, permitindo testes e validações contínuas.

### Fase 1: Fundação e Autenticação (Concluída)

- **Objetivo:** Estabelecer a base do projeto, configurar o ambiente de desenvolvimento e implementar um sistema de autenticação robusto.
- **Status:** 🟢 Concluída
- **Entregas:**
    - [x] Configuração do projeto (Vite, React, TypeScript)
    - [x] Integração com Supabase
    - [x] Sistema de autenticação completo (Login, Registro, Recuperação de Senha)
    - [x] Proteção de rotas
    - [x] Estrutura de componentes UI básicos

### Fase 2: Perfis de Usuário e Gerenciamento de Dados

- **Objetivo:** Implementar os perfis de cliente e prestador de serviço, permitindo o gerenciamento de dados pessoais e profissionais.
- **Status:** 🟡 Em Andamento
- **Entregas:**
    - [ ] **Perfil do Cliente:**
        - [ ] Visualização e edição de dados pessoais
        - [ ] Histórico de eventos e contratações
        - [ ] Gerenciamento de pagamentos
    - [ ] **Perfil do Prestador:**
        - [ ] Criação e edição de perfil profissional (fotos, descrição, etc.)
        - [ ] Gerenciamento de portfólio
        - [ ] Definição de serviços e preços
        - [ ] Configuração de agenda e disponibilidade

### Fase 3: Funcionalidades Principais - Eventos e Busca

- **Objetivo:** Desenvolver as funcionalidades centrais da plataforma, como a criação de eventos e a busca por prestadores.
- **Status:** 🔴 Não Iniciada
- **Entregas:**
    - [ ] **Criação de Eventos:**
        - [ ] Formulário de criação de eventos (data, local, tipo, etc.)
        - [ ] Dashboard de gerenciamento de eventos
    - [ ] **Busca de Prestadores:**
        - [ ] Filtros de busca (especialidade, localização, avaliação)
        - [ ] Visualização de perfis de prestadores
        - [ ] Sistema de avaliações e reviews

### Fase 4: Interação e Comunicação

- **Objetivo:** Implementar as funcionalidades de comunicação em tempo real e agendamento.
- **Status:** 🔴 Não Iniciada
- **Entregas:**
    - [ ] **Chat em Tempo Real:**
        - [ ] Comunicação direta entre cliente e prestador
        - [ ] Notificações de novas mensagens
    - [ ] **Sistema de Agendamento:**
        - [ ] Solicitação de agendamento
        - [ ] Confirmação e cancelamento de horários
        - [ ] Integração com a agenda do prestador

### Fase 5: Leilão de Serviços e Pagamentos

- **Objetivo:** Desenvolver o sistema de leilão reverso e integrar a solução de pagamentos.
- **Status:** 🔴 Não Iniciada
- **Entregas:**
    - [ ] **Leilão Reverso:**
        - [ ] Cliente posta um serviço e prestadores fazem lances
        - [ ] Sistema de notificações para novos lances
    - [ ] **Integração de Pagamentos:**
        - [ ] Pagamento seguro para contratação de serviços
        - [ ] Sistema de comissão da plataforma
        - [ ] Geração de faturas e recibos

### Fase 6: Finalização e Deploy

- **Objetivo:** Realizar os testes finais, otimizações e o deploy da aplicação.
- **Status:** 🔴 Não Iniciada
- **Entregas:**
    - [ ] Testes de ponta a ponta (E2E)
    - [ ] Otimização de performance
    - [ ] Configuração do ambiente de produção
    - [ ] Deploy da aplicação

Este plano faseado garante que a plataforma seja construída de forma modular e escalável, facilitando a manutenção e a adição de novas funcionalidades no futuro.

## Configuração do Supabase

### Credenciais e Acesso

- **URL do Projeto:** `https://rtcafnmyuybhxkcxkrzz.supabase.co`
- **Chave Anônima (public):**
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Y2Fmbm15dXliaHhrY3hrcnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExMTEwMTYsImV4cCI6MjAzNjY4NzAxNn0.8s1z_1-32423-FADDS-asdd-asdasd-asdasd`
- **Chave de Serviço (secret):**
  `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0Y2Fmbm15dXliaHhrY3hrcnp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyMTExMTAxNiwiZXhwIjoyMDM2Njg3MDE2fQ.adsasd-asdasd-asdas-dasdasd-asdasd-asdasd`

**Nota:** As chaves foram armazenadas de forma segura no arquivo `.env` do projeto para garantir que não sejam expostas no código-fonte.

### Migrações e Estrutura do Banco de Dados

- **Localização:** As migrações SQL estão no diretório `database/migrations`.
- **Execução:** As migrações devem ser executadas no SQL Editor do Supabase para garantir que a estrutura do banco de dados esteja correta.
- **Seed Data:** Dados de exemplo estão disponíveis em `database/seed-data.sql` para popular o banco de dados em ambientes de desenvolvimento.

### Políticas de Segurança (RLS - Row-Level Security)

- **Status:** Políticas básicas de RLS foram implementadas para proteger as tabelas principais.
- **Verificação:** É crucial verificar e refinar essas políticas para garantir que os usuários só possam acessar os dados que lhes são permitidos.
- **Exemplo de Política (Tabela `profiles`):**
  ```sql
  -- Permite que usuários vejam apenas seus próprios perfis
  CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  USING (id = auth.uid());

  -- Permite que usuários atualizem apenas seus próprios perfis
  CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  USING (id = auth.uid());
  ```

### Funções RPC (Remote Procedure Call)

- **Utilização:** Funções RPC são usadas para encapsular lógica de negócios complexa no lado do servidor.
- **Exemplo de Função (`create_user_profile`):**
  ```sql
  -- Função para criar um perfil de usuário automaticamente após o registro
  CREATE OR REPLACE FUNCTION public.create_user_profile()
  RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (new.id, new.email);
    RETURN new;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Gatilho que chama a função após a inserção de um novo usuário
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.create_user_profile();
  ```

### Próximos Passos

1.  **Revisar Políticas de RLS:** Analisar todas as tabelas e garantir que as políticas de RLS estejam corretas e seguras.
2.  **Executar Migrações:** Garantir que todas as migrações foram executadas no ambiente de produção.
3.  **Testar Funções RPC:** Verificar se todas as funções RPC estão funcionando conforme o esperado.

## Fluxo de Pagamento Antecipado com Retenção

### Visão Geral

Este documento detalha o fluxo de pagamento antecipado com retenção, projetado para garantir a segurança das transações entre clientes e prestadores de serviço. O sistema retém o pagamento do cliente até que o serviço seja concluído e aprovado, liberando o valor para o prestador posteriormente.

### Estrutura de Comissões

- **Taxa da Plataforma:** 10% sobre o valor total do serviço.
- **Taxa de Processamento de Pagamento:** 2.99% + R$0.50 por transação (exemplo Stripe/Mercado Pago).

### Fluxo Detalhado

1.  **Cliente Contrata Serviço:**
    *   O cliente seleciona um prestador e um serviço.
    *   O valor total do serviço é calculado, incluindo a taxa da plataforma.
2.  **Pagamento Antecipado:**
    *   O cliente realiza o pagamento total através da plataforma (cartão de crédito, Pix, etc.).
    *   O valor é retido em uma conta de custódia (escrow) da plataforma.
    *   O prestador é notificado sobre o pagamento pendente.
3.  **Serviço Realizado:**
    *   O prestador executa o serviço.
    *   Após a conclusão, o prestador marca o serviço como "concluído" na plataforma.
4.  **Aprovação do Cliente:**
    *   O cliente tem um período (ex: 48 horas) para revisar e aprovar o serviço.
    *   Se o cliente aprovar, o fluxo de liberação de pagamento é iniciado.
    *   Se o cliente não se manifestar dentro do prazo, o serviço é automaticamente aprovado.
5.  **Liberação do Pagamento:**
    *   Após a aprovação, o valor retido é processado.
    *   A taxa da plataforma e a taxa de processamento de pagamento são deduzidas.
    *   O valor restante é transferido para a conta do prestador.
6.  **Disputas (Opcional):**
    *   Se o cliente não aprovar o serviço, um processo de disputa pode ser iniciado.
    *   A plataforma atua como mediadora para resolver o conflito.

### Funções Principais

-   `processPayment(clientId, serviceId, amount)`: Inicia o pagamento e retém o valor.
-   `markServiceCompleted(serviceId, providerId)`: Marca o serviço como concluído pelo prestador.
-   `approveService(serviceId, clientId)`: Aprova o serviço pelo cliente.
-   `releasePayment(serviceId)`: Libera o pagamento para o prestador, deduzindo as taxas.
-   `initiateDispute(serviceId, clientId)`: Inicia um processo de disputa.

### Campos do Banco de Dados Relevantes

-   **Tabela `payments`:**
    *   `id` (UUID)
    *   `client_id` (UUID)
    *   `provider_id` (UUID)
    *   `service_id` (UUID)
    *   `amount` (DECIMAL)
    *   `platform_fee` (DECIMAL)
    *   `processing_fee` (DECIMAL)
    *   `status` (ENUM: `pending`, `held`, `released`, `disputed`, `refunded`)
    *   `paid_at` (TIMESTAMPTZ)
    *   `released_at` (TIMESTAMPTZ)
-   **Tabela `services`:**
    *   `id` (UUID)
    *   `status` (ENUM: `pending`, `in_progress`, `completed_by_provider`, `approved_by_client`, `disputed`)

Este fluxo garante que tanto clientes quanto prestadores tenham segurança e confiança ao utilizar a plataforma, protegendo ambas as partes durante o processo de contratação e execução de serviços.

## Instruções para Upload de Frontends Existentes

### Estrutura de Diretórios

Para garantir uma análise eficiente e organizada, por favor, siga a estrutura de diretórios abaixo ao fazer o upload dos códigos dos frontends existentes:

```
frontends-existentes/
├── perfil-cliente/             # Código do frontend do cliente
├── perfil-prestador/           # Código do frontend do prestador
└── sistema-leilao/             # Código do frontend do leilão
```

### Passos para Preparar os Códigos

1.  **Organize o Código:** Para cada frontend, crie uma pasta com o nome correspondente (ex: `perfil-cliente`).
2.  **Inclua o Código Fonte:** Dentro de cada pasta, coloque todo o código-fonte (`src`, `components`, `pages`, etc.).
3.  **Adicione o `package.json`:** Certifique-se de que o arquivo `package.json` está na raiz da pasta de cada frontend, contendo todas as dependências e scripts.
4.  **Preencha o `info.md`:** Em cada pasta, crie um arquivo `info.md` e preencha com as informações solicitadas no template abaixo.
5.  **Adicione Screenshots:** Crie uma pasta `screenshots` dentro de cada diretório de frontend e adicione capturas de tela das principais funcionalidades.

### Template do Arquivo `info.md`

Copie e preencha o seguinte template para cada frontend:

```markdown
# Informações do Frontend - [Nome do Frontend]

## Tecnologias Utilizadas
- **Framework:** [React/Vue/Angular/Outro]
- **Linguagem:** [JavaScript/TypeScript]
- **Estilização:** [CSS/SCSS/Styled Components/Tailwind]

## Status do Desenvolvimento
- **Completude:** [Ex: 80%]
- **Funcionalidades Implementadas:**
  - [ ] Funcionalidade 1
  - [ ] Funcionalidade 2

## Integrações Existentes
- **Backend:** [Qual API/serviço]
- **Autenticação:** [Implementada? Qual sistema?]

## Problemas Conhecidos
- [Liste os problemas conhecidos]
```

### Exemplo de Estrutura Final

```
frontends-existentes/
└── perfil-cliente/
    ├── src/
    ├── package.json
    ├── info.md
    └── screenshots/
        ├── login.png
        └── dashboard.png
```

Seguir estas instruções garantirá que a análise técnica seja feita de forma rápida e precisa, permitindo um plano de migração mais eficaz.

# Frontends Existentes - Área de Upload e Análise

## 📁 Estrutura para Upload dos Códigos

Este diretório foi criado para receber os códigos dos frontends existentes mencionados. Por favor, organize os arquivos conforme a estrutura abaixo:

### 📂 Estrutura Recomendada:

```
frontends-existentes/
├── README.md                    # Este arquivo
├── perfil-cliente/             # Frontend do perfil do cliente
│   ├── src/                    # Código fonte
│   ├── package.json            # Dependências
│   ├── README.md               # Documentação específica
│   └── screenshots/            # Capturas de tela (opcional)
├── perfil-prestador/           # Frontend do perfil do prestador
│   ├── src/                    # Código fonte
│   ├── package.json            # Dependências
│   ├── README.md               # Documentação específica
│   └── screenshots/            # Capturas de tela (opcional)
├── sistema-leilao/             # Frontend do sistema de leilão
│   ├── src/                    # Código fonte
│   ├── package.json            # Dependências
│   ├── README.md               # Documentação específica
│   └── screenshots/            # Capturas de tela (opcional)
└── analise-tecnica/            # Resultados da análise (será criado automaticamente)
    ├── compatibilidade.md
    ├── estrategia-migracao.md
    └── cronograma-especifico.md
```

## 📋 Informações Necessárias para Cada Frontend

### Para cada frontend, inclua:

#### 1. **Código Fonte Completo**
- Todos os arquivos `.js`, `.ts`, `.jsx`, `.tsx`
- Arquivos de configuração (webpack, vite, etc.)
- Arquivos de estilo (CSS, SCSS, etc.)
- Assets (imagens, ícones, etc.)

#### 2. **Arquivo package.json**
- Lista completa de dependências
- Scripts de build e desenvolvimento
- Versões específicas das bibliotecas

#### 3. **Documentação (se disponível)**
- README.md do projeto
- Documentação de APIs
- Guias de instalação
- Arquitetura do projeto

#### 4. **Screenshots/Demos (opcional mas recomendado)**
- Capturas de tela das principais telas
- GIFs demonstrando funcionalidades
- Links para demos online (se disponível)

## 🔍 Informações Específicas Necessárias

### Para facilitar a análise, inclua um arquivo `info.md` em cada pasta com:

```markdown
# Informações do Frontend - [Nome]

## Tecnologias Utilizadas
- **Framework:** React/Vue/Angular/Outro
- **Linguagem:** JavaScript/TypeScript
- **Versão:** 
- **Estilização:** CSS/SCSS/Styled Components/Tailwind/Outro
- **Estado:** Redux/Context/Zustand/Outro
- **Roteamento:** React Router/Vue Router/Outro

## Status do Desenvolvimento
- **Completude:** 30%/50%/80%/100%
- **Funcionalidades Implementadas:**
  - [ ] Funcionalidade 1
  - [ ] Funcionalidade 2
  - [ ] Funcionalidade 3

## Funcionalidades Principais
1. **Feature 1:** Descrição
2. **Feature 2:** Descrição
3. **Feature 3:** Descrição

## Integrações Existentes
- **Backend:** Qual API/serviço
- **Autenticação:** Implementada? Qual sistema?
- **Banco de Dados:** Qual? Como conecta?
- **Pagamentos:** Implementado? Qual gateway?

## Dependências Críticas
- Biblioteca X (versão Y)
- Serviço Z
- API W

## Problemas Conhecidos
- Problema 1
- Problema 2

## Observações Adicionais
- Notas importantes
- Considerações especiais
- Limitações conhecidas
```

## 🚀 Processo de Análise

### Após o upload, realizarei:

1. **Análise Técnica Detalhada**
   - Compatibilidade com React 19 + TypeScript
   - Avaliação da qualidade do código
   - Identificação de dependências conflitantes
   - Mapeamento de funcionalidades

2. **Estratégia de Migração**
   - Migração direta vs. recriação
   - Cronograma específico
   - Pontos de risco
   - Recursos necessários

3. **Plano de Integração**
   - Ordem de implementação
   - Adaptações necessárias
   - Testes de compatibilidade
   - Cronograma realista

## 📝 Template de Upload

### Para cada frontend, crie a seguinte estrutura:

```
[nome-do-frontend]/
├── src/                        # Código fonte completo
├── package.json                # Dependências
├── info.md                     # Informações específicas
├── README.md                   # Documentação original
└── screenshots/                # Capturas de tela
    ├── tela-principal.png
    ├── funcionalidade-1.png
    └── demo.gif
```

## ⚡ Próximos Passos

1. **Faça upload dos códigos** seguindo a estrutura acima
2. **Preencha os arquivos info.md** com as informações solicitadas
3. **Inclua screenshots** das principais funcionalidades
4. **Aguarde a análise técnica** completa
5. **Receba o plano específico** de migração e integração

---

**📞 Dúvidas?** Se tiver alguma dúvida sobre como organizar os arquivos ou quais informações incluir, me informe que posso ajudar a esclarecer.

**🎯 Objetivo:** Com essas informações, poderei criar um plano de migração específico e realista para cada frontend, otimizando o processo de integração na plataforma unificada.

---

*Última atualização: 18/07/2024*

*Nota: Sempre que este documento for atualizado ou alterado, a data da última alteração deve ser atualizada acima.*

# Resumo da Estrutura para Análise de Frontends

## 🎯 Objetivo

O objetivo desta estrutura é organizar e centralizar as informações dos frontends existentes (`perfil-cliente`, `perfil-prestador`, `sistema-leilao`) para facilitar a análise técnica e planejar a migração para uma plataforma unificada baseada em **React 19** e **TypeScript**.

## 📂 Estrutura de Diretórios

A pasta `frontends-existentes` foi criada para conter os códigos e informações de cada projeto.

```
frontends-existentes/
├── README.md                    # Instruções detalhadas para upload e análise
├── RESUMO_ESTRUTURA.md          # Este arquivo
├── perfil-cliente/             # Código e informações do frontend do cliente
│   ├── info.md                 # Template de informações preenchível
│   └── ...                     # Código fonte, package.json, etc.
├── perfil-prestador/           # Código e informações do frontend do prestador
│   ├── info.md                 # Template de informações preenchível
│   └── ...
└── sistema-leilao/             # Código e informações do sistema de leilão
    ├── info.md                 # Template de informações preenchível
    └── ...
```

## 📝 Arquivo `info.md`

Para cada frontend, há um arquivo `info.md` que serve como um template para coletar dados essenciais. Ele deve ser preenchido com:

- **Tecnologias Utilizadas:** Framework, linguagem, estilização, estado, etc.
- **Status do Desenvolvimento:** Percentual de completude e funcionalidades implementadas.
- **Funcionalidades Principais:** Descrição das features mais importantes.
- **Integrações Existentes:** Conexões com backend, autenticação, banco de dados.
- **Dependências Críticas:** Bibliotecas ou serviços essenciais.
- **Problemas Conhecidos:** Bugs ou limitações atuais.

## 🚀 Processo

1. **Upload:** O código de cada frontend é colocado em sua respectiva pasta.
2. **Preenchimento:** O arquivo `info.md` de cada pasta é preenchido.
3. **Análise:** Com base nas informações e no código, será feita uma análise de compatibilidade e esforço de migração.
4. **Plano de Ação:** Será criado um plano detalhado para a integração de cada frontend na nova plataforma.

## ✅ Benefícios

- **Centralização:** Todas as informações em um único local.
- **Clareza:** Visão clara do status e tecnologia de cada projeto.
- **Eficiência:** Análise mais rápida e precisa.
- **Planejamento:** Base sólida para um cronograma de migração realista.

---
*Este resumo serve como um guia rápido. Para detalhes completos, consulte o `README.md` na mesma pasta.*

# Informações do Frontend - Perfil do Cliente

## Tecnologias Utilizadas
- **Framework:** React
- **Linguagem:** TypeScript
- **Versão:** 18.2.0
- **Estilização:** Styled Components
- **Estado:** Context API
- **Roteamento:** React Router DOM

## Status do Desenvolvimento
- **Completude:** 80%
- **Funcionalidades Implementadas:**
  - [x] Cadastro e Login de Cliente
  - [x] Visualização e Edição de Perfil
  - [x] Histórico de Pedidos
  - [x] Endereços de Entrega
  - [ ] Sistema de Avaliação de Prestadores
  - [ ] Notificações em Tempo Real

## Funcionalidades Principais
1. **Gerenciamento de Perfil:** Permite que o cliente crie, visualize e edite suas informações pessoais, como nome, contato e foto de perfil.
2. **Histórico de Pedidos:** Exibe uma lista de todos os pedidos realizados, com detalhes sobre status, itens e valores.
3. **Endereços:** O cliente pode cadastrar, editar e excluir múltiplos endereços de entrega.

## Integrações Existentes
- **Backend:** Conecta-se a uma API RESTful para todas as operações de dados.
- **Autenticação:** Utiliza um sistema de autenticação baseado em JWT (JSON Web Tokens).
- **Banco de Dados:** Interage indiretamente com um banco de dados PostgreSQL através da API.
- **Pagamentos:** Não implementado. A integração com um gateway de pagamento é um próximo passo.

## Dependências Críticas
- **React (v18.2.0):** Biblioteca principal para a construção da interface.
- **Styled Components (v5.3.5):** Para estilização dos componentes.
- **React Router DOM (v6.3.0):** Para gerenciamento de rotas na aplicação.
- **Axios (v0.27.2):** Para realizar requisições HTTP à API.

## Problemas Conhecidos
- **Performance:** A lista de histórico de pedidos pode carregar lentamente com um grande volume de dados.
- **UI/UX:** A interface de edição de perfil precisa de melhorias na usabilidade.

## Observações Adicionais
- O código foi desenvolvido com foco em componentes reutilizáveis.
- A estrutura do projeto segue as melhores práticas de organização de pastas e arquivos em projetos React.
- É necessário implementar testes unitários e de integração.