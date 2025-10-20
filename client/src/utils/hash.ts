import { AES, enc, HmacSHA256, lib } from 'crypto-js';

/**
 * Configuration options for URLHashUtils
 */
export interface URLHashConfig {
  secretKey: string;
  urlSafeChars?: boolean;
}

/**
 * URL-safe AES encryption/decryption utilities for string IDs
 */
export class URLHashUtils {
  private readonly secretKey: string;

  constructor(config: URLHashConfig | string) {
    if (typeof config === 'string') {
      this.secretKey = config;
    } else {
      this.secretKey = config.secretKey;
    }

    if (!this.secretKey) {
      throw new Error('Secret key is required');
    }
  }

  /**
   * Encrypt and encode a string ID for URL usage
   * @param id - The string ID to encrypt
   * @returns URL-safe encrypted hash
   */
  public encryptId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid string ID is required');
    }

    try {
      // Encrypt the ID
      const encrypted = AES.encrypt(id, this.secretKey).toString();
      
      // Make it URL-safe by base64url encoding
      return this.makeUrlSafe(encrypted);
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypt a URL-safe hash back to the original string ID
   * @param hash - The encrypted hash from URL
   * @returns Original decrypted ID
   */
  public decryptId(hash: string): string {
    if (!hash || typeof hash !== 'string') {
      throw new Error('Valid hash string is required');
    }

    try {
      // Convert back from URL-safe format
      const encrypted = this.fromUrlSafe(hash);
      
      // Decrypt the ID
      const bytes = AES.decrypt(encrypted, this.secretKey);
      const decrypted = bytes.toString(enc.Utf8);
      
      if (!decrypted) {
        throw new Error('Failed to decrypt - invalid hash or wrong key');
      }
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a simple hash (non-reversible) for URL usage
   * @param id - The string ID to hash
   * @returns URL-safe hash
   */
  public hashId(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid string ID is required');
    }

    // Create HMAC-SHA256 hash with secret key
    const hash = HmacSHA256(id, this.secretKey).toString();
    
    // Take first 16 characters and make URL-safe
    return this.makeUrlSafe(hash.substring(0, 16));
  }

  /**
   * Create a hash with custom length
   * @param id - The string ID to hash
   * @param length - Desired hash length (default: 16)
   * @returns URL-safe hash
   */
  public hashIdWithLength(id: string, length: number = 16): string {
    if (!id || typeof id !== 'string') {
      throw new Error('Valid string ID is required');
    }

    if (length < 1 || length > 64) {
      throw new Error('Length must be between 1 and 64');
    }

    const hash = HmacSHA256(id, this.secretKey).toString();
    return this.makeUrlSafe(hash.substring(0, length));
  }

  /**
   * Verify if an ID matches a given hash
   * @param id - Original string ID
   * @param hash - Hash to verify against
   * @returns True if ID matches the hash
   */
  public verifyHash(id: string, hash: string): boolean {
    try {
      const computedHash = this.hashId(id);
      return computedHash === hash;
    } catch {
      return false;
    }
  }

  /**
   * Make a string URL-safe by replacing problematic characters
   * @param str - String to make URL-safe
   * @returns URL-safe string
   */
  private makeUrlSafe(str: string): string {
    return str
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  }

  /**
   * Convert URL-safe string back to original format
   * @param str - URL-safe string
   * @returns Original format string
   */
  private fromUrlSafe(str: string): string {
    let result = str
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    while (result.length % 4) {
      result += '=';
    }
    
    return result;
  }

  /**
   * Generate a random secret key (for initialization)
   * @returns Random secret key
   */
  public static generateSecretKey(): string {
    return lib.WordArray.random(256/8).toString();
  }
}

/**
 * Utility functions for common URL hashing operations
 */
export class URLHashHelpers {
  /**
   * Create a URLHashUtils instance with environment variable
   * @param envVarName - Name of environment variable containing secret key
   * @returns URLHashUtils instance
   */
  public static fromEnv(envVarName: string = 'URL_HASH_SECRET'): URLHashUtils {
    const secretKey = process.env[envVarName];
    if (!secretKey) {
      throw new Error(`Environment variable ${envVarName} not found`);
    }
    return new URLHashUtils(secretKey);
  }

  /**
   * Create URL-safe hash from ID with default settings
   * @param id - String ID to hash
   * @param secretKey - Secret key for hashing
   * @returns URL-safe hash
   */
  public static quickHash(id: string, secretKey: string): string {
    const utils = new URLHashUtils(secretKey);
    return utils.hashId(id);
  }

  /**
   * Create encrypted ID for URL with default settings
   * @param id - String ID to encrypt
   * @param secretKey - Secret key for encryption
   * @returns URL-safe encrypted hash
   */
  public static quickEncrypt(id: string, secretKey: string): string {
    const utils = new URLHashUtils(secretKey);
    return utils.encryptId(id);
  }
}

// Example usage and types
export interface UserURLParams {
  userId: string;
  hashedId: string;
}

export interface HashResult {
  original: string;
  hashed: string;
  encrypted: string;
}

// Usage examples:
if (require.main === module) {
  const SECRET_KEY = process.env.URL_HASH_SECRET || 'your-secret-key-here';
  const urlHashUtils = new URLHashUtils(SECRET_KEY);

  try {
    // Original ID
    const originalId: string = 'user123';
    console.log('Original ID:', originalId);
    
    // Encrypt for URL (reversible)
    const encryptedHash: string = urlHashUtils.encryptId(originalId);
    console.log('Encrypted hash:', encryptedHash);
    
    // Decrypt back to original
    const decryptedId: string = urlHashUtils.decryptId(encryptedHash);
    console.log('Decrypted ID:', decryptedId);
    
    // Simple hash (non-reversible)
    const simpleHash: string = urlHashUtils.hashId(originalId);
    console.log('Simple hash:', simpleHash);
    
    // Custom length hash
    const customHash: string = urlHashUtils.hashIdWithLength(originalId, 12);
    console.log('Custom hash (12 chars):', customHash);
    
    // Verify hash
    const isValid: boolean = urlHashUtils.verifyHash(originalId, simpleHash);
    console.log('Hash verification:', isValid);
    
    // Generate new secret key
    const newKey: string = URLHashUtils.generateSecretKey();
    console.log('Generated key:', newKey);
    
    // Helper functions
    const quickHash: string = URLHashHelpers.quickHash(originalId, SECRET_KEY);
    console.log('Quick hash:', quickHash);
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
  }
}

export default URLHashUtils;