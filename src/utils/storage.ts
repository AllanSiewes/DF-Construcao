import { Platform } from 'react-native';

const getSecureStore = () => {
  if (Platform.OS === 'web') return null;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require('expo-secure-store');
};

export const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') return localStorage.getItem(key);
      return await getSecureStore().getItemAsync(key);
    } catch {
      return null;
    }
  },

  async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') { localStorage.setItem(key, value); return; }
      await getSecureStore().setItemAsync(key, value);
    } catch {}
  },

  async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') { localStorage.removeItem(key); return; }
      await getSecureStore().deleteItemAsync(key);
    } catch {}
  },
};
