import { useEffect, useState, useCallback } from 'react';
import { browsingService } from '@services/browsingService';
import { useConsentStore } from '@store/consentStore';
import { CONSENT_TYPES } from '@utils/constants';

interface BrowsingState {
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
  sessionCount: number;
}

export const useBrowsingData = () => {
  const [state, setState] = useState<BrowsingState>({
    isTracking: false,
    isLoading: false,
    error: null,
    sessionCount: 0,
  });

  const consentStore = useConsentStore();
  const browsingConsent = consentStore.getConsentByType(CONSENT_TYPES.BROWSING);

  // Auto-start tracking if consent is enabled
  useEffect(() => {
    if (browsingConsent?.enabled && !state.isTracking) {
      startTracking();
    } else if (!browsingConsent?.enabled && state.isTracking) {
      stopTracking();
    }
  }, [browsingConsent?.enabled]);

  const startTracking = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      if (!browsingConsent) {
        throw new Error('Browsing consent not found');
      }

      browsingService.setConsentId(browsingConsent.id);
      setState((prev) => ({
        ...prev,
        isTracking: true,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start browsing tracking';
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  }, [browsingConsent]);

  const stopTracking = useCallback(async () => {
    try {
      await browsingService.endSession();
      setState((prev) => ({
        ...prev,
        isTracking: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop browsing tracking';
      setState((prev) => ({ ...prev, error: errorMessage }));
    }
  }, []);

  const trackPageVisit = useCallback(
    async (url: string, title: string) => {
      try {
        if (!state.isTracking) {
          console.warn('Browsing tracking is not active');
          return;
        }

        await browsingService.trackPageVisit(url, title);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to track page visit';
        setState((prev) => ({ ...prev, error: errorMessage }));
      }
    },
    [state.isTracking]
  );

  const recordActivity = useCallback(
    async (domain: string, url: string, title: string, timeSpent: number) => {
      try {
        if (!state.isTracking) {
          console.warn('Browsing tracking is not active');
          return;
        }

        await browsingService.recordBrowsingActivity(domain, url, title, timeSpent);
        setState((prev) => ({ ...prev, sessionCount: prev.sessionCount + 1 }));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to record activity';
        setState((prev) => ({ ...prev, error: errorMessage }));
      }
    },
    [state.isTracking]
  );

  return {
    ...state,
    startTracking,
    stopTracking,
    trackPageVisit,
    recordActivity,
  };
};
