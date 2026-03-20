import type { Transaction } from '../types';

export const db = {
  user: {
    name: 'Avinash Pandey',
    phone: '9876543210',
    upiId: 'avinash.pandey@okaxis',
    kycStatus: 'Verified'
  },
  balance: 128450.00,
  recentContacts: [
    { name: 'Rahul Kumar', upi: 'rahul@okaxis', initials: 'RK' },
    { name: 'Sanjay Jha', upi: 'sanjay@icici', initials: 'SJ' },
    { name: 'Priya Nath', upi: 'priya@paytm', initials: 'PN' },
    { name: 'Manoj Kishore', upi: 'manoj@axis', initials: 'MK' }
  ],
  transactions: [
    {
      id: "IP-10293",
      type: "Send",
      amount: 450,
      recipientName: "Rahul Kumar",
      date: new Date(Date.now() - 86400000).toISOString(),
      category: "Food & Drinks",
      status: "Success"
    },
    {
      id: "IP-10294",
      type: "Receive",
      amount: 25000,
      recipientName: "TechCorp Inc",
      date: new Date(Date.now() - 172800000).toISOString(),
      category: "Salary",
      status: "Success"
    },
    {
      id: "IP-10295",
      type: "Bill",
      amount: 1200,
      recipientName: "Airtel Broadband",
      date: new Date(Date.now() - 259200000).toISOString(),
      category: "Utilities",
      status: "Success"
    }
  ] as Transaction[],
  analytics: {
    totalOutflow: 25500,
    totalInflow: 42800,
    chartBars: [60, 40, 90, 70, 50, 85, 95],
    spendingData: [
      { label: 'Food', amount: 4500, color: '#818cf8', percentage: 35 },
      { label: 'Rent', amount: 12000, color: '#f59e0b', percentage: 25 },
      { label: 'Bills', amount: 3200, color: '#10b981', percentage: 15 },
      { label: 'Shopping', amount: 5800, color: '#3b82f6', percentage: 25 },
    ]
  },
  cards: {
    virtual: {
      type: 'Virtual Platinum',
      number: '4829 •••• •••• 9921',
      holder: 'AVINASH PANDEY',
      exp: '12/28',
      cvv: '•••',
      network: 'VISA'
    },
    settings: {
      onlineTransactions: true,
      monthlyLimit: 50000,
      fraudProtection: true
    }
  }
};
