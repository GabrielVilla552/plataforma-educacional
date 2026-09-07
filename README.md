# Plataforma Educacional

Plataforma web para disponibilização de conteúdos educacionais. Professores podem criar e gerenciar videoaulas, enquanto alunos e visitantes acessam o catálogo, pesquisam conteúdos e assistem às aulas públicas sem cadastro.

## Funcionalidades

- Catálogo público de disciplinas, categorias, tópicos e videoaulas.
- Busca textual atualizada enquanto o usuário digita.
- Filtro de aulas por disciplina.
- Visualização pública de videoaulas e materiais complementares.
- Cadastro e login de professores.
- Dashboard protegido para professores.
- Criação de novas videoaulas com título, descrição, tópico, link de vídeo e visibilidade.
- Controle de publicação e privacidade das próprias aulas.
- Logout pelo catálogo e pelo dashboard.
- Interface responsiva em português.

## Estrutura do projeto

```text
.
├── back/                  # API Node.js + Express
│   ├── src/
│   │   ├── routes/        # Autenticação, catálogo e aulas
│   │   └── ...
│   └── test/              # Testes do backend
├── front/                 # React + TypeScript + Vite
│   ├── src/
│   │   ├── pages/         # Catálogo, login, cadastro, dashboard e aula
│   │   └── utils/         # Logout e tradução de status
│   └── public/
└── README.md
```

## Requisitos

- Node.js 20 ou superior.
- npm.

## Instalação

Instale as dependências de cada parte do projeto:

```bash
cd back
npm install

cd ../front
npm install
```

## Execução

Abra dois terminais.

No primeiro, inicie a API:

```bash
cd back
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

No segundo, inicie o frontend:

```bash
cd front
npm run dev
```

O Vite exibirá o endereço da aplicação, normalmente `http://localhost:5173`.

Caso a API esteja em outro endereço, configure `VITE_API_URL` antes de iniciar o frontend:

```bash
VITE_API_URL=http://localhost:3000/api/v1 npm run dev
```

No PowerShell:

```powershell
$env:VITE_API_URL="http://localhost:3000/api/v1"; npm.cmd run dev
```

## Usuário de demonstração

- E-mail: `professor@demo.com`
- Senha: `12345678`

Os dados do backend são mantidos em memória por enquanto e reiniciados quando o servidor é encerrado.

## Rotas do frontend

- `/`: catálogo público.
- `/catalog`: catálogo público.
- `/login`: login de professores.
- `/register`: cadastro de professores.
- `/dashboard`: painel protegido do professor.
- `/courses/:courseId/lessons/:lessonId`: visualização de uma videoaula.

## Principais rotas da API

### Autenticação

| Método | Rota | Acesso |
| --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Público |
| `POST` | `/api/v1/auth/login` | Público |
| `GET` | `/api/v1/auth/me` | Professor autenticado |
| `POST` | `/api/v1/auth/logout` | Professor autenticado |

### Catálogo e aulas

| Método | Rota | Acesso |
| --- | --- | --- |
| `GET` | `/api/v1/catalog` | Público |
| `GET` | `/api/v1/lessons` | Público |
| `GET` | `/api/v1/lessons?q=equacoes` | Público, com busca |
| `GET` | `/api/v1/lessons/:id` | Público para aulas publicadas |
| `GET` | `/api/v1/lessons/mine` | Professor autenticado |
| `GET` | `/api/v1/lessons/mine/:id` | Professor proprietário |
| `POST` | `/api/v1/lessons` | Professor autenticado |
| `PATCH` | `/api/v1/lessons/:id` | Professor proprietário |
| `DELETE` | `/api/v1/lessons/:id` | Professor proprietário |
| `POST` | `/api/v1/lessons/:id/materials` | Professor proprietário |

As rotas protegidas usam o cabeçalho:

```http
Authorization: Bearer SEU_TOKEN
```

## Exemplos da API

Login:

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"professor@demo.com","password":"12345678"}'
```

Para criar uma aula, consulte primeiro `/api/v1/catalog` e use um valor de `topics[].id`:

```bash
curl -X POST http://localhost:3000/api/v1/lessons \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"title":"Aula de introdução","description":"Conceitos iniciais","videoUrl":"https://youtube.com/watch?v=abc","topicId":"TOPIC_ID","status":"PUBLISHED"}'
```

Para tornar uma aula privada:

```bash
curl -X PATCH http://localhost:3000/api/v1/lessons/LESSON_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"status":"DRAFT"}'
```

## Scripts

Backend:

```bash
cd back
npm run dev       # desenvolvimento com atualização automática
npm start         # execução normal
npm test          # testes
```

Frontend:

```bash
cd front
npm run dev       # servidor de desenvolvimento
npm run build     # verificação de tipos e build de produção
npm run lint      # ESLint
npm run preview   # pré-visualização da build
```

## Verificação da API

```http
GET http://localhost:3000/health
```

A resposta esperada contém o status da API e sua versão de serviço.

## Observações de segurança

As sessões usam tokens opacos mantidos em memória e as senhas são protegidas com `scrypt`. Para produção, recomenda-se utilizar HTTPS, CORS restritivo, persistência de dados, limitação de requisições, auditoria e políticas de privacidade compatíveis com a LGPD.
