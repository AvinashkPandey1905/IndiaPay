export type TransactionStatus = 'Success' | 'Pending' | 'Failed';
export type TransactionType = 'Send' | 'Receive' | 'Bill' | 'Refund';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  recipientName: string;
  recipientUpi: string;
  date: string;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  upiId: string;
  qrCodeUrl: string;
  kycStatus: 'Verified' | 'Pending' | 'Not Started';
}

export interface WalletState {
  balance: number;
  rewards: number;
  lastUpdated: string;
}
