// User types
export interface User {
  id: string;
  publicKey: string;
  createdAt: number;
  lastSync: number;
}

// Consent types
export interface Consent {
  id: string;
  type: 'location' | 'browsing' | 'search' | 'purchases';
  enabled: boolean;
  granularity: 'precise' | 'approximate' | 'none';
  dataRetention: number; // days
  allowBackground: boolean;
  createdAt: number;
  updatedAt: number;
}

// Location data types
export interface LocationData {
  id: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
  consent_id: string;
  synced: boolean;
}

// Browsing data types
export interface BrowsingData {
  id: string;
  domain: string;
  url: string;
  title: string;
  timeSpent: number; // seconds
  timestamp: number;
  consent_id: string;
  synced: boolean;
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

// Sync types
export interface SyncData {
  userId: string;
  dataType: 'location' | 'browsing';
  count: number;
  dateRange: {
    start: number;
    end: number;
  };
}

// Storage types
export interface StorageSchema {
  users: User[];
  consents: Consent[];
  locationData: LocationData[];
  browsingData: BrowsingData[];
  syncLog: SyncData[];
}
