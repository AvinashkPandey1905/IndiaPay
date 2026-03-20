import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import { apiClient } from '../../api/client';
import { Skeleton } from '../../components/ui/Skeleton';
import './PaymentModal.css';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRecipient?: Recipient | null;
  mode?: 'send' | 'request';
}

interface Recipient {
  name: string;
  upi: string;
  initials: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, initialRecipient, mode = 'send' }) => {
  const [step, setStep] = useState(0);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(null);
  const [recentContacts, setRecentContacts] = useState<Recipient[]>([]);
  const [contactsLoading, setContactsLoading] = useState(true);
  const { showToast } = useToast();

  // Sync initial recipient if provided when opening
  React.useEffect(() => {
     if (isOpen && initialRecipient) {
        setSelectedRecipient(initialRecipient);
        setStep(1);
     }
  }, [isOpen, initialRecipient]);
  const [newRecipientName, setNewRecipientName] = useState('');
  const [newRecipientUpi, setNewRecipientUpi] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch contacts on open
  useEffect(() => {
    if (isOpen) {
      apiClient.getRecentContacts().then(res => {
        setRecentContacts(res);
        setContactsLoading(false);
      });
    }
  }, [isOpen]);

  const handlePay = () => {
    setLoading(true);
    apiClient.postPayment(selectedRecipient?.name || '', parseFloat(amount)).then(() => {
      setLoading(false);
      setStep(3);
      showToast(`₹${amount} transferred securely to ${selectedRecipient?.name}`, 'success');
    });
  };

  const handleSelectRecipient = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setStep(1);
  };

  const handleAddNew = () => {
    if (newRecipientName && newRecipientUpi) {
      const newRec: Recipient = {
        name: newRecipientName,
        upi: newRecipientUpi.includes('@') ? newRecipientUpi : `${newRecipientUpi}@upi`,
        initials: newRecipientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      };
      handleSelectRecipient(newRec);
    }
  };

  const resetAndClose = () => {
    onClose();
    setTimeout(() => {
      setStep(0);
      setAmount('');
      setSelectedRecipient(null);
      setNewRecipientName('');
      setNewRecipientUpi('');
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="payment-overlay-v2 animate-fade-in">
      <div className="payment-modal-v2 glass-pane animate-slide-up">
        <div className="modal-header">
          <div className="header-badge">
            {step === 0 ? 'Select Contact' : (mode === 'request' ? 'Request Funds' : 'Secure Transfer')}
          </div>
          <button className="close-btn" onClick={resetAndClose}><X size={20}/></button>
        </div>

        <div className="modal-body-v2">
          {step === 0 && (
            <div className="payment-step animate-slide-in-right">
              <div className="contact-selection">
                <section className="contact-section">
                  <h5>Recent Contacts</h5>
                  <div className="recents-grid animate-slide-up-stagger">
                    {contactsLoading ? (
                      [1,2,3].map(i => <Skeleton key={i} height={60} borderRadius={8} />)
                    ) : (
                      recentContacts.map((contact, idx) => (
                        <button 
                          key={idx} 
                          className="contact-card-v2 hover-slide-up"
                          onClick={() => handleSelectRecipient(contact)}
                        >
                          <div className="avatar-sm">{contact.initials}</div>
                          <span>{contact.name.split(' ')[0]}</span>
                        </button>
                      ))
                    )}
                  </div>
                </section>

                <section className="contact-section add-new">
                  <h5>Add New Contact</h5>
                  <div className="add-contact-form">
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={newRecipientName}
                      onChange={(e) => setNewRecipientName(e.target.value)}
                    />
                    <input 
                      type="text" 
                      placeholder="UPI ID (e.g. name@bank)" 
                      value={newRecipientUpi}
                      onChange={(e) => setNewRecipientUpi(e.target.value)}
                    />
                    <button 
                      className="secondary-action-btn"
                      disabled={!newRecipientName || !newRecipientUpi}
                      onClick={handleAddNew}
                    >
                      <Send size={18}/> Continue
                    </button>
                  </div>
                </section>
              </div>
            </div>
          )}

          {step === 1 && selectedRecipient && (
            <div className="payment-step animate-scale-in-spring">
              <div className="recipient-v2">
                 <div className="avatar-med">{selectedRecipient.initials}</div>
                 <div className="info">
                    <p className="name">{selectedRecipient.name}</p>
                    <p className="upi">{selectedRecipient.upi}</p>
                 </div>
              </div>

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

              <button 
                className="main-action-btn hover-slide-up"
                disabled={!amount}
                onClick={() => setStep(2)}
              >
                Next Step <ArrowRight size={20}/>
              </button>
            </div>
          )}

          {step === 2 && selectedRecipient && (
            <div className="payment-step animate-slide-in-right">
              <div className="confirmation-card premium-card">
                 <p className="label">{mode === 'request' ? 'Requesting from' : 'Transferring to'} {selectedRecipient.name}</p>
                 <h2 className="confirm-amount">₹ {amount}</h2>
                 <div className="fee-line">
                    <span>Bank Fee:</span>
                    <span>FREE</span>
                 </div>
              </div>

              <div className="security-tag">
                 <ShieldCheck size={16} />
                 <span>IndiaPay Multi-Layer Encryption Active</span>
              </div>

              <button 
                className="main-action-btn confirm hover-scale"
                onClick={handlePay}
                disabled={loading}
              >
                {loading ? (
                  <span className="loader-inline">Processing...</span>
                ) : (
                  <>{mode === 'request' ? 'Request Now' : 'Pay Securely Now'} <Send size={20}/></>
                )}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="payment-step success-view animate-scale-in-spring">
              <div className="success-icon-wrapper">
                 <CheckCircle2 size={64} className="success-icon" />
                 <div className="pulse-ring"></div>
              </div>
              <h2>Transfer Completed</h2>
              <p className="success-meta">₹{amount} successfully sent <br/> Transaction ID: #IP-{Math.random().toString(36).substr(2, 6).toUpperCase()}</p>
              <Button className="main-action-btn hover-scale" onClick={resetAndClose}>Close Receipt</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
