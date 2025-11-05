import { BrowsingData } from '@types/index';
import { storageService } from './storage';
import { generateId } from '@utils/helpers';

interface BrowsingPageSession {
  domain: string;
  url: string;
  title: string;
  startTime: number;
}

class BrowsingService {
  private currentSession: BrowsingPageSession | null = null;
  private consentId: string | null = null;

  /**
   * Initialize browsing tracking with consent ID
   */
  setConsentId(consentId: string): void {
    this.consentId = consentId;
  }

  /**
   * Track page visit
   * Call when user navigates to a new page
   */
  async trackPageVisit(url: string, title: string): Promise<void> {
    try {
      if (!this.consentId) {
        console.warn('No consent ID set for browsing tracking');
        return;
      }

      // Save previous session if exists
      if (this.currentSession) {
        await this.endSession();
      }

      // Extract domain from URL
      const domain = this.extractDomain(url);

      // Start new session
      this.currentSession = {
        domain,
        url,
        title,
        startTime: Date.now(),
      };
    } catch (error) {
      console.error('Failed to track page visit:', error);
    }
  }

  /**
   * End current browsing session
   */
  async endSession(): Promise<void> {
    try {
      if (!this.currentSession || !this.consentId) {
        return;
      }

      const timeSpent = Date.now() - this.currentSession.startTime;

      // Only save if user spent at least 3 seconds on page
      if (timeSpent > 3000) {
        const browsingData: BrowsingData = {
          id: generateId(),
          domain: this.currentSession.domain,
          url: this.currentSession.url,
          title: this.currentSession.title,
          timeSpent: Math.round(timeSpent / 1000), // convert to seconds
          timestamp: Date.now(),
          consent_id: this.consentId,
          synced: false,
        };

        await storageService.saveBrowsingData(browsingData);
      }

      this.currentSession = null;
    } catch (error) {
      console.error('Failed to end browsing session:', error);
    }
  }

  /**
   * Manually record browsing activity
   */
  async recordBrowsingActivity(
    domain: string,
    url: string,
    title: string,
    timeSpent: number
  ): Promise<void> {
    try {
      if (!this.consentId) {
        console.warn('No consent ID set for browsing tracking');
        return;
      }

      const browsingData: BrowsingData = {
        id: generateId(),
        domain,
        url,
        title,
        timeSpent,
        timestamp: Date.now(),
        consent_id: this.consentId,
        synced: false,
      };

      await storageService.saveBrowsingData(browsingData);
    } catch (error) {
      console.error('Failed to record browsing activity:', error);
    }
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname || url;
    } catch {
      // If URL parsing fails, return the raw string
      return url;
    }
  }

  /**
   * Get browsing statistics for a given period
   */
  async getBrowsingStats(days: number = 30): Promise<{
    totalSessions: number;
    uniqueDomains: number;
    totalTimeSpent: number;
    topDomains: Array<{ domain: string; sessions: number; timeSpent: number }>;
  }> {
    try {
      const stats = await storageService.getBrowsingDataStats(days);

      return {
        totalSessions: stats.count,
        uniqueDomains: stats.domains,
        totalTimeSpent: 0, // Will be calculated from actual data
        topDomains: [],
      };
    } catch (error) {
      console.error('Failed to get browsing stats:', error);
      return {
        totalSessions: 0,
        uniqueDomains: 0,
        totalTimeSpent: 0,
        topDomains: [],
      };
    }
  }

  /**
   * Clear browsing history
   */
  async clearHistory(): Promise<void> {
    try {
      // This will be implemented with a delete query in storageService
      console.log('Clear history - to be implemented with proper DB query');
    } catch (error) {
      console.error('Failed to clear browsing history:', error);
    }
  }

  /**
   * Get current session info
   */
  getCurrentSession(): BrowsingPageSession | null {
    return this.currentSession;
  }
}

export const browsingService = new BrowsingService();
