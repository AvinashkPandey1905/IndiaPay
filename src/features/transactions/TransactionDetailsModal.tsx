import React, { useState, useEffect } from 'react';
import { X, Share2, AlertCircle, RefreshCcw, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { Transaction } from '../../types';
import { Button } from '../../components/ui/Button';
import { formatDate, formatINR } from '../../utils/formatters';
import { useToast } from '../../context/ToastContext';
import './TransactionDetailsModal.css';

interface Props {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetailsModal: React.FC<Props> = ({ transaction, isOpen, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) setIsClosing(false);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  if (!isOpen || !transaction) return null;

  const isSuccess = transaction.status === 'Success';
  const isFailed = transaction.status === 'Failed';

  const StatusIcon = isSuccess ? CheckCircle2 : (isFailed ? XCircle : Clock);
  const statusColor = isSuccess ? 'var(--success)' : (isFailed ? 'var(--danger)' : 'var(--warning)');

  return (
    <div className={`txn-modal-overlay ${isClosing ? 'fade-out' : 'animate-fade-in'}`}>
      <div className={`txn-modal-content glass-pane ${isClosing ? 'slide-down' : 'animate-slide-up'}`}>
        <div className="txn-modal-header">
          <button className="close-btn" onClick={handleClose}><X size={20}/></button>
        </div>

        <div className="txn-modal-body">
          <div className="txn-hero">
             <div className="txn-avatar">
                {transaction.recipientName.split('')[0]}
             </div>
             <h2>{transaction.type === 'Receive' ? '+' : '-'}{formatINR(transaction.amount)}</h2>
             <p className="txn-target">{transaction.type === 'Receive' ? 'From' : 'To'} <strong>{transaction.recipientName}</strong></p>
             <div className="status-pill" style={{ color: statusColor, background: `${statusColor}20` }}>
                <StatusIcon size={14} /> {transaction.status}
             </div>
          </div>

          <div className="txn-timeline premium-card">
             <div className="timeline-step passed">
                <div className="node"></div>
                <div className="step-info">
                   <p>Payment Initiated</p>
                   <span>{formatDate(transaction.date)}</span>
                </div>
             </div>
             <div className="timeline-step passed">
                <div className="node"></div>
                <div className="step-info">
                   <p>Bank Processing</p>
                   <span>Securely routed via NPCI</span>
                </div>
             </div>
             <div className={`timeline-step ${isSuccess ? 'passed' : (isFailed ? 'failed' : 'active')}`}>
                <div className="node"></div>
                <div className="step-info">
                   <p>{isSuccess ? 'Payment Settled' : (isFailed ? 'Payment Failed' : 'Pending Confirmation')}</p>
                   <span>{isSuccess ? 'Money deposited to account' : 'Awaiting final status'}</span>
                </div>
             </div>
          </div>

          <div className="txn-details-grid premium-card">
             <div className="detail-row">
                <span>Transaction ID</span>
                <strong>{transaction.id}</strong>
             </div>
             <div className="detail-row">
                <span>Category</span>
                <strong>{transaction.category}</strong>
             </div>
             <div className="detail-row">
                <span>Debited From</span>
                <strong>IndiaPay •••• 9921</strong>
             </div>
          </div>

          <div className="txn-actions">
             <Button variant="secondary" fullWidth onClick={() => {
                navigator.clipboard.writeText(`IndiaPay Receipt #${transaction.id}`);
                showToast('Receipt securely copied to clipboard', 'success');
             }}>
               <Share2 size={16}/> Share Receipt
             </Button>
             <div className="action-row">
               <button className="text-btn text-danger" onClick={() => showToast('Connecting you to a support agent...', 'info')}><AlertCircle size={16}/> Report Issue</button>
               {transaction.type !== 'Receive' && (
                 <button className="text-btn" onClick={() => showToast('Opening quick pay...', 'info')}><RefreshCcw size={16}/> Send Again</button>
               )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
