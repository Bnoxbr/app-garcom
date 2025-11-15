# 🚀 Plano de Produção: Integração do Fluxo de Contratação

**Última atualização:** 24/07/2024

## 1. Visão Geral

Este documento descreve o plano de ação para a implementação e o lançamento do fluxo de contratação ponta a ponta na plataforma "App Garçom". O objetivo é integrar o `app-principal` (Contratante) e o `app-prestador` (Prestador de Serviço) com o backend no Supabase, garantindo uma experiência coesa e funcional para ambos os usuários.

O plano está alinhado com os documentos `FLUXO_DE_CONTRATACAO_V2.md` e `PROJETO_STATUS_ATUAL.md`.

## 2. Arquitetura e Divisão de Responsabilidades

- **Arquitetura:** Micro-Frontends com PWA.
  - `app-principal`: Aplicativo do Contratante.
  - `app-prestador`: Aplicativo do Prestador de Serviço.
- **Backend:** Centralizado no Supabase.

- **Divisão de Responsabilidades:**
  - **Backend (Supabase):** Sob responsabilidade do Arquiteto de Software/DBA.
  - **Frontend (React/PWA):** Sob responsabilidade do time de desenvolvimento front-end (nossa equipe).

## 3. Plano de Implementação do Backend (A ser executado pelo DBA)

Esta é a lista de tarefas que o responsável pelo backend deve seguir para preparar a infraestrutura no Supabase.

### 3.1. Tipos e Tabelas

- **Criar ENUM `status_servico`:**
  ```sql
  CREATE TYPE status_servico AS ENUM (
      'disponivel',
      'agendado',
      'em_andamento',
      'concluido',
      'cancelado'
  );
  ```

- **Criar Tabela `servicos_realizados`:**
  ```sql
  CREATE TABLE servicos_realizados (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      id_contratante UUID REFERENCES auth.users(id),
      id_prestador UUID REFERENCES auth.users(id),
      data_servico TIMESTAMP WITH TIME ZONE NOT NULL,
      valor_acordado NUMERIC(10, 2) NOT NULL,
      status status_servico NOT NULL DEFAULT 'disponivel',
      check_in TIMESTAMP WITH TIME ZONE,
      check_out TIMESTAMP WITH TIME ZONE,
      localizacao_check_in GEOMETRY(Point, 4326),
      localizacao_check_out GEOMETRY(Point, 4326),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
  ```

- **Criar Tabela `transacoes`:**
  ```sql
  CREATE TABLE transacoes (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      id_servico UUID REFERENCES servicos_realizados(id),
      id_pagamento_gateway TEXT NOT NULL, -- ID do pagamento no Mercado Pago
      status_pagamento TEXT NOT NULL, -- ex: 'approved', 'pending', 'rejected'
      valor_total NUMERIC(10, 2) NOT NULL,
      taxa_plataforma NUMERIC(10, 2) NOT NULL,
      valor_liquido_prestador NUMERIC(10, 2) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
  );
  ```

- **Habilitar Extensão `postgis`:**
  ```sql
  CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
  ```

### 3.2. Funções RPC (Remote Procedure Call)

- **`procurar_profissionais(distancia_maxima, lat, long)`:** Para buscar profissionais disponíveis numa área.
- **`realizar_check_in(id_servico, lat, long)`:** Para o prestador iniciar o serviço.
- **`realizar_check_out(id_servico, lat, long)`:** Para o prestador finalizar o serviço.

### 3.3. Lógica de Pagamento (Backend)

- **Criar Webhook no Supabase:** Configurar um endpoint para receber notificações do Mercado Pago.
- **Criar Edge Function `processar-pagamento`:**
  - Recebe a notificação do webhook.
  - Calcula a taxa da plataforma (15%).
  - Libera o pagamento para o prestador.
  - Registra a transação na tabela `transacoes`.

## 4. Plano de Implementação do Frontend (Nossa Responsabilidade)

Este é o checklist que guia nosso desenvolvimento.

| Fase | Tarefa | App Alvo | Status |
| :--- | :--- | :--- | :--- |
| **1** | **Jornada do Contratante** | `app-principal` | 🔴 Não Iniciada |
| | 1.1. UI para criar oferta de serviço | `app-principal` | 🔴 Não Iniciada |
| | 1.2. UI para buscar e selecionar profissionais (integrar com RPC) | `app-principal` | 🔴 Não Iniciada |
| | 1.3. Integração com Gateway de Pagamento (SDK Frontend do Mercado Pago) | `app-principal` | 🔴 Não Iniciada |
| | 1.4. UI para avaliação do serviço após conclusão | `app-principal` | 🔴 Não Iniciada |
| **2** | **Jornada do Prestador** | `app-prestador` | 🔴 Não Iniciada |
| | 2.1. Dashboard para visualizar e aceitar ofertas de serviço | `app-prestador` | 🔴 Não Iniciada |
| | 2.2. Funcionalidade de Check-in e Check-out (integrar com RPC) | `app-prestador` | 🔴 Não Iniciada |
| **3** | **Notificações e Finalização** | `Ambos` | 🔴 Não Iniciada |
| | 3.1. Implementar sistema de notificações em tempo real (Supabase Realtime) | `Ambos` | 🔴 Não Iniciada |
| **4** | **Testes e Deploy** | `Ambos` | 🔴 Não Iniciada |
| | 4.1. Testes de integração ponta a ponta do fluxo | `Ambos` | 🔴 Não Iniciada |
| | 4.2. Deploy para ambiente de produção | `Ambos` | 🔴 Não Iniciada |