# DF Construções — App Financeiro

> **Estruturas Fortes, Construção Confiável.**

Aplicativo financeiro completo para a DF Construções, desenvolvido em React Native (Expo) com backend Node.js MVC.

---

## Estrutura do Projeto

```
Pex2026/
├── backend/                    # API Node.js (MVC)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js     # Sequelize + SQLite
│   │   │   └── seed.js         # Dados de exemplo
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── transactionController.js
│   │   │   ├── categoryController.js
│   │   │   └── reportController.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Transaction.js
│   │   │   ├── Category.js
│   │   │   └── index.js
│   │   ├── middlewares/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   ├── transactionRoutes.js
│   │   │   ├── categoryRoutes.js
│   │   │   └── reportRoutes.js
│   │   └── app.js
│   ├── data/                   # Banco SQLite (gerado automaticamente)
│   ├── .env
│   └── package.json
│
├── src/                        # React Native App
│   ├── components/
│   │   ├── common/             # DFText, DFCard, DFButton, DFInput...
│   │   ├── dashboard/          # BalanceCard, QuickStats
│   │   └── transactions/       # TransactionItem
│   ├── screens/
│   │   ├── auth/               # LoginScreen
│   │   ├── dashboard/          # DashboardScreen
│   │   ├── projects/           # ProjectsScreen, ProjectDetailScreen, NewProjectScreen
│   │   ├── transactions/       # TransactionsScreen, NewTransactionScreen
│   │   ├── reports/            # ReportsScreen
│   │   └── settings/           # SettingsScreen
│   ├── navigation/             # AppNavigator, TabNavigator
│   ├── services/               # Axios API service
│   ├── store/                  # Zustand stores
│   ├── theme/                  # Colors, Typography, Spacing, Shadows
│   ├── types/                  # TypeScript interfaces
│   └── utils/                  # formatCurrency, formatDate...
│
├── App.tsx
├── app.json
└── package.json
```

---

## Funcionalidades

### Dashboard
- Resultado financeiro do mês (receita, despesa, lucro, margem)
- Indicadores rápidos (obras ativas, margem, pendências)
- Últimas transações com ações rápidas

### Obras (Projetos)
- Cadastro completo de obras com orçamento
- Status: Orçamento, Em Andamento, Concluído, Cancelado, Pausado
- Tipos: Fundação, Alvenaria, Cobertura, Reboco, etc.
- Progresso de orçamento com barra visual
- Movimentações financeiras por obra

### Transações
- Receitas e despesas categorizadas
- Associação com obras
- Formas de pagamento: PIX, Boleto, Transferência, Dinheiro, etc.
- Status: Pago, Pendente, Atrasado, Cancelado

### Relatórios
- Gráfico de linha: Receitas vs Despesas (6 meses)
- Gráfico de barras: Lucro mensal
- Top categorias de despesa
- Tabela resumo mensal

### Configurações
- Perfil do usuário
- Informações da empresa
- Opções de conta

---

## Como Rodar

### Requisitos
- Node.js 18+
- npm ou yarn
- Expo Go app (iOS/Android) ou simulador

### 1. Backend

```bash
cd backend
npm install
npm run seed    # Cria banco e dados de exemplo
npm run dev     # Inicia em http://localhost:3001
```

**Credenciais de teste:**
```
Email: admin@dfconstrucoes.com.br
Senha: 123456
```

### 2. Frontend (App React Native)

```bash
# Na raiz do projeto
npm install
npx expo start
```

Abra com Expo Go ou simulador iOS/Android.

> **Importante:** Para conectar ao backend, certifique-se de que a API está rodando na porta 3001.
> Em dispositivo físico, altere `localhost` pelo IP da sua máquina em `src/services/api.ts`.

---

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Mobile | React Native + Expo (TypeScript) |
| UI Components | React Native Paper |
| Navegação | React Navigation 6 (Stack + Bottom Tabs) |
| Estado | Zustand |
| HTTP | Axios |
| Gráficos | react-native-chart-kit |
| Backend | Node.js + Express |
| ORM | Sequelize |
| Banco | SQLite |
| Auth | JWT (jsonwebtoken) |

---

## API Endpoints

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id

GET    /api/transactions
POST   /api/transactions
GET    /api/transactions/:id
PUT    /api/transactions/:id
DELETE /api/transactions/:id

GET    /api/reports/dashboard
GET    /api/reports/cashflow?months=6
GET    /api/reports/by-category?type=despesa

GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
```

---

## Design

Identidade visual DF Construções:
- **Azul Escuro:** `#071C36`
- **Cinza Estrutural:** `#6A6F77`
- **Laranja Destaque:** `#F97316`
- **Branco:** `#FFFFFF`

Tipografia: Montserrat ExtraBold (títulos) + Poppins (texto)

---

*DF Construções © 2026 · Jaraguá do Sul / SC*
