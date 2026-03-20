import type { Transaction } from '../types';

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'TXN-1001',
    type: 'Send',
    status: 'Success',
    amount: 1200,
    recipientName: 'Rahul Kumar',
    recipientUpi: 'rahul@okaxis',
    date: '2026-03-12T10:30:00Z',
    category: 'Food'
  },
  {
    id: 'TXN-1002',
    type: 'Receive',
    status: 'Success',
    amount: 5000,
    recipientName: 'Sanjay Jha',
    recipientUpi: 'sanjay@icici',
    date: '2026-03-11T14:45:00Z',
    category: 'Transfer'
  },
  {
    id: 'TXN-1003',
    type: 'Bill',
    status: 'Pending',
    amount: 850,
    recipientName: 'Airtel Postpaid',
    recipientUpi: 'airtel@paytm',
    date: '2026-03-13T09:00:00Z',
    category: 'Utilities'
  },
  {
    id: 'TXN-1004',
    type: 'Send',
    status: 'Failed',
    amount: 15000,
    recipientName: 'Rent House',
    recipientUpi: 'owner@upi',
    date: '2026-03-10T11:20:00Z',
    category: 'Rent'
  }
];

export const paymentService = {
  getTransactions: async (): Promise<Transaction[]> => {
    // Simulate API delay
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_TRANSACTIONS), 800);
    });
  },

  processPayment: async (paymentData: Partial<Transaction>): Promise<{ success: boolean; txnId?: string }> => {
    console.log('Processing payment:', paymentData);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, txnId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase() }), 2000);
    });
  }
};
