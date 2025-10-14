# App Garçom 🍽️

**Repositório do Contratante (`app-principal`)**

Esta é a plataforma principal onde contratantes podem descobrir, contratar e pagar por serviços de profissionais de gastronomia. O modelo de negócio é o **"Perfil como Anúncio"**: o perfil do prestador é sua oferta, e o contratante inicia a contratação.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Supabase** como Backend as a Service (BaaS)
- **PWA** para instalação em dispositivos móveis
- **React Router** para navegação

## 📋 Arquitetura de Micro-Frontends

Este projeto faz parte de uma arquitetura de Micro-Frontends:

- **`app-principal` (este repositório):** O aplicativo do **Contratante**. Focado na descoberta de perfis, início da contratação e pagamento.
- **`app-garcom-prestador` (repositório separado):** O aplicativo do **Prestador de Serviço**. Focado na manutenção do perfil/oferta, gestão de contratações e execução do serviço.

O backend é centralizado no **Supabase**, servindo ambos os frontends.

## ⚙️ Configuração

1.  **Clone o repositório** e instale as dependências (`npm install`).
2.  **Configure o Supabase**: Copie `.env.example` para `.env` e preencha com suas chaves.
3.  **Execute o projeto**: `npm run dev`.

## ✅ Funcionalidades e Plano

- **Autenticação:**
  - [x] Registro e Login de Contratantes.

- **Jornada do Contratante:**
  - [🟡] Navegação no catálogo de perfis de profissionais.
  - [🔴] Filtros avançados para busca.
  - [🔴] Formulário de contratação (data, hora, local).
  - [🔴] Integração de pagamento no ato da contratação (com retenção).
  - [🟡] Páginas de status de pagamento (Sucesso, Erro, Pendente).
  - [🔴] UI para avaliação do serviço.
  - [🟡] Dashboard com histórico de serviços.

- **Tecnologia:**
  - [x] Progressive Web App (PWA) com suporte a instalação.

*(Status: 🟢 Concluído, 🟡 Em Andamento, 🔴 Não Iniciado)*

## 📄 Documentação do Projeto

Para uma compreensão completa, consulte os seguintes documentos:

1.  **[FLUXO_DE_CONTRATACAO_V2.md](./FLUXO_DE_CONTRATACAO_V2.md):** Detalha o fluxo "Perfil como Anúncio".
2.  **[PROJETO_STATUS_ATUAL.md](./PROJETO_STATUS_ATUAL.md):** Descreve o status de implementação.
3.  **[PLANO_DE_PRODUCAO.md](./PLANO_DE_PRODUCAO.md):** Apresenta o checklist de tarefas do frontend.

---

*Última atualização: 07 de Outubro de 2025*

- Atualizado para refletir a mudança para o modelo **"Perfil como Anúncio"**.
