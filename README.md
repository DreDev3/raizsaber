# RAIZSABER

RAIZSABER é uma plataforma de ensino online voltada para oferecer uma experiência de aprendizado estruturada, prática e envolvente. O nome representa a ideia de uma “Rota de Aprendizado e Instrução do Zero”, com foco em construir uma base sólida, promover o enraizamento do conhecimento e favorecer a retenção ao longo do tempo.

## 🚀 Visão geral

A aplicação foi desenvolvida para funcionar como uma plataforma de cursos com:

- cadastro e autenticação de usuários;
- catálogo de cursos;
- módulos e aulas organizadas em sequência;
- acompanhamento de progresso;
- comentários em aulas;
- sistema de compras e pagamentos;
- notificações e painel administrativo.

## 🧩 Objetivo do projeto

O RAIZSABER busca transformar o aprendizado em uma jornada guiada, permitindo que o aluno comece do zero, avance com clareza e consolide o conhecimento por meio de uma estrutura bem organizada.

## 🛠️ Tecnologias utilizadas

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Clerk para autenticação
- TanStack Query para gerenciamento de dados no cliente
- Radix UI e Lucide React para componentes e ícones
- Sonner para notificações
- AWS S3 para armazenamento de arquivos

## 📁 Estrutura do projeto

```text
src/
  app/                # rotas e layouts do Next.js
  actions/            # ações server-side e lógicas de negócio
  components/         # componentes reutilizáveis da interface
  lib/                # utilidades, integrações e configurações
  server/             # schemas, erros e helpers do backend
  styles/             # estilos globais
prisma/               # schema do banco e migrations
```

## ⚙️ Pré-requisitos

Antes de rodar o projeto, certifique-se de ter instalado:

- Node.js 20+
- npm ou pnpm
- PostgreSQL
- variáveis de ambiente configuradas para:
  - conexão com o banco Prisma
  - Clerk
  - AWS S3

## 🔧 Configuração local

1. Clone o repositório:

```bash
git clone [<url-do-repositorio>](https://github.com/DreDev3/raizsaber)
cd raizsaber
```

2. Instale as dependências:

```bash
npm install
```

3. Configure o arquivo de ambiente:

```bash
cp .env.example .env
```

4. Gere o cliente Prisma:

```bash
npx prisma generate
```

5. Execute as migrações:

```bash
npx prisma migrate dev
```

6. Inicie o projeto em modo de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

## ▶️ Scripts disponíveis

```bash
npm run dev      # inicia o ambiente de desenvolvimento
npm run build    # gera a build de produção
npm run start    # inicia a aplicação em produção
npm run lint     # executa a verificação de lint
```

## 🗄️ Banco de dados

O projeto utiliza Prisma com PostgreSQL. O schema principal está localizado em:

```text
prisma/schema.prisma
```

Para gerenciar o banco, você pode usar:

```bash
npx prisma studio
```

## 🧪 Funcionalidades principais

- autenticação e perfil do usuário;
- gestão de cursos e aulas;
- progresso do aluno por aula concluída;
- comentários e interação;
- painel administrativo para organização dos conteúdos;
- integração com pagamentos e armazenamento.

## 📌 Observações

Este projeto está em evolução e pode receber melhorias em:

- experiência de usuário;
- performance;
- segurança;
- testes automatizados;
- deploy e CI/CD.

## 📄 Licença

Este projeto está sob licença definida pelo responsável do repositório.
