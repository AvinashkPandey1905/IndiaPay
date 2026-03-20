import { useState } from 'react';
import type { WalletState } from '../types';

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    balance: 128450,
    rewards: 248,
    lastUpdated: new Date().toISOString()
  });

  const updateBalance = (amount: number) => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      lastUpdated: new Date().toISOString()
    }));
  };

  const addReward = (points: number) => {
    setWallet(prev => ({
      ...prev,
      rewards: prev.rewards + points
    }));
  };

  return {
    ...wallet,
    updateBalance,
    addReward
  };
};

/**
 * Hook for managing localStorage with types
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}
