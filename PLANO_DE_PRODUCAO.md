# 🚀 Plano de Produção: Implementação do Modelo "Perfil como Anúncio"

**Última atualização:** 07 de Outubro de 2025

## 1. Visão Geral

Este documento descreve o plano de ação para a implementação do modelo **"Perfil como Anúncio"**. O objetivo é alinhar o desenvolvimento dos Micro-Frontends (`app-principal` e `app-garcom-prestador`) com a infraestrutura de backend já concluída no Supabase.

Este plano substitui versões anteriores e está alinhado com os documentos `FLUXO_DE_CONTRATACAO_V2.md` e `PROJETO_STATUS_ATUAL.md`.

## 2. Status da Arquitetura

- **Arquitetura:** Micro-Frontends com PWA.
  - `app-principal`: Aplicativo do Contratante.
  - `app-garcom-prestador`: Aplicativo do Prestador de Serviço.
- **Backend (Supabase):** 🟢 **Concluído**. A infraestrutura está pronta para ser consumida.

## 3. Plano de Implementação do Frontend (Nossa Responsabilidade)

O foco exclusivo do desenvolvimento é no frontend. As tarefas estão divididas entre os dois aplicativos.

### 3.1. App do Prestador (`app-garcom-prestador`)

| Fase | Tarefa | Status |
| :--- | :--- | :--- |
| **1** | **Gestão do Perfil/Oferta** | 🔴 Não Iniciada |
| | 1.1. UI para criar e editar o perfil profissional (valor, disponibilidade, etc.). | 🔴 Não Iniciada |
| **2** | **Gestão de Contratações** | 🔴 Não Iniciada |
| | 2.1. Dashboard para visualizar pedidos de contratação (`status = 'pendente'`). | 🔴 Não Iniciada |
| | 2.2. Implementar ações de "Confirmar" ou "Recusar" contratação. | 🔴 Não Iniciada |
| **3** | **Execução do Serviço** | 🔴 Não Iniciada |
| | 3.1. UI para visualizar serviços confirmados (`status = 'aceito'`). | 🔴 Não Iniciada |
| | 3.2. Funcionalidade de Check-in e Check-out no dia do serviço. | 🔴 Não Iniciada |

### 3.2. App do Contratante (`app-principal`)

| Fase | Tarefa | Status |
| :--- | :--- | :--- |
| **1** | **Descoberta e Contratação** | 🟡 Em Andamento |
| | 1.1. UI para navegar e buscar no catálogo de perfis de profissionais. | 🟡 Em Andamento |
| | 1.2. Implementar filtros (categoria, avaliação, etc.). | 🔴 Não Iniciada |
| | 1.3. UI do formulário de contratação (data, hora, local). | 🔴 Não Iniciada |
| **2** | **Pagamento** | 🔴 Não Iniciada |
| | 2.1. Integração com SDK do Mercado Pago para pagamento no ato da contratação. | 🔴 Não Iniciada |
| | 2.2. Criar páginas de status de pagamento (Sucesso, Erro, Pendente). | 🟡 Em Andamento |
| **3** | **Pós-Serviço** | 🔴 Não Iniciada |
| | 3.1. UI para avaliação do serviço e do profissional. | 🔴 Não Iniciada |
| | 3.2. Dashboard para visualizar histórico de serviços contratados. | 🟡 Em Andamento |

### 3.3. Tarefas Comuns (Ambos os Apps)

| Fase | Tarefa | Status |
| :--- | :--- | :--- |
| **1** | **Notificações** | 🔴 Não Iniciada |
| | 1.1. Implementar sistema de notificações em tempo real para eventos críticos. | 🔴 Não Iniciada |
| **2** | **Testes e Deploy** | 🔴 Não Iniciada |
| | 2.1. Testes de integração ponta a ponta do novo fluxo. | 🔴 Não Iniciada |
| | 2.2. Deploy para ambiente de produção. | 🔴 Não Iniciada |