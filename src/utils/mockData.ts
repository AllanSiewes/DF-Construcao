import { User, Project, Transaction, DashboardData, CashflowItem, Category } from '../types';

export const MOCK_USER: User = {
  id: 'mock-001',
  name: 'Diego Ferreira',
  email: 'admin',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Pagamento de Obra', type: 'receita', icon: 'hard-hat', color: '#22c55e', is_system: true },
  { id: 'cat-2', name: 'Medição', type: 'receita', icon: 'clipboard-list', color: '#4ade80', is_system: true },
  { id: 'cat-3', name: 'Adiantamento', type: 'receita', icon: 'wallet', color: '#16a34a', is_system: true },
  { id: 'cat-4', name: 'Material de Construção', type: 'despesa', icon: 'package', color: '#ef4444', is_system: true },
  { id: 'cat-5', name: 'Mão de Obra', type: 'despesa', icon: 'users', color: '#f97316', is_system: true },
  { id: 'cat-6', name: 'Equipamentos', type: 'despesa', icon: 'tool', color: '#eab308', is_system: true },
  { id: 'cat-7', name: 'Combustível', type: 'despesa', icon: 'droplet', color: '#06b6d4', is_system: true },
  { id: 'cat-8', name: 'Alimentação', type: 'despesa', icon: 'coffee', color: '#f59e0b', is_system: true },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Residência Silva',
    client: 'João Silva',
    address: 'Rua das Palmeiras, 123 - Jaraguá do Sul/SC',
    description: 'Construção residencial completa - 180m²',
    status: 'em_andamento',
    type: 'completo',
    budget: 85000,
    start_date: '2026-02-01',
    estimated_end_date: '2026-08-30',
    user_id: 'mock-001',
    total_receita: 33500,
    total_despesa: 16700,
    lucro: 16800,
    createdAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'proj-2',
    name: 'Galpão Industrial Souza',
    client: 'Carlos Souza',
    address: 'Rua Industrial, 456 - Jaraguá do Sul/SC',
    description: 'Fundação e levantamento de paredes - 400m²',
    status: 'em_andamento',
    type: 'fundacao',
    budget: 120000,
    start_date: '2026-03-15',
    estimated_end_date: '2026-09-15',
    user_id: 'mock-001',
    total_receita: 44500,
    total_despesa: 22650,
    lucro: 21850,
    createdAt: '2026-03-15T00:00:00.000Z',
  },
  {
    id: 'proj-3',
    name: 'Reforma Varanda Pereira',
    client: 'Maria Pereira',
    address: 'Av. Central, 789 - Jaraguá do Sul/SC',
    description: 'Reboco estrutural e alvenaria',
    status: 'concluido',
    type: 'reboco',
    budget: 18000,
    start_date: '2026-01-10',
    end_date: '2026-03-20',
    user_id: 'mock-001',
    total_receita: 18000,
    total_despesa: 10720,
    lucro: 7280,
    createdAt: '2026-01-10T00:00:00.000Z',
  },
  {
    id: 'proj-4',
    name: 'Cobertura Residencial Costa',
    client: 'Roberto Costa',
    address: 'Rua das Flores, 321 - Jaraguá do Sul/SC',
    description: 'Cobertura metálica - 90m²',
    status: 'orcamento',
    type: 'cobertura',
    budget: 32000,
    user_id: 'mock-001',
    total_receita: 0,
    total_despesa: 0,
    lucro: 0,
    createdAt: '2026-05-01T00:00:00.000Z',
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', type: 'receita', amount: 12000, description: 'Medição #3 - Residência Silva', date: '2026-05-05', payment_method: 'pix', status: 'pago', project_id: 'proj-1', category_id: 'cat-2', user_id: 'mock-001', category: MOCK_CATEGORIES[1], project: { id: 'proj-1', name: 'Residência Silva', client: 'João Silva' }, createdAt: '2026-05-05T00:00:00.000Z' },
  { id: 'tx-2', type: 'receita', amount: 35000, description: 'Adiantamento - Galpão Souza', date: '2026-05-02', payment_method: 'transferencia', status: 'pago', project_id: 'proj-2', category_id: 'cat-3', user_id: 'mock-001', category: MOCK_CATEGORIES[2], project: { id: 'proj-2', name: 'Galpão Industrial Souza', client: 'Carlos Souza' }, createdAt: '2026-05-02T00:00:00.000Z' },
  { id: 'tx-3', type: 'receita', amount: 8500, description: 'Saldo final - Varanda Pereira', date: '2026-05-08', payment_method: 'pix', status: 'pago', project_id: 'proj-3', category_id: 'cat-1', user_id: 'mock-001', category: MOCK_CATEGORIES[0], project: { id: 'proj-3', name: 'Reforma Varanda Pereira', client: 'Maria Pereira' }, createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 'tx-4', type: 'despesa', amount: 4200, description: 'Cimento, areia e brita - Residência Silva', date: '2026-05-03', payment_method: 'boleto', status: 'pago', project_id: 'proj-1', category_id: 'cat-4', user_id: 'mock-001', category: MOCK_CATEGORIES[3], project: { id: 'proj-1', name: 'Residência Silva', client: 'João Silva' }, createdAt: '2026-05-03T00:00:00.000Z' },
  { id: 'tx-5', type: 'despesa', amount: 6500, description: 'Pedreiros semana 1 - Galpão Souza', date: '2026-05-07', payment_method: 'pix', status: 'pago', project_id: 'proj-2', category_id: 'cat-5', user_id: 'mock-001', category: MOCK_CATEGORIES[4], project: { id: 'proj-2', name: 'Galpão Industrial Souza', client: 'Carlos Souza' }, createdAt: '2026-05-07T00:00:00.000Z' },
  { id: 'tx-6', type: 'despesa', amount: 1800, description: 'Aluguel betoneira', date: '2026-05-04', payment_method: 'dinheiro', status: 'pago', project_id: 'proj-1', category_id: 'cat-6', user_id: 'mock-001', category: MOCK_CATEGORIES[5], project: { id: 'proj-1', name: 'Residência Silva', client: 'João Silva' }, createdAt: '2026-05-04T00:00:00.000Z' },
  { id: 'tx-7', type: 'despesa', amount: 650, description: 'Combustível - caminhonete', date: '2026-05-09', payment_method: 'dinheiro', status: 'pago', category_id: 'cat-7', user_id: 'mock-001', category: MOCK_CATEGORIES[6], createdAt: '2026-05-09T00:00:00.000Z' },
  { id: 'tx-8', type: 'despesa', amount: 3200, description: 'Tijolos e blocos - Galpão Souza', date: '2026-05-06', payment_method: 'pix', status: 'pago', project_id: 'proj-2', category_id: 'cat-4', user_id: 'mock-001', category: MOCK_CATEGORIES[3], project: { id: 'proj-2', name: 'Galpão Industrial Souza', client: 'Carlos Souza' }, createdAt: '2026-05-06T00:00:00.000Z' },
  { id: 'tx-9', type: 'receita', amount: 18000, description: 'Pagamento parcial - Varanda Pereira', date: '2026-04-15', payment_method: 'transferencia', status: 'pago', project_id: 'proj-3', category_id: 'cat-1', user_id: 'mock-001', category: MOCK_CATEGORIES[0], project: { id: 'proj-3', name: 'Reforma Varanda Pereira', client: 'Maria Pereira' }, createdAt: '2026-04-15T00:00:00.000Z' },
  { id: 'tx-10', type: 'despesa', amount: 720, description: 'Alimentação da equipe', date: '2026-04-12', payment_method: 'dinheiro', status: 'pago', category_id: 'cat-8', user_id: 'mock-001', category: MOCK_CATEGORIES[7], createdAt: '2026-04-12T00:00:00.000Z' },
];

export const MOCK_DASHBOARD: DashboardData = {
  month: {
    receita: 55500,
    despesa: 16350,
    lucro: 39150,
    margem: '70.5',
  },
  lastMonth: {
    receita: 27500,
    despesa: 10720,
    lucro: 16780,
  },
  growth: {
    receita: '101.8',
    despesa: '52.5',
  },
  activeProjects: 2,
  recentTransactions: MOCK_TRANSACTIONS.slice(0, 8),
};

export const MOCK_CASHFLOW: CashflowItem[] = [
  { month: 'dez/25', year: 2025, monthIndex: 11, receita: 22000, despesa: 11500, lucro: 10500 },
  { month: 'jan/26', year: 2026, monthIndex: 0, receita: 18500, despesa: 9800, lucro: 8700 },
  { month: 'fev/26', year: 2026, monthIndex: 1, receita: 31000, despesa: 14200, lucro: 16800 },
  { month: 'mar/26', year: 2026, monthIndex: 2, receita: 27500, despesa: 10720, lucro: 16780 },
  { month: 'abr/26', year: 2026, monthIndex: 3, receita: 27500, despesa: 10720, lucro: 16780 },
  { month: 'mai/26', year: 2026, monthIndex: 4, receita: 55500, despesa: 16350, lucro: 39150 },
];

export const isMockMode = () => true; // sempre ativo no protótipo web
