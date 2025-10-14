# Documento de Especificação: Fluxo de Contratação (Modelo "Perfil como Anúncio") 
 
 **Versão:** 4.0 
 **Data:** 07 de Outubro de 2025 
 **Modelo:** Perfil como Anúncio (Iniciado pelo Contratante) 
 
 --- 
 
 ## 1. Visão Geral e Arquitetura 
 
 Este documento define o fluxo de trabalho para a plataforma, operando sob o modelo "Perfil como Anúncio". Neste modelo, o **perfil do Prestador é a sua oferta de serviço principal**, e o **Contratante inicia a contratação** a partir desse perfil. A arquitetura de Micro-Frontends e Banco de Dados Centralizado (Supabase) é mantida. 
 
 ### 1.1. Atores e Responsabilidades 
 
 | Ator          | Repositório Frontend   | Responsabilidades Principais                                                                                                                              | 
 | :------------ | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- | 
 | **Prestador** | `app-garcom-prestador` | 1. **Manter o seu Perfil atualizado (a sua "oferta").** <br> 2. Confirmar os pedidos de contratação. <br> 3. Realizar Check-in/Check-out.               | 
 | **Contratante** | `app-principal`        | 1. Navegar e filtrar o "catálogo" de **perfis de profissionais**. <br> 2. Iniciar o processo de contratação. <br> 3. Realizar o pagamento (que fica retido). | 
 
 ### 1.2. Status de Implementação 
 
 -   **Backend (Supabase):** 🟢 **Concluído.** Toda a infraestrutura de backend (tabelas, políticas de segurança, etc.) está pronta para suportar este fluxo. 
 -   **Frontend (React):** 🟡 **Em Andamento.** O foco é a integração das interfaces para executar este fluxo. 
 
 --- 
 
 ## 2. Diagrama de Fluxo (Modelo "Perfil como Anúncio") 
 
 ```mermaid 
 graph TD 
     subgraph Fluxo do Prestador 
         A[Mantém o Perfil Atualizado] --> B{Recebe Pedido de Contratação}; 
         B --> C[Confirma o Serviço]; 
     end 
 
     subgraph Fluxo do Contratante 
         D{Navega no Catálogo de Perfis} --> E[Encontra Profissional]; 
         E --> F{Clica em "Contratar Agora"}; 
         F --> G[Preenche Detalhes do Serviço (Data/Hora)]; 
     end 
     
     subgraph Fluxo do Serviço 
         H[Pedido de Contratação Enviado] --> I{Pagamento Retido (Escrow)}; 
         I --> J[Serviço Confirmado]; 
         J --> K[Check-in]; 
         K --> L[Check-out]; 
         L --> M[Pagamento Liberado]; 
     end 
 
     C --> J; 
     G --> H; 
     H --> B; 
 ```
 
 ## 3. Fase 1: Configuração da Oferta (Responsabilidade: App do Prestador) 
 Ação do Prestador: No seu dashboard, o prestador acede à página "Editar Perfil" (ProfileEditPage.tsx). 
 
 Definição da Oferta: Ele preenche os campos que definem a sua oferta de serviço: valor_hora, categoria, cidade_atuacao, disponibilidade_semanal, bio, etc. 
 
 Publicação: Ao salvar, os dados são atualizados na tabela professionals. O seu perfil passa a estar visível e "contratável" no catálogo do app principal. 
 
 ## 4. Fase 2: Descoberta e Contratação (Responsabilidade: App do Contratante) 
 Navegação: O Contratante acede à área de "Buscar Profissionais", que exibe uma grelha (ProfessionalGrid.tsx) de perfis da tabela professionals. 
 
 Ação de Contratar: Ao clicar no botão "Contratar Agora" no perfil de um profissional, o contratante é levado para um formulário de contratação. 
 
 Formulário de Contratação: Neste formulário, o Contratante define os detalhes específicos do trabalho: data, hora de início, hora de fim, e localização. 
 
 ### Pagamento e Criação do Serviço: 
 
 1. O sistema calcula o valor_total (com base no valor_hora do profissional e na duração do serviço). 
 2. O Contratante é direcionado para o gateway de pagamento. O valor é cobrado e retido (Escrow). 
 3. **Apenas se o pagamento for bem-sucedido**, um novo registo é criado na tabela servicos_realizados com o status = 'pendente', ligando o contratante_id ao professional_id. 
 
 ## 5. Fase 3 em Diante: Confirmação, Execução e Pagamento 
 A partir daqui, o fluxo segue como já documentado: 
 
 - **Fase 3 (Confirmação):** O Prestador recebe a notificação do serviço pendente e clica em "Confirmar" no seu dashboard, mudando o status para 'aceito'. 
 - **Fase 4 (Execução):** O Prestador realiza o Check-in e o Check-out. 
 - **Fase 5 (Liberação):** O Check-out aciona a liberação do pagamento retido.
