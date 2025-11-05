import { create } from 'zustand';
import { User } from '@types/index';
import { storageService } from '@services/storage';
import { encryptionService } from '@services/encryptionService';
import { generateId } from '@utils/helpers';

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isOnboarded: boolean;

  // Actions
  initializeUser: () => Promise<void>;
  createUser: () => Promise<User>;
  getUser: () => User | null;
  setUser: (user: User) => void;
  logout: () => Promise<void>;
  setIsOnboarded: (value: boolean) => void;
  setError: (error: string | null) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  isOnboarded: false,

  initializeUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const user = await storageService.getUser();
      if (user) {
        set({ user, isOnboarded: true });
      } else {
        // Create new user if doesn't exist
        const newUser = await get().createUser();
        set({ user: newUser });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize user';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  createUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const { publicKey, privateKey } = await encryptionService.generateKeyPair();

      const newUser: User = {
        id: generateId(),
        publicKey,
        createdAt: Date.now(),
        lastSync: 0,
      };

      await storageService.saveUser(newUser);
      set({ user: newUser });
      return newUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
      set({ error: errorMessage });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getUser: () => {
    return get().user;
  },

  setUser: (user: User) => {
    set({ user });
  },

  logout: async () => {
    try {
      await storageService.clearAllData();
      set({ user: null, isOnboarded: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to logout';
      set({ error: errorMessage });
    }
  },

  setIsOnboarded: (value: boolean) => {
    set({ isOnboarded: value });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
