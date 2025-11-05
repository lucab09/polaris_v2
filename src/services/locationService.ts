import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { Consent, LocationData } from '@types/index';
import { storageService } from './storage';
import { generateId } from '@utils/helpers';

const LOCATION_TRACKING_TASK = 'location-tracking-background';
const LOCATION_UPDATE_INTERVAL = 300000; // 5 minutes

class LocationService {
  private isTracking = false;
  private lastLocation: Location.LocationObject | null = null;

  /**
   * Request location permissions
   */
  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      return foregroundStatus === Location.PermissionStatus.GRANTED;
    } catch (error) {
      console.error('Failed to request location permission:', error);
      return false;
    }
  }

  /**
   * Request background location permission (iOS 11+)
   */
  async requestBackgroundLocationPermission(): Promise<boolean> {
    try {
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      return backgroundStatus === Location.PermissionStatus.GRANTED;
    } catch (error) {
      console.error('Failed to request background location permission:', error);
      return false;
    }
  }

  /**
   * Check if location permission is granted
   */
  async checkLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status === Location.PermissionStatus.GRANTED;
    } catch (error) {
      console.error('Failed to check location permission:', error);
      return false;
    }
  }

  /**
   * Get current location
   */
  async getCurrentLocation(): Promise<Location.LocationObject | null> {
    try {
      const hasPermission = await this.checkLocationPermission();
      if (!hasPermission) {
        console.warn('Location permission not granted');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      return location;
    } catch (error) {
      console.error('Failed to get current location:', error);
      return null;
    }
  }

  /**
   * Start foreground location tracking
   */
  async startForegroundTracking(consent: Consent): Promise<void> {
    try {
      const hasPermission = await this.checkLocationPermission();
      if (!hasPermission) {
        const granted = await this.requestLocationPermission();
        if (!granted) {
          throw new Error('Location permission not granted');
        }
      }

      // Start watching location
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: this.getAccuracy(consent.granularity),
          timeInterval: LOCATION_UPDATE_INTERVAL,
          distanceInterval: 100, // meters
        },
        (location) => this.handleLocationUpdate(location, consent.id)
      );

      this.isTracking = true;
      return () => subscription.remove();
    } catch (error) {
      console.error('Failed to start foreground location tracking:', error);
      throw error;
    }
  }

  /**
   * Start background location tracking
   */
  async startBackgroundTracking(consent: Consent): Promise<void> {
    try {
      if (!consent.allowBackground) {
        console.warn('Background tracking not allowed in consent');
        return;
      }

      const hasPermission = await this.checkLocationPermission();
      const hasBackgroundPermission = await this.checkBackgroundLocationPermission();

      if (!hasPermission) {
        const granted = await this.requestLocationPermission();
        if (!granted) throw new Error('Location permission not granted');
      }

      if (!hasBackgroundPermission) {
        const granted = await this.requestBackgroundLocationPermission();
        if (!granted) throw new Error('Background location permission not granted');
      }

      // Define background task
      TaskManager.defineTask(LOCATION_TRACKING_TASK, async (data: any) => {
        try {
          const { locations } = data as { locations: Location.LocationObject[] };
          for (const location of locations) {
            await this.handleLocationUpdate(location, consent.id);
          }
        } catch (error) {
          console.error('Background location task error:', error);
        }
      });

      // Start background location updates
      await Location.startLocationUpdatesAsync(LOCATION_TRACKING_TASK, {
        accuracy: this.getAccuracy(consent.granularity),
        timeInterval: LOCATION_UPDATE_INTERVAL,
        distanceInterval: 100,
        deferredUpdatesInterval: LOCATION_UPDATE_INTERVAL,
        showsBackgroundLocationIndicator: true,
      });

      this.isTracking = true;
    } catch (error) {
      console.error('Failed to start background location tracking:', error);
      throw error;
    }
  }

  /**
   * Stop location tracking
   */
  async stopTracking(): Promise<void> {
    try {
      // Stop foreground tracking (handled by subscription.remove())
      // Stop background tracking
      await Location.stopLocationUpdatesAsync(LOCATION_TRACKING_TASK);
      this.isTracking = false;
    } catch (error) {
      console.error('Failed to stop location tracking:', error);
    }
  }

  /**
   * Handle location update
   */
  private async handleLocationUpdate(
    location: Location.LocationObject,
    consentId: string
  ): Promise<void> {
    try {
      this.lastLocation = location;

      const locationData: LocationData = {
        id: generateId(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy || 0,
        timestamp: location.timestamp,
        consent_id: consentId,
        synced: false,
      };

      await storageService.saveLocationData(locationData);
    } catch (error) {
      console.error('Failed to handle location update:', error);
    }
  }

  /**
   * Get accuracy level based on granularity preference
   */
  private getAccuracy(
    granularity: 'precise' | 'approximate' | 'none'
  ): Location.Accuracy {
    switch (granularity) {
      case 'precise':
        return Location.Accuracy.BestForNavigation;
      case 'approximate':
        return Location.Accuracy.Balanced;
      case 'none':
        return Location.Accuracy.Lowest;
      default:
        return Location.Accuracy.Balanced;
    }
  }

  /**
   * Check background location permission
   */
  private async checkBackgroundLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.getBackgroundPermissionsAsync();
      return status === Location.PermissionStatus.GRANTED;
    } catch (error) {
      console.error('Failed to check background location permission:', error);
      return false;
    }
  }

  /**
   * Get tracking status
   */
  getTrackingStatus(): boolean {
    return this.isTracking;
  }

  /**
   * Get last known location
   */
  getLastLocation(): Location.LocationObject | null {
    return this.lastLocation;
  }
}

export const locationService = new LocationService();
