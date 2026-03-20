import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from './Button';
import { apiClient } from '../../api/client';
import '../../features/payments/PaymentModal.css'; // Reusing styles

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onBalanceUpdate: (newBalance: number) => void;
}

const AddMoneyModal: React.FC<Props> = ({ isOpen, onClose, onBalanceUpdate }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleAdd = () => {
    const val = parseFloat(amount);
    if (!val) return;
    setLoading(true);
    apiClient.addMoney(val).then(newBalance => {
      setLoading(false);
      setStep(1);
      onBalanceUpdate(newBalance);
      showToast(`₹${val} added to your wallet successfully!`, 'success');
      setTimeout(() => {
        setStep(0);
        setAmount('');
        onClose();
      }, 2000);
    });
  };

  return (
    <div className="payment-overlay-v2 animate-fade-in" style={{zIndex: 9999}}>
      <div className="payment-modal-v2 glass-pane animate-slide-up">
        {step === 0 ? (
          <>
            <div className="modal-header">
              <div className="header-badge">Top-up Wallet</div>
              <button className="close-btn" onClick={onClose}><X size={20}/></button>
            </div>
            <div className="modal-body-v2 animate-slide-in-right">
              <div className="amount-input-v2">
                <span className="unit">₹</span>
                <input 
                  type="number" 
                  placeholder="0.00" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                />
              </div>
              <div style={{display: 'flex', gap: '8px', marginBottom: '24px', justifyContent: 'center'}}>
                {[500, 1000, 2000, 5000].map(amt => (
                  <button 
                    key={amt} 
                    onClick={() => setAmount(amt.toString())}
                    style={{
                      background: 'var(--surface-light)',
                      border: '1px solid var(--border)',
                      padding: '8px 12px',
                      borderRadius: '16px',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>
              <Button 
                className="main-action-btn hover-scale" 
                disabled={!amount || loading} 
                onClick={handleAdd}
                fullWidth
              >
                {loading ? 'Processing via UPI...' : 'Add Securely'}
              </Button>
            </div>
          </>
        ) : (
          <div className="payment-step success-view animate-scale-in-spring">
             <CheckCircle size={64} style={{color: 'var(--success)', marginBottom: '16px'}} />
             <h2>Top-up Successful</h2>
             <p className="success-meta">Your Wallet balance has been instantly updated to ₹{parseFloat(amount).toLocaleString('en-IN')}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddMoneyModal;
