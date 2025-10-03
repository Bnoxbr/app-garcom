# Documentação do Módulo de Leilão

> Atualização — 03/10/2025: Seções revisadas com base no módulo em `AuctionDetails.tsx` e eventos Supabase Realtime para lances.

Este documento serve como a fonte da verdade para o design, regras de negócio e implementação técnica do sistema de leilões da plataforma.

## 1. Objetivo Principal

O objetivo do módulo de leilão é criar um ambiente justo e eficiente onde **Clientes Contratantes** possam postar necessidades de serviço e **Profissionais Prestadores** possam ofertar seus serviços, equilibrando expectativas e promovendo a melhor combinação entre oferta e demanda.

## 2. Papéis de Usuário e Permissões

### 2.1. Cliente Contratante
- **Pode:**
  - [ ] Criar um novo leilão para um serviço que necessita.
  - [ ] Visualizar os leilões que criou.
  - [ ] Visualizar os lances recebidos em seus leilões.
  - [ ] Aceitar um lance, selecionando um profissional vencedor.
  - [ ] Cancelar um leilão antes de um lance ser aceito.
- **Não Pode:**
  - [ ] Dar lances em qualquer leilão (nem nos seus próprios).
  - [ ] Ver leilões de outros contratantes.

### 2.2. Profissional Prestador
- **Pode:**
  - [ ] Visualizar todos os leilões ativos na plataforma.
  - [ ] Dar lances em leilões que lhe interessem.
  - [ ] Visualizar os lances que já deu.
  - [ ] Editar ou cancelar seu próprio lance (a definir as regras).
- **Não Pode:**
  - [ ] Criar leilões.
  - [ ] Ver os lances de outros profissionais no mesmo leilão. **(Definição V1: O modelo será "Leilão Cego" para incentivar a melhor oferta individual)**.

## 3. Fluxo do Leilão (Ciclo de Vida)

1.  **Criação (Contratante):**
    - O contratante preenche um formulário com:
      - Título do serviço.
      - Descrição detalhada.
      - Categoria do serviço.
      - Orçamento estimado (opcional?).
      - Prazo para conclusão.
      - Prazo para receber lances.
    - O leilão é criado com o status `ABERTO`.

2.  **Recebendo Lances (Profissional):**
    - Profissionais veem o leilão `ABERTO`.
    - Para dar um lance, o profissional informa:
      - Valor da sua oferta.
      - Uma mensagem/proposta para o contratante.
      - Prazo estimado para entrega.
    - O lance é registrado e associado ao leilão.

3.  **Seleção do Vencedor (Contratante):**
    - Após o fim do prazo para lances (ou a qualquer momento), o contratante revisa as propostas.
    - O contratante "aceita" um lance.
    - O leilão muda seu status para `FECHADO`.
    - O profissional vencedor é notificado. Os outros participantes também?

4.  **Pós-Leilão:**
    - Um canal de comunicação (chat?) é aberto entre o contratante e o profissional vencedor.
    - O pagamento é processado (integração com o sistema de pagamentos).

## 4. Arquitetura Técnica Implementada

A arquitetura foi simplificada para acelerar o desenvolvimento e manter a segurança, centralizando a lógica de negócios no frontend e delegando a segurança de dados para as Políticas de Segurança em Nível de Linha (RLS) do Supabase.

### 4.1. Banco de Dados (Supabase)

A estrutura das tabelas permanece a mesma, servindo como a base para os dados de leilões e lances.

- **Tabela `auctions`:** Armazena todos os leilões criados.
- **Tabela `bids`:** Armazena todos os lances feitos nos leilões.

### 4.2. Lógica de Negócios (Frontend)

Toda a lógica de interação com o Supabase foi consolidada no hook `useAuctions.ts`. A abordagem inicial de usar uma Edge Function (Deno) para a lógica de `acceptBid` foi descartada em favor de uma chamada direta do cliente, protegida por RLS.

- **Hook `useAuctions.ts`:**
  - `createAuction(auctionData)`: Cria um novo leilão.
  - `getAuctionById(id)`: Busca um leilão específico.
  - `getAuctionBids(auctionId)`: Busca os lances de um leilão.
  - `placeBid(bidData)`: Permite que um profissional faça um lance.
  - `acceptBid(bidId)`: Lógica para o criador do leilão aceitar um lance. Esta função agora executa uma atualização na tabela `auctions` diretamente do frontend, definindo o `winner_id` e o `winning_bid_id`, e mudando o status do leilão para `CLOSED`.

### 4.3. Segurança (Supabase RLS)

A segurança é o pilar desta arquitetura. As seguintes políticas foram implementadas para garantir que os dados só possam ser acessados e modificados pelas pessoas certas:

- **Tabela `auctions`:**
  - **Leitura:** Todos podem ver os leilões (`SELECT`).
  - **Criação:** Apenas usuários autenticados podem criar leilões (`INSERT`).
  - **Atualização:** Apenas o criador do leilão pode atualizá-lo (`UPDATE`). Isso é crucial para a função `acceptBid`, garantindo que apenas o "dono" do leilão possa aceitar uma oferta.
  - **Deleção:** Ninguém pode deletar um leilão (regra implícita, sem política de `DELETE`).

- **Tabela `bids`:**
  - **Leitura:** Todos podem ver os lances de um leilão (`SELECT`).
  - **Criação:** Apenas usuários autenticados podem fazer lances (`INSERT`).
  - **Atualização:** Ninguém pode atualizar um lance depois de criado (`UPDATE` bloqueado). Isso garante a integridade das ofertas.
  - **Deleção:** Ninguém pode deletar um lance (regra implícita, sem política de `DELETE`).

## 5. Disclaimers e Termos de Responsabilidade

Para garantir a transparência e a segurança jurídica, um disclaimer de auto-responsabilidade será apresentado aos usuários antes de seu primeiro acesso à área de leilões.

- **Implementação:**
  - [ ] Exibir um modal com os termos na primeira vez que um **Cliente** tentar criar ou visualizar um leilão.
  - [ ] Exibir um modal com os termos na primeira vez que um **Profissional** tentar visualizar ou dar um lance em um leilão.
  - [ ] O usuário deve aceitar os termos para prosseguir.
  - [ ] Armazenar a confirmação do aceite no banco de dados (ex: uma coluna `accepted_auction_terms` na tabela `profiles`).

- **Texto Sugerido para o Disclaimer:**
  > **Termos de Uso da Área de Leilões**
  >
  > Ao participar dos leilões, você entende e concorda que:
  >
  > 1.  **Intermediação:** A plataforma atua como uma facilitadora para conectar clientes e profissionais. A negociação, execução e qualidade do serviço são de responsabilidade exclusiva das partes envolvidas.
  > 2.  **Riscos e Responsabilidades:** Você assume total responsabilidade e os riscos inerentes à contratação e prestação de serviços. Recomendamos verificar as credenciais e avaliações da outra parte antes de fechar um acordo.
  > 3.  **Acordo Direto:** O contrato de serviço é um acordo direto entre cliente e profissional. A plataforma não faz parte deste contrato e não se responsabiliza por disputas, pagamentos ou pela qualidade do trabalho.
  >
  > Ao clicar em "Li e Aceito os Termos", você confirma que compreendeu e concorda com estas condições.

---

O que você acha desta estrutura inicial? Podemos refinar, adicionar ou remover qualquer seção conforme necessário.