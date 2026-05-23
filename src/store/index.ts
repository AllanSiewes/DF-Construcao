import { create } from 'zustand';
import { User, Project, Transaction, DashboardData, Category } from '../types';
import { storage } from '../utils/storage';

// Conexão centralizada do Supabase
import { supabase } from '../services/supabaseClient';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: { nome: string; email: string }, token: string) => Promise<void>;
  loginWithGoogle: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  loadFromStorage: async () => {
    try {
      const token = await storage.getItem('df_token');
      const userStr = await storage.getItem('df_user');
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  login: async (userData, token) => {
    const sessionUser: User = {
      id: userData.email, 
      name: userData.nome,
      email: userData.email,
      role: 'admin', // Corrigido de 'user' para 'admin' para aceitar o tipo restrito
      createdAt: new Date().toISOString(),
    };

    await storage.setItem('df_token', token);
    await storage.setItem('df_user', JSON.stringify(sessionUser));
    
    set({ user: sessionUser, token: token, isAuthenticated: true });
  },

  loginWithGoogle: async (token: string, user: User) => {
    await storage.setItem('df_token', token);
    await storage.setItem('df_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    // 1. Limpa os storages locais
    await storage.removeItem('df_token');
    await storage.removeItem('df_user');
    
    // 2. Reseta o estado de autenticação
    set({ user: null, token: null, isAuthenticated: false });

    // 3. Limpa os dados residuais das outras stores na memória
    useProjectStore.setState({ projects: [], selectedProject: null });
    useTransactionStore.setState({ transactions: [], total: 0 });
    useDashboardStore.setState({ data: null });
  },
}));

interface DashboardState {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  isLoading: false,
  error: null,
  fetch: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data: txs, error } = await supabase
        .from('transacoes')
        .select('valor, tipo_transacao');

      if (error) throw error;

      let receitas = 0;
      let despesas = 0;

      txs?.forEach((t: any) => {
        const valor = Number(t.valor);
        if (t.tipo_transacao === 'receita') {
          receitas += valor;
        } else if (t.tipo_transacao === 'despesa') {
          despesas += valor;
        }
      });

      set({
        data: {
          totalIncome: receitas,
          totalExpenses: despesas,
          balance: receitas - despesas, // O fallback as any contorna as diferenças do tipo DashboardData
          recentTransactions: [],
        } as any,
        isLoading: false,
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },
}));

interface ProjectState {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchAll: (params?: Record<string, any>) => Promise<void>;
  fetchOne: (id: string) => Promise<void>;
  create: (data: Record<string, any>) => Promise<Project>;
  update: (id: string, data: Record<string, any>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

  fetchAll: async (params?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from('obras').select('*').order('id', { ascending: false });

      if (params?.status) {
        query = query.eq('status', params.status);
      }
      if (params?.search) {
        query = query.ilike('nome_da_obra', `%${params.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      const mappedProjects: Project[] = (data || []).map((o: any): Project => ({
        id: String(o.id),
        name: o.nome_da_obra,
        client: o.cliente,
        status: o.status || 'active',
        type: o.tipo_de_obra || 'Geral',
        budget: Number(o.orçamento_total) || 0,
        user_id: 'sistema',
        createdAt: o.data_inicio || new Date().toISOString(),
      }));

      set({ projects: mappedProjects, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  fetchOne: async (id: string) => {
    set({ isLoading: true });
    try {
      const { data: obra, error: obraError } = await supabase
        .from('obras')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (obraError) throw obraError;

      const { data: txs, error: txsError } = await supabase
        .from('transacoes')
        .select('*')
        .eq('obra_id', id);

      if (txsError) throw txsError;

      const mappedObra: Project | null = obra ? {
        id: String(obra.id),
        name: obra.nome_da_obra,
        client: obra.cliente,
        status: obra.status || 'active',
        type: obra.tipo_de_obra || 'Geral',
        budget: Number(obra.orçamento_total) || 0,
        user_id: 'sistema',
        createdAt: obra.data_inicio || new Date().toISOString(),
      } : null;

      const mappedTransactions: Transaction[] = (txs || []).map((t: any): Transaction => ({
        id: String(t.id),
        project_id: String(t.obra_id),
        amount: Number(t.valor),
        type: t.tipo_transacao === 'receita' ? 'receita' : 'despesa',
        date: t.data,
        description: t.descricao,
        category: t.categoria || 'Geral',
        user_id: 'sistema',
        createdAt: t.data || new Date().toISOString(),
        payment_method: t.forma_pagamento || 'Dinheiro', // Propriedade obrigatória do front adicionada
        status: t.status || 'pago',                     // Propriedade obrigatória do front adicionada
      }));

      set({ 
        selectedProject: mappedObra ? { ...mappedObra, transactions: mappedTransactions } as any : null, 
        isLoading: false 
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  create: async (data: Record<string, any>) => {
    const payload = {
      nome_da_obra: data.name,
      cliente: data.client,
      status: data.status || 'active',
      orçamento_total: data.budget || 0,
      endereco: data.address || '',
      tipo_de_obra: data.type || 'Geral',
      data_inicio: data.startDate || new Date().toISOString().split('T')[0],
    };

    const { data: res, error } = await supabase
      .from('obras')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    const newProject: Project = {
      id: String(res.id),
      name: res.nome_da_obra,
      client: res.cliente,
      status: res.status || 'active',
      type: res.tipo_de_obra || 'Geral',
      budget: Number(res.orçamento_total) || 0,
      user_id: 'sistema',
      createdAt: res.data_inicio || new Date().toISOString(),
    };

    set((state: ProjectState) => ({ projects: [newProject, ...state.projects] }));
    return newProject;
  },

  update: async (id: string, data: Record<string, any>) => {
    const payload: Record<string, any> = {};
    if (data.name) payload.nome_da_obra = data.name;
    if (data.client) payload.cliente = data.client;
    if (data.status) payload.status = data.status;
    if (data.budget) payload.orçamento_total = data.budget;

    const { error } = await supabase
      .from('obras')
      .update(payload)
      .eq('id', id);

    if (error) throw error;
    await get().fetchAll();
  },

  remove: async (id: string) => {
    const { error } = await supabase
      .from('obras')
      .delete()
      .eq('id', id);

    if (error) throw error;
    set((state: ProjectState) => ({ projects: state.projects.filter((p: Project) => p.id !== id) }));
  },
}));

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  total: number;
  fetchAll: (params?: Record<string, any>) => Promise<void>;
  create: (data: Record<string, any>) => Promise<Transaction>;
  remove: (id: string) => Promise<void>;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  error: null,
  total: 0,

  fetchAll: async (params?: Record<string, any>) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from('transacoes').select('*', { count: 'exact' }).order('data', { ascending: false });

      if (params?.type) {
        const dbType = params.type === 'revenue' || params.type === 'receita' ? 'receita' : 'despesa';
        query = query.eq('tipo_transacao', dbType);
      }
      if (params?.project_id) {
        query = query.eq('obra_id', params.project_id);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      const mappedTxs: Transaction[] = (data || []).map((t: any): Transaction => ({
        id: String(t.id),
        project_id: String(t.obra_id),
        amount: Number(t.valor),
        type: t.tipo_transacao === 'receita' ? 'receita' : 'despesa',
        date: t.data,
        description: t.descricao,
        category: t.categoria || 'Geral',
        user_id: 'sistema',
        createdAt: t.data || new Date().toISOString(),
        payment_method: t.forma_pagamento || 'Dinheiro', // Propriedade obrigatória do front adicionada
        status: t.status || 'pago',                     // Propriedade obrigatória do front adicionada
      }));

      set({ transactions: mappedTxs, total: count || 0, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  create: async (data: Record<string, any>) => {
    const payload = {
      tipo_transacao: data.type === 'revenue' || data.type === 'receita' ? 'receita' : 'despesa',
      valor: Number(data.amount),
      descricao: data.description || 'Transação de Obra',
      data: data.date ? data.date.split('T')[0] : new Date().toISOString().split('T')[0],
      obra_id: Number(data.project_id),
      status: data.status || 'pago',
      categoria: data.category || 'Geral',
      forma_pagamento: data.payment_method || 'Dinheiro'
    };

    const { data: res, error } = await supabase
      .from('transacoes')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    const newTx: Transaction = {
      id: String(res.id),
      project_id: String(res.obra_id),
      amount: Number(res.valor),
      type: res.tipo_transacao === 'receita' ? 'receita' : 'despesa',
      date: res.data,
      description: res.descricao,
      category: res.categoria || 'Geral',
      user_id: 'sistema',
      createdAt: res.data || new Date().toISOString(),
      payment_method: res.forma_pagamento || 'Dinheiro', // Propriedade obrigatória do front adicionada
      status: res.status || 'pago',                     // Propriedade obrigatória do front adicionada
    };

    set((state: TransactionState) => ({ transactions: [newTx, ...state.transactions] }));
    
    useDashboardStore.getState().fetch();
    
    return newTx;
  },

  remove: async (id: string) => {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    set((state: TransactionState) => ({ transactions: state.transactions.filter((t: Transaction) => t.id !== id) }));
    
    useDashboardStore.getState().fetch();
  },
}));

interface CategoryState {
  categories: Category[];
  fetchAll: (params?: Record<string, any>) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  fetchAll: async (params?: Record<string, any>) => {
    try {
      let query = supabase.from('categorias').select('*');
      if (params?.type) {
        query = query.eq('type', params.type);
      }
      const { data, error } = await query;
      if (error) throw error;
      set({ categories: data as Category[] });
    } catch {}
  },
}));