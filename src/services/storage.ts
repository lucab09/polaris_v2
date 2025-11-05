import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';
import * as Crypto from 'expo-crypto';
import { Consent, LocationData, BrowsingData, User } from '@types/index';

// Initialize SQLite database
const db = SQLite.openDatabaseSync('polaris.db');

const STORAGE_KEYS = {
  USER: 'user',
  ENCRYPTION_KEY: 'encryption_key',
};

class StorageService {
  private encryptionKey: string | null = null;

  /**
   * Initialize storage and create tables
   */
  async initialize(): Promise<void> {
    try {
      // Create tables
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS consents (
          id TEXT PRIMARY KEY,
          type TEXT NOT NULL,
          enabled INTEGER NOT NULL,
          granularity TEXT NOT NULL,
          dataRetention INTEGER NOT NULL,
          allowBackground INTEGER NOT NULL,
          createdAt INTEGER NOT NULL,
          updatedAt INTEGER NOT NULL
        );

        CREATE TABLE IF NOT EXISTS location_data (
          id TEXT PRIMARY KEY,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          accuracy REAL NOT NULL,
          timestamp INTEGER NOT NULL,
          consent_id TEXT NOT NULL,
          synced INTEGER NOT NULL,
          FOREIGN KEY (consent_id) REFERENCES consents(id)
        );

        CREATE TABLE IF NOT EXISTS browsing_data (
          id TEXT PRIMARY KEY,
          domain TEXT NOT NULL,
          url TEXT NOT NULL,
          title TEXT NOT NULL,
          timeSpent INTEGER NOT NULL,
          timestamp INTEGER NOT NULL,
          consent_id TEXT NOT NULL,
          synced INTEGER NOT NULL,
          FOREIGN KEY (consent_id) REFERENCES consents(id)
        );

        CREATE TABLE IF NOT EXISTS sync_log (
          id TEXT PRIMARY KEY,
          userId TEXT NOT NULL,
          dataType TEXT NOT NULL,
          count INTEGER NOT NULL,
          dateStart INTEGER NOT NULL,
          dateEnd INTEGER NOT NULL,
          syncedAt INTEGER NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_location_timestamp ON location_data(timestamp);
        CREATE INDEX IF NOT EXISTS idx_browsing_timestamp ON browsing_data(timestamp);
        CREATE INDEX IF NOT EXISTS idx_sync_log_userId ON sync_log(userId);
      `);

      // Load or create encryption key
      await this.loadEncryptionKey();
    } catch (error) {
      console.error('Storage initialization error:', error);
      throw error;
    }
  }

  /**
   * Load or create encryption key from AsyncStorage
   */
  private async loadEncryptionKey(): Promise<void> {
    try {
      let key = await AsyncStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY);

      if (!key) {
        // Generate new encryption key
        key = await Crypto.getRandomBytesAsync(32).then((bytes) =>
          Array.from(bytes)
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('')
        );
        await AsyncStorage.setItem(STORAGE_KEYS.ENCRYPTION_KEY, key);
      }

      this.encryptionKey = key;
    } catch (error) {
      console.error('Failed to load encryption key:', error);
      throw error;
    }
  }

  /**
   * Save user to AsyncStorage
   */
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save user:', error);
      throw error;
    }
  }

  /**
   * Get current user from AsyncStorage
   */
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to get user:', error);
      return null;
    }
  }

  /**
   * Save consent settings to SQLite
   */
  async saveConsent(consent: Consent): Promise<void> {
    try {
      await db.runAsync(
        `INSERT OR REPLACE INTO consents (
          id, type, enabled, granularity, dataRetention, allowBackground, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          consent.id,
          consent.type,
          consent.enabled ? 1 : 0,
          consent.granularity,
          consent.dataRetention,
          consent.allowBackground ? 1 : 0,
          consent.createdAt,
          consent.updatedAt,
        ]
      );
    } catch (error) {
      console.error('Failed to save consent:', error);
      throw error;
    }
  }

  /**
   * Get all consents from SQLite
   */
  async getConsents(): Promise<Consent[]> {
    try {
      const result = await db.getAllAsync<Consent>(
        'SELECT * FROM consents ORDER BY updatedAt DESC'
      );
      return result.map((consent) => ({
        ...consent,
        enabled: Boolean(consent.enabled),
        allowBackground: Boolean(consent.allowBackground),
      }));
    } catch (error) {
      console.error('Failed to get consents:', error);
      throw error;
    }
  }

  /**
   * Get consent by type
   */
  async getConsentByType(type: string): Promise<Consent | null> {
    try {
      const result = await db.getFirstAsync<Consent>(
        'SELECT * FROM consents WHERE type = ?',
        [type]
      );
      return result ? {
        ...result,
        enabled: Boolean(result.enabled),
        allowBackground: Boolean(result.allowBackground),
      } : null;
    } catch (error) {
      console.error('Failed to get consent by type:', error);
      return null;
    }
  }

  /**
   * Save location data to SQLite
   */
  async saveLocationData(location: LocationData): Promise<void> {
    try {
      await db.runAsync(
        `INSERT INTO location_data (
          id, latitude, longitude, accuracy, timestamp, consent_id, synced
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          location.id,
          location.latitude,
          location.longitude,
          location.accuracy,
          location.timestamp,
          location.consent_id,
          location.synced ? 1 : 0,
        ]
      );
    } catch (error) {
      console.error('Failed to save location data:', error);
      throw error;
    }
  }

  /**
   * Get unsynced location data
   */
  async getUnsyncedLocationData(): Promise<LocationData[]> {
    try {
      const result = await db.getAllAsync<LocationData>(
        'SELECT * FROM location_data WHERE synced = 0 ORDER BY timestamp DESC LIMIT 100'
      );
      return result.map((data) => ({
        ...data,
        synced: Boolean(data.synced),
      }));
    } catch (error) {
      console.error('Failed to get unsynced location data:', error);
      throw error;
    }
  }

  /**
   * Save browsing data to SQLite
   */
  async saveBrowsingData(browsing: BrowsingData): Promise<void> {
    try {
      await db.runAsync(
        `INSERT INTO browsing_data (
          id, domain, url, title, timeSpent, timestamp, consent_id, synced
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          browsing.id,
          browsing.domain,
          browsing.url,
          browsing.title,
          browsing.timeSpent,
          browsing.timestamp,
          browsing.consent_id,
          browsing.synced ? 1 : 0,
        ]
      );
    } catch (error) {
      console.error('Failed to save browsing data:', error);
      throw error;
    }
  }

  /**
   * Get unsynced browsing data
   */
  async getUnsyncedBrowsingData(): Promise<BrowsingData[]> {
    try {
      const result = await db.getAllAsync<BrowsingData>(
        'SELECT * FROM browsing_data WHERE synced = 0 ORDER BY timestamp DESC LIMIT 100'
      );
      return result.map((data) => ({
        ...data,
        synced: Boolean(data.synced),
      }));
    } catch (error) {
      console.error('Failed to get unsynced browsing data:', error);
      throw error;
    }
  }

  /**
   * Mark location data as synced
   */
  async markLocationDataAsSynced(ids: string[]): Promise<void> {
    try {
      const placeholders = ids.map(() => '?').join(',');
      await db.runAsync(
        `UPDATE location_data SET synced = 1 WHERE id IN (${placeholders})`,
        ids
      );
    } catch (error) {
      console.error('Failed to mark location data as synced:', error);
      throw error;
    }
  }

  /**
   * Mark browsing data as synced
   */
  async markBrowsingDataAsSynced(ids: string[]): Promise<void> {
    try {
      const placeholders = ids.map(() => '?').join(',');
      await db.runAsync(
        `UPDATE browsing_data SET synced = 1 WHERE id IN (${placeholders})`,
        ids
      );
    } catch (error) {
      console.error('Failed to mark browsing data as synced:', error);
      throw error;
    }
  }

  /**
   * Get location data statistics
   */
  async getLocationDataStats(days: number = 30): Promise<{ count: number; lastSync: number }> {
    try {
      const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
      const result = await db.getFirstAsync<{ count: number; lastTimestamp: number }>(
        'SELECT COUNT(*) as count, MAX(timestamp) as lastTimestamp FROM location_data WHERE timestamp > ?',
        [cutoffTime]
      );
      return {
        count: result?.count || 0,
        lastSync: result?.lastTimestamp || 0,
      };
    } catch (error) {
      console.error('Failed to get location data stats:', error);
      throw error;
    }
  }

  /**
   * Get browsing data statistics
   */
  async getBrowsingDataStats(days: number = 30): Promise<{ count: number; domains: number }> {
    try {
      const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
      const result = await db.getFirstAsync<{ count: number; domains: number }>(
        `SELECT COUNT(*) as count, COUNT(DISTINCT domain) as domains
         FROM browsing_data WHERE timestamp > ?`,
        [cutoffTime]
      );
      return {
        count: result?.count || 0,
        domains: result?.domains || 0,
      };
    } catch (error) {
      console.error('Failed to get browsing data stats:', error);
      throw error;
    }
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAllData(): Promise<void> {
    try {
      await db.execAsync(`
        DELETE FROM browsing_data;
        DELETE FROM location_data;
        DELETE FROM sync_log;
        DELETE FROM consents;
      `);
    } catch (error) {
      console.error('Failed to clear all data:', error);
      throw error;
    }
  }
}

export const storageService = new StorageService();
