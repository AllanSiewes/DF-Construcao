import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, Project, Transaction, DashboardData, Category } from '../types';
import {
  authService,
  projectService,
  transactionService,
  reportService,
  categoryService,
} from '../services/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
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
      const token = await SecureStore.getItemAsync('df_token');
      const userStr = await SecureStore.getItemAsync('df_user');
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr), isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    const { data } = await authService.login(email, password);
    await SecureStore.setItemAsync('df_token', data.token);
    await SecureStore.setItemAsync('df_user', JSON.stringify(data.user));
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  loginWithGoogle: async (token: string, user: User) => {
    await SecureStore.setItemAsync('df_token', token);
    await SecureStore.setItemAsync('df_user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('df_token');
    await SecureStore.deleteItemAsync('df_user');
    set({ user: null, token: null, isAuthenticated: false });
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
      const { data } = await reportService.dashboard();
      set({ data, isLoading: false });
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
      const { data } = await projectService.list(params);
      set({ projects: data.projects, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  fetchOne: async (id) => {
    set({ isLoading: true });
    try {
      const { data } = await projectService.get(id);
      set({ selectedProject: data, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  create: async (data) => {
    const { data: res } = await projectService.create(data);
    set((state) => ({ projects: [res.project, ...state.projects] }));
    return res.project;
  },

  update: async (id, data) => {
    await projectService.update(id, data);
    await get().fetchAll();
  },

  remove: async (id) => {
    await projectService.delete(id);
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
      const { data } = await transactionService.list(params);
      set({ transactions: data.transactions, total: data.total, isLoading: false });
    } catch (e: any) {
      set({ error: e.message, isLoading: false });
    }
  },

  create: async (data) => {
    const { data: res } = await transactionService.create(data);
    set((state) => ({ transactions: [res.transaction, ...state.transactions] }));
    return res.transaction;
  },

  remove: async (id) => {
    await transactionService.delete(id);
    set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
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
      const { data } = await categoryService.list(params);
      set({ categories: data.categories });
    } catch {}
  },
}));
