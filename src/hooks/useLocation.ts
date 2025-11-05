import { useEffect, useState, useCallback } from 'react';
import { LocationService } from 'expo-location';
import { locationService } from '@services/locationService';
import { useConsentStore } from '@store/consentStore';
import { CONSENT_TYPES } from '@utils/constants';
import * as Location from 'expo-location';

interface LocationState {
  location: Location.LocationObject | null;
  isTracking: boolean;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    location: null,
    isTracking: false,
    hasPermission: false,
    isLoading: false,
    error: null,
  });

  const consentStore = useConsentStore();
  const locationConsent = consentStore.getConsentByType(CONSENT_TYPES.LOCATION);

  // Check permission on mount
  useEffect(() => {
    checkPermission();
  }, []);

  // Auto-start tracking if consent is enabled
  useEffect(() => {
    if (locationConsent?.enabled && !state.isTracking) {
      startTracking();
    } else if (!locationConsent?.enabled && state.isTracking) {
      stopTracking();
    }
  }, [locationConsent?.enabled]);

  const checkPermission = useCallback(async () => {
    try {
      const hasPermission = await locationService.checkLocationPermission();
      setState((prev) => ({ ...prev, hasPermission }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Permission check failed';
      setState((prev) => ({ ...prev, error: errorMessage }));
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const granted = await locationService.requestLocationPermission();

      if (!granted) {
        setState((prev) => ({
          ...prev,
          error: 'Location permission was denied',
          isLoading: false,
        }));
        return false;
      }

      setState((prev) => ({ ...prev, hasPermission: true, isLoading: false }));
      return true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to request permission';
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
      return false;
    }
  }, []);

  const startTracking = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      if (!state.hasPermission) {
        const granted = await requestPermission();
        if (!granted) {
          return;
        }
      }

      if (!locationConsent) {
        throw new Error('Location consent not found');
      }

      await locationService.startForegroundTracking(locationConsent);

      // Get current location
      const currentLocation = await locationService.getCurrentLocation();
      if (currentLocation) {
        setState((prev) => ({
          ...prev,
          location: currentLocation,
          isTracking: true,
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isTracking: true, isLoading: false }));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start tracking';
      setState((prev) => ({ ...prev, error: errorMessage, isLoading: false }));
    }
  }, [state.hasPermission, locationConsent, requestPermission]);

  const stopTracking = useCallback(async () => {
    try {
      await locationService.stopTracking();
      setState((prev) => ({
        ...prev,
        isTracking: false,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to stop tracking';
      setState((prev) => ({ ...prev, error: errorMessage }));
    }
  }, []);

  return {
    ...state,
    checkPermission,
    requestPermission,
    startTracking,
    stopTracking,
  };
};
