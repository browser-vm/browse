"use client";

import { v4 as uuidv4 } from 'uuid';

interface TokenData {
  url: string;
  createdAt: number;
  used: boolean;
}

// Token expiration time in milliseconds (30 minutes)
const TOKEN_EXPIRATION = 30 * 60 * 1000;

export class TokenManager {
  private static instance: TokenManager;
  private tokens: Map<string, TokenData>;
  
  private constructor() {
    this.tokens = new Map<string, TokenData>();
    this.loadFromStorage();
  }
  
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }
  
  private loadFromStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const storedTokens = localStorage.getItem('uv-tokens');
      if (storedTokens) {
        const parsedTokens = JSON.parse(storedTokens) as Record<string, TokenData>;
        this.tokens = new Map(Object.entries(parsedTokens));
        
        // Clean expired tokens on load
        this.cleanExpiredTokens();
      }
    } catch (error) {
      console.error('Failed to load tokens from storage:', error);
      this.tokens = new Map();
    }
  }
  
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const tokensObj = Object.fromEntries(this.tokens.entries());
      localStorage.setItem('uv-tokens', JSON.stringify(tokensObj));
    } catch (error) {
      console.error('Failed to save tokens to storage:', error);
    }
  }
  
  public createToken(url: string): string {
    const token = uuidv4();
    this.tokens.set(token, {
      url,
      createdAt: Date.now(),
      used: false
    });
    this.saveToStorage();
    return token;
  }
  
  public getUrlByToken(token: string): string | null {
    const tokenData = this.tokens.get(token);
    
    if (!tokenData) {
      return null;
    }
    
    // Check if token has expired
    if (Date.now() - tokenData.createdAt > TOKEN_EXPIRATION) {
      this.tokens.delete(token);
      this.saveToStorage();
      return null;
    }
    
    // Check if token has already been used
    if (tokenData.used) {
      return null;
    }
    
    // Mark token as used
    tokenData.used = true;
    this.saveToStorage();
    
    return tokenData.url;
  }
  
  public cleanExpiredTokens(): void {
    const now = Date.now();
    let hasChanges = false;
    
    for (const [token, data] of this.tokens.entries()) {
      if (now - data.createdAt > TOKEN_EXPIRATION || data.used) {
        this.tokens.delete(token);
        hasChanges = true;
      }
    }
    
    if (hasChanges) {
      this.saveToStorage();
    }
  }
}
