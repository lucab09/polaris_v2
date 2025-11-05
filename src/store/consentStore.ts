import { create } from 'zustand';
import { Consent } from '@types/index';
import { storageService } from '@services/storage';
import { CONSENT_TYPES, GRANULARITY_LEVELS, DATA_RETENTION_OPTIONS } from '@utils/constants';
import { generateId } from '@utils/helpers';

interface ConsentState {
  consents: Consent[];
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeConsents: () => Promise<void>;
  getConsents: () => Consent[];
  getConsentByType: (type: string) => Consent | null;
  createConsent: (consent: Omit<Consent, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Consent>;
  updateConsent: (id: string, updates: Partial<Consent>) => Promise<void>;
  toggleConsent: (id: string) => Promise<void>;
  resetConsents: () => Promise<void>;
  setError: (error: string | null) => void;
}

const DEFAULT_CONSENTS = [
  {
    type: CONSENT_TYPES.LOCATION,
    enabled: false,
    granularity: GRANULARITY_LEVELS.APPROXIMATE,
    dataRetention: DATA_RETENTION_OPTIONS.ONE_MONTH,
    allowBackground: false,
  },
  {
    type: CONSENT_TYPES.BROWSING,
    enabled: false,
    granularity: GRANULARITY_LEVELS.APPROXIMATE,
    dataRetention: DATA_RETENTION_OPTIONS.ONE_MONTH,
    allowBackground: false,
  },
  {
    type: CONSENT_TYPES.SEARCH,
    enabled: false,
    granularity: GRANULARITY_LEVELS.APPROXIMATE,
    dataRetention: DATA_RETENTION_OPTIONS.ONE_MONTH,
    allowBackground: false,
  },
];

export const useConsentStore = create<ConsentState>((set, get) => ({
  consents: [],
  isLoading: false,
  error: null,

  initializeConsents: async () => {
    set({ isLoading: true, error: null });
    try {
      let consents = await storageService.getConsents();

      // If no consents exist, create default ones
      if (consents.length === 0) {
        for (const defaultConsent of DEFAULT_CONSENTS) {
          const consent = await get().createConsent(defaultConsent);
          consents.push(consent);
        }
      }

      set({ consents });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize consents';
      set({ error: errorMessage });
    } finally {
      set({ isLoading: false });
    }
  },

  getConsents: () => {
    return get().consents;
  },

  getConsentByType: (type: string) => {
    return get().consents.find((consent) => consent.type === type) || null;
  },

  createConsent: async (consent) => {
    set({ error: null });
    try {
      const newConsent: Consent = {
        ...consent,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await storageService.saveConsent(newConsent);

      set({ consents: [...get().consents, newConsent] });
      return newConsent;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create consent';
      set({ error: errorMessage });
      throw error;
    }
  },

  updateConsent: async (id: string, updates: Partial<Consent>) => {
    set({ error: null });
    try {
      const consents = get().consents;
      const consentIndex = consents.findIndex((c) => c.id === id);

      if (consentIndex === -1) {
        throw new Error('Consent not found');
      }

      const updatedConsent: Consent = {
        ...consents[consentIndex],
        ...updates,
        id,
        createdAt: consents[consentIndex].createdAt,
        updatedAt: Date.now(),
      };

      await storageService.saveConsent(updatedConsent);

      const newConsents = [...consents];
      newConsents[consentIndex] = updatedConsent;
      set({ consents: newConsents });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update consent';
      set({ error: errorMessage });
      throw error;
    }
  },

  toggleConsent: async (id: string) => {
    set({ error: null });
    try {
      const consent = get().consents.find((c) => c.id === id);
      if (!consent) {
        throw new Error('Consent not found');
      }

      await get().updateConsent(id, { enabled: !consent.enabled });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle consent';
      set({ error: errorMessage });
      throw error;
    }
  },

  resetConsents: async () => {
    set({ error: null });
    try {
      for (const defaultConsent of DEFAULT_CONSENTS) {
        const consent = get().getConsentByType(defaultConsent.type);
        if (consent) {
          await get().updateConsent(consent.id, defaultConsent);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reset consents';
      set({ error: errorMessage });
      throw error;
    }
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
