import { create } from 'zustand';
import { User, Project, Transaction, DashboardData, Category } from '../types';
import { storage } from '../utils/storage';

// Conexão centralizada do Supabase
import { supabase } from '../services/supabase';

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
      role: 'admin',
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
      // Agrega dados de transações do Supabase para montar o Dashboard em tempo real
      const { data: txs, error } = await supabase
        .from('transacoes')
        .select('amount, type');

      if (error) throw error;

      let receitas = 0;
      let despesas = 0;

      txs?.forEach((t) => {
        const valor = Number(t.amount);
        if (t.type === 'revenue' || t.type === 'receita') {
          receitas += valor;
        } else if (t.type === 'expense' || t.type === 'despesa') {
          despesas += valor;
        }
      });

      const saldo = receitas - despesas;

      set({
        data: {
          balance: saldo,
          income: receitas,
          expense: despesas,
          recentTransactions: [], // Pode ser populado se seu tipo exigir
        },
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

  fetchAll: async (params) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from('obras').select('*').order('created_at', { ascending: false });

      if (params?.status) {
        query = query.eq('status', params.status);
      }
      if (params?.search) {
        query = query.ilike('name', `%${params.search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      set({ projects: data as Project[], isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  fetchOne: async (id) => {
    set({ isLoading: true });
    try {
      const { data: obra, error: obraError } = await supabase
        .from('obras')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (obraError) throw obraError;

      // Busca transações atreladas a essa obra específica
      const { data: txs, error: txsError } = await supabase
        .from('transacoes')
        .select('*')
        .eq('project_id', id);

      if (txsError) throw txsError;

      set({ 
        selectedProject: obra ? { ...obra, transactions: txs } as any : null, 
        isLoading: false 
      });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  create: async (data) => {
    const { data: res, error } = await supabase
      .from('obras')
      .insert([data])
      .select()
      .single();

    if (error) throw error;

    set((state) => ({ projects: [res as Project, ...state.projects] }));
    return res as Project;
  },

  update: async (id, data) => {
    const { error } = await supabase
      .from('obras')
      .update(data)
      .eq('id', id);

    if (error) throw error;
    await get().fetchAll();
  },

  remove: async (id) => {
    const { error } = await supabase
      .from('obras')
      .delete()
      .eq('id', id);

    if (error) throw error;
    set((state) => ({ projects: state.projects.filter((p) => p.id !== id) }));
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

  fetchAll: async (params) => {
    set({ isLoading: true, error: null });
    try {
      let query = supabase.from('transacoes').select('*', { count: 'exact' }).order('date', { ascending: false });

      if (params?.type) {
        query = query.eq('type', params.type);
      }
      if (params?.project_id) {
        query = query.eq('project_id', params.project_id);
      }

      const { data, error, count } = await query;
      if (error) throw error;

      set({ transactions: data as Transaction[], total: count || 0, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  create: async (data) => {
    // Garante que o tipo mapeie corretamente independente de vir como receita/despesa ou revenue/expense
    const payload = {
      ...data,
      type: data.type === 'receita' ? 'revenue' : data.type === 'despesa' ? 'expense' : data.type
    };

    const { data: res, error } = await supabase
      .from('transacoes')
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    set((state) => ({ transactions: [res as Transaction, ...state.transactions] }));
    
    // Atualiza o dashboard automaticamente após criar uma transação
    useDashboardStore.getState().fetch();
    
    return res as Transaction;
  },

  remove: async (id) => {
    const { error } = await supabase
      .from('transacoes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
    
    // Atualiza o dashboard automaticamente após remover
    useDashboardStore.getState().fetch();
  },
}));

interface CategoryState {
  categories: Category[];
  fetchAll: (params?: Record<string, any>) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set) => ({
  categories: [],
  fetchAll: async (params) => {
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