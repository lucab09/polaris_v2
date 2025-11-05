// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
};

// Consent types
export const CONSENT_TYPES = {
  LOCATION: 'location',
  BROWSING: 'browsing',
  SEARCH: 'search',
  PURCHASES: 'purchases',
} as const;

// Granularity levels
export const GRANULARITY_LEVELS = {
  PRECISE: 'precise',
  APPROXIMATE: 'approximate',
  NONE: 'none',
} as const;

// Data retention periods (in days)
export const DATA_RETENTION_OPTIONS = {
  ONE_WEEK: 7,
  TWO_WEEKS: 14,
  ONE_MONTH: 30,
  THREE_MONTHS: 90,
  SIX_MONTHS: 180,
  ONE_YEAR: 365,
  INDEFINITE: 999999,
} as const;

// Sync intervals (in milliseconds)
export const SYNC_INTERVALS = {
  REAL_TIME: 10000, // 10 seconds
  FREQUENT: 300000, // 5 minutes
  NORMAL: 900000, // 15 minutes
  INFREQUENT: 3600000, // 1 hour
  MANUAL: -1, // Manual only
} as const;

// Screen names for navigation
export const SCREENS = {
  ONBOARDING: 'Onboarding',
  LOADING: 'Loading',
  HOME: 'Home',
  CONSENTS: 'Consents',
  SETTINGS: 'Settings',
  DATA_DASHBOARD: 'DataDashboard',
  PRIVACY_POLICY: 'PrivacyPolicy',
  TERMS: 'Terms',
} as const;

// Colors
export const COLORS = {
  PRIMARY: '#6366F1', // Indigo
  PRIMARY_DARK: '#4F46E5',
  PRIMARY_LIGHT: '#818CF8',
  SECONDARY: '#10B981', // Emerald
  SECONDARY_DARK: '#059669',
  SECONDARY_LIGHT: '#6EE7B7',
  DANGER: '#EF4444',
  WARNING: '#F59E0B',
  SUCCESS: '#10B981',
  INFO: '#3B82F6',
  GRAY_50: '#F9FAFB',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
  WHITE: '#FFFFFF',
  BLACK: '#000000',
} as const;

// Typography sizes
export const FONT_SIZES = {
  XS: 12,
  SM: 14,
  BASE: 16,
  LG: 18,
  XL: 20,
  '2XL': 24,
  '3XL': 30,
  '4XL': 36,
} as const;

// Spacing
export const SPACING = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
} as const;

// Border radius
export const BORDER_RADIUS = {
  NONE: 0,
  SM: 4,
  BASE: 6,
  LG: 8,
  XL: 12,
  FULL: 9999,
} as const;

// Animation durations (in milliseconds)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  BASE: 300,
  SLOW: 500,
  SLOWER: 700,
} as const;

// Status messages
export const STATUS_MESSAGES = {
  LOADING: 'Loading...',
  SUCCESS: 'Success!',
  ERROR: 'An error occurred',
  NO_DATA: 'No data available',
  SYNCING: 'Syncing data...',
  SYNCED: 'Data synced',
  OFFLINE: 'Offline mode',
} as const;

// Minimum data retention before sync
export const MIN_DATA_POINTS_FOR_SYNC = 5;

// Maximum concurrent requests
export const MAX_CONCURRENT_REQUESTS = 3;
