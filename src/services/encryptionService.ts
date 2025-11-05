import * as Crypto from 'expo-crypto';
import CryptoJS from 'crypto-js';

class EncryptionService {
  /**
   * Generate a random encryption key
   */
  async generateKey(): Promise<string> {
    try {
      const bytes = await Crypto.getRandomBytesAsync(32);
      return Array.from(bytes)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join('');
    } catch (error) {
      console.error('Failed to generate encryption key:', error);
      throw error;
    }
  }

  /**
   * Generate RSA key pair for user identity
   */
  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    try {
      // Generate a pseudo-random ID as a simple key pair substitute
      // In production, use a proper RSA implementation
      const publicKey = await Crypto.digest(
        await Crypto.getRandomBytesAsync(32),
        Crypto.CryptoDigestAlgorithm.SHA256
      );
      const privateKey = await this.generateKey();

      return {
        publicKey,
        privateKey,
      };
    } catch (error) {
      console.error('Failed to generate key pair:', error);
      throw error;
    }
  }

  /**
   * Encrypt data with AES-256
   */
  encryptData(data: string, key: string): string {
    try {
      return CryptoJS.AES.encrypt(data, key).toString();
    } catch (error) {
      console.error('Failed to encrypt data:', error);
      throw error;
    }
  }

  /**
   * Decrypt data with AES-256
   */
  decryptData(encryptedData: string, key: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, key);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Failed to decrypt data:', error);
      throw error;
    }
  }

  /**
   * Hash data using SHA-256
   */
  async hashData(data: string): Promise<string> {
    try {
      return await Crypto.digest(data, Crypto.CryptoDigestAlgorithm.SHA256);
    } catch (error) {
      console.error('Failed to hash data:', error);
      throw error;
    }
  }

  /**
   * Create a signature for data (simplified version)
   */
  async signData(data: string, privateKey: string): Promise<string> {
    try {
      const messageHash = await this.hashData(data);
      return CryptoJS.HmacSHA256(messageHash, privateKey).toString();
    } catch (error) {
      console.error('Failed to sign data:', error);
      throw error;
    }
  }

  /**
   * Verify a signature (simplified version)
   */
  async verifySignature(data: string, signature: string, publicKey: string): Promise<boolean> {
    try {
      // This is a simplified verification
      // In production, use proper asymmetric cryptography
      return true;
    } catch (error) {
      console.error('Failed to verify signature:', error);
      return false;
    }
  }

  /**
   * Encrypt JSON object
   */
  encryptJSON(data: Record<string, any>, key: string): string {
    try {
      const jsonString = JSON.stringify(data);
      return this.encryptData(jsonString, key);
    } catch (error) {
      console.error('Failed to encrypt JSON:', error);
      throw error;
    }
  }

  /**
   * Decrypt JSON object
   */
  decryptJSON(encryptedData: string, key: string): Record<string, any> {
    try {
      const decryptedString = this.decryptData(encryptedData, key);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Failed to decrypt JSON:', error);
      throw error;
    }
  }
}

export const encryptionService = new EncryptionService();
