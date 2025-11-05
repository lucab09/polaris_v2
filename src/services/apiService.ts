import axios, { AxiosInstance } from 'axios';
import { ApiResponse, LocationData, BrowsingData } from '@types/index';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Default to localhost for development
    // Will be configured at runtime based on environment
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor
    this.api.interceptors.request.use((config) => {
      // Could add authentication headers here
      return config;
    });

    // Add response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set API base URL dynamically
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
    this.api.defaults.baseURL = url;
  }

  /**
   * Register a new user
   */
  async registerUser(data: {
    publicKey: string;
    userId: string;
  }): Promise<ApiResponse<{ token: string }>> {
    try {
      const response = await this.api.post<ApiResponse<{ token: string }>>('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Failed to register user:', error);
      throw error;
    }
  }

  /**
   * Sync location data to server
   */
  async syncLocationData(data: {
    userId: string;
    locations: LocationData[];
  }): Promise<ApiResponse<{ synced: number }>> {
    try {
      const response = await this.api.post<ApiResponse<{ synced: number }>>(
        '/data/location/sync',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to sync location data:', error);
      throw error;
    }
  }

  /**
   * Sync browsing data to server
   */
  async syncBrowsingData(data: {
    userId: string;
    browsing: BrowsingData[];
  }): Promise<ApiResponse<{ synced: number }>> {
    try {
      const response = await this.api.post<ApiResponse<{ synced: number }>>(
        '/data/browsing/sync',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to sync browsing data:', error);
      throw error;
    }
  }

  /**
   * Get available data buyers/marketplace opportunities
   */
  async getDataMarketplace(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        description: string;
        dataTypes: string[];
        reward: number;
      }>
    >
  > {
    try {
      const response = await this.api.get('/marketplace/buyers');
      return response.data;
    } catch (error) {
      console.error('Failed to get marketplace data:', error);
      throw error;
    }
  }

  /**
   * Submit consent preferences to server
   */
  async submitConsents(data: {
    userId: string;
    consents: Array<{
      type: string;
      enabled: boolean;
      granularity: string;
    }>;
  }): Promise<ApiResponse<{ saved: boolean }>> {
    try {
      const response = await this.api.post<ApiResponse<{ saved: boolean }>>(
        '/consents/submit',
        data
      );
      return response.data;
    } catch (error) {
      console.error('Failed to submit consents:', error);
      throw error;
    }
  }

  /**
   * Get user data statistics
   */
  async getDataStats(userId: string): Promise<
    ApiResponse<{
      locationPoints: number;
      browsingPoints: number;
      totalRewards: number;
    }>
  > {
    try {
      const response = await this.api.get(`/stats/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get data stats:', error);
      throw error;
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    try {
      const response = await this.api.get<ApiResponse<{ status: string }>>('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
