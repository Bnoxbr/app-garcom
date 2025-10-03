# App Garçom 🍽️

Plataforma para contratação de profissionais de gastronomia (garçons, bartenders, chefs, etc.) para eventos.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Supabase** para backend, autenticação e banco de dados
- **PWA** para instalação em dispositivos móveis
- **React Router** para navegação

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd app-garcom
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```
3. Preencha as variáveis de ambiente no arquivo `.env`:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima
   ```

### 4. Configure o banco de dados

1. No painel do Supabase, vá para **SQL Editor**
2. Execute o arquivo `database/migrations.sql` para criar as tabelas
3. Execute o arquivo `database/seed-data.sql` para popular com dados de exemplo

### 5. Execute o projeto
```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5174`

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes React reutilizáveis
├── hooks/             # Custom hooks (auth, data, PWA)
├── lib/               # Configurações (Supabase)
├── pages/             # Páginas da aplicação
│   ├── auth/          # Páginas de autenticação
│   └── ...            # Outras páginas
├── types/             # Definições TypeScript
├── App.tsx            # Componente principal e rotas
└── main.tsx           # Ponto de entrada

database/
├── migrations.sql     # Schema do banco
└── seed-data.sql      # Dados de exemplo
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção

## 📱 Funcionalidades

- [x] Sistema de autenticação completo
- [x] Listagem de profissionais
- [x] Filtros por categoria
- [x] Busca por nome
- [x] Filtros de disponibilidade
- [x] PWA com suporte offline
- [ ] Chat em tempo real
- [ ] Agendamento de serviços
- [ ] Leilão de serviços
- [ ] Pagamentos integrados

## 🌐 PWA

O aplicativo está configurado como Progressive Web App (PWA), permitindo:

- Instalação em dispositivos móveis e desktop
- Funcionamento offline
- Atualizações automáticas
- Experiência semelhante a aplicativos nativos

## 🔐 Autenticação

O sistema de autenticação inclui:

- Registro de usuários (prestadores e contratantes)
- Login com email/senha
- Recuperação de senha
- Rotas protegidas por perfil

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Status do Projeto

Para informações detalhadas sobre o status atual do projeto, consulte o arquivo [PROJETO_STATUS_ATUAL.md](./PROJETO_STATUS_ATUAL.md).

---

 *Última atualização: 03/10/2025*

 - Atualizado: integração das seções dinâmicas da aba Gestão e refatoração do ClientProfile.tsx.

*Nota: Sempre que este documento for atualizado ou alterado, a data da última alteração deve ser atualizada acima.*
