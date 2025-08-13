# App Garçom 🍽️

Aplicativo para contratação de profissionais de gastronomia (garçons, bartenders, chefs, etc.) para eventos.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Supabase** para backend e banco de dados
- **Lucide React** para ícones

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

O aplicativo estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
├── hooks/              # Custom hooks
├── lib/                # Configurações (Supabase)
├── types/              # Definições TypeScript
├── App.tsx             # Componente principal
└── main.tsx            # Ponto de entrada

database/
├── migrations.sql      # Schema do banco
└── seed-data.sql       # Dados de exemplo
```

## 🔧 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Visualiza build de produção
- `npm run lint` - Executa linting do código

## 📱 Funcionalidades

- [x] Listagem de profissionais
- [x] Filtros por categoria
- [x] Busca por nome
- [x] Filtros de distância e disponibilidade
- [ ] Sistema de autenticação
- [ ] Agendamento de serviços
- [ ] Avaliações e comentários
- [ ] Chat em tempo real
- [ ] Pagamentos integrados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.
