"use client";

import { useState, useEffect } from 'react';
import { createProxyUrl, defaultProxyConfig } from './proxy';
import { TokenManager } from './token-manager';

interface UseProxyServiceResult {
  loading: boolean;
  error: string | null;
  proxyUrl: string | null;
  navigateTo: (url: string) => void;
  securityLevel: 'standard' | 'one-time';
  setSecurityLevel: (level: 'standard' | 'one-time') => void;
}

export function useProxyService(): UseProxyServiceResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [proxyUrl, setProxyUrl] = useState<string | null>(null);
  const [securityLevel, setSecurityLevel] = useState<'standard' | 'one-time'>('one-time');
  
  // Update proxy config when security level changes
  useEffect(() => {
    defaultProxyConfig.useOneTimeTokens = securityLevel === 'one-time';
    
    // Clean expired tokens periodically
    if (securityLevel === 'one-time') {
      const tokenManager = TokenManager.getInstance();
      tokenManager.cleanExpiredTokens();
      
      const cleanupInterval = setInterval(() => {
        tokenManager.cleanExpiredTokens();
      }, 5 * 60 * 1000); // Clean every 5 minutes
      
      return () => clearInterval(cleanupInterval);
    }
  }, [securityLevel]);
  
  // Function to navigate to a URL through the proxy
  const navigateTo = (url: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Create a proxied URL
      const proxiedUrl = createProxyUrl(url);
      setProxyUrl(proxiedUrl);
      setLoading(false);
    } catch (err) {
      setError('Failed to create proxy URL: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    proxyUrl,
    navigateTo,
    securityLevel,
    setSecurityLevel
  };
}

// For client-side storage of browsing history
export function useProxyHistory(maxHistoryItems = 10) {
  const [history, setHistory] = useState<string[]>([]);
  
  // Load history from localStorage on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedHistory = localStorage.getItem('uv-history');
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (error) {
        console.error('Failed to load browsing history:', error);
      }
    }
  }, []);
  
  // Save history to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && history.length > 0) {
      localStorage.setItem('uv-history', JSON.stringify(history));
    }
  }, [history]);
  
  // Add a URL to history
  const addToHistory = (url: string) => {
    setHistory(prev => {
      // Remove existing entry if present
      const filtered = prev.filter(item => item !== url);
      // Add to front of array
      const newHistory = [url, ...filtered].slice(0, maxHistoryItems);
      return newHistory;
    });
  };
  
  // Clear history
  const clearHistory = () => {
    setHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('uv-history');
    }
  };
  
  return {
    history,
    addToHistory,
    clearHistory
  };
}
