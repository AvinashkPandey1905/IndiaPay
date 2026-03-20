import { db } from '../mocks/db';
import type { Transaction } from '../types';

// Simulate network latency (between 400ms and 800ms)
const delay = (ms?: number) => new Promise(resolve => setTimeout(resolve, ms || 400 + Math.random() * 400));

export const apiClient = {
  getUserProfile: async () => {
    await delay();
    return db.user;
  },

  getBalance: async () => {
    await delay();
    return db.balance;
  },

  addMoney: async (amount: number) => {
    await delay(1200);
    db.balance += amount;
    return db.balance;
  },

  getRecentContacts: async () => {
    await delay();
    return db.recentContacts;
  },

  getTransactions: async (): Promise<Transaction[]> => {
    await delay(600); // Slightly longer for transactions
    return [...db.transactions];
  },

  getAnalytics: async () => {
    await delay();
    return db.analytics;
  },

  getCardData: async () => {
    await delay();
    return db.cards;
  },

  updateCardSettings: async (settings: any) => {
    await delay(600);
    db.cards.settings = { ...db.cards.settings, ...settings };
    return db.cards.settings;
  },

  // Mock a POST request
  postPayment: async (recipientName: string, amount: number) => {
    await delay(1500); // Simulate processing time

    const newTxn: Transaction = {
      id: `IP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      type: 'Send',
      amount,
      recipientName,
      recipientUpi: recipientName.toLowerCase().replace(' ', '') + '@okaxis',
      date: new Date().toISOString(),
      category: 'Transfer',
      status: 'Success'
    };

    // Mutate our mock DB (in-memory)
    db.transactions.unshift(newTxn);
    db.balance -= amount;

    return newTxn;
  }
};
