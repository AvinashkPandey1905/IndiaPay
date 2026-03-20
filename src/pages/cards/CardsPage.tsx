import { useState, useEffect, useRef } from 'react';
import { Copy, Shield, Lock, Plus, CheckCircle2, Edit3, Smartphone, X, Unlock } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { apiClient } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import './CardsPage.css';

const CardsPage = () => {
  const [cardData, setCardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newLimit, setNewLimit] = useState('');
  const [isUpdatingLimit, setIsUpdatingLimit] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const { showToast } = useToast();

  useEffect(() => {
    apiClient.getCardData().then((data) => {
      setCardData(data);
      setLoading(false);
    });
  }, []);

  const handleCopy = () => {
    if (cardData) {
      navigator.clipboard.writeText(cardData.virtual.number);
      showToast('Card number securely copied', 'success');
    }
  };

  const handleToggle = (key: string) => {
    if (!cardData) return;
    const newSettings = { ...cardData.settings, [key]: !cardData.settings[key] };
    
    // Optimistic update
    setCardData({ ...cardData, settings: newSettings });
    
    apiClient.updateCardSettings(newSettings).then(() => {
       showToast(`Security preference updated`, 'success');
    }).catch(() => {
       // Revert on failure
       setCardData({ ...cardData });
       showToast(`Failed to update preference`, 'error');
    });
  };

  const handleLock = () => {
    const nextState = !isLocked;
    setIsLocked(nextState);
    showToast(nextState ? 'Card temporarily locked' : 'Card unlocked', nextState ? 'info' : 'success');
  };

  const handleUpdateLimit = () => {
    if (!newLimit) return;
    setIsUpdatingLimit(true);
    apiClient.updateCardSettings({ monthlyLimit: parseInt(newLimit) }).then(() => {
      setIsUpdatingLimit(false);
      setShowLimitModal(false);
      setCardData({ ...cardData, settings: { ...cardData.settings, monthlyLimit: parseInt(newLimit) } });
      setNewLimit('');
      showToast(`Monthly limit successfully updated to ₹${parseInt(newLimit).toLocaleString('en-IN')}`, 'success');
    });
  };

  const handleNewCard = () => {
    showToast('Checking eligibility for Physical Card...', 'info');
    setTimeout(() => {
      showToast('You are eligible! Redirecting to KYC...', 'success');
    }, 1500);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isLocked) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-15 to 15 degrees)
    const rotateX = ((y / rect.height) - 0.5) * -15;
    const rotateY = ((x / rect.width) - 0.5) * 15;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    
    // Glare
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setTransform('');
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="cards-page animate-fade-in">
      <div className="cards-header">
        <h2>Card Management</h2>
      </div>

      <div className="cards-layout">
        <section className="virtual-card-section animate-slide-up-stagger">
          <div 
            ref={cardRef}
            className={`flip-card-container ${isLocked ? 'grayscale' : ''} ${isFlipped ? 'flipped' : ''}`}
            style={{ transform }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {loading ? (
              <Skeleton width="100%" height={200} borderRadius={20} />
            ) : (
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <div 
                    className="card-glare" 
                    style={{ 
                      background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, transparent 60%)` 
                    }}
                  />
                  <div className="card-logo">IndiaPay</div>
                  <div className="card-chip"></div>
                  <div className="card-number-large">{cardData?.virtual.number}</div>
                  <div className="card-footer">
                    <div>
                      <p>Card Holder</p>
                      <p className="card-val">{cardData?.virtual.holder}</p>
                    </div>
                    <div>
                      <p>Expires</p>
                      <p className="card-val">{cardData?.virtual.exp}</p>
                    </div>
                    <div>
                      <p>CVV</p>
                      <p className="card-val">•••</p>
                    </div>
                  </div>
                  {isLocked && (
                    <div className="card-locked-overlay">
                      <Lock size={32} />
                      <span>LOCKED</span>
                    </div>
                  )}
                </div>
                
                <div className="flip-card-back">
                   <div 
                    className="card-glare" 
                    style={{ 
                      background: `radial-gradient(circle at ${100 - glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, transparent 60%)` 
                    }}
                  />
                   <div className="magnetic-strip"></div>
                   <div className="cvv-strip">CVV {cardData?.virtual.cvv}</div>
                </div>
              </div>
            )}
          </div>

          <div className="card-actions-v2">
            <button className="action-btn" onClick={handleCopy} disabled={loading || isLocked || isFlipped}>
              <div className="action-circle"><Copy size={20} /></div>
              <span>Copy Num</span>
            </button>
            <button className="action-btn" onClick={() => setIsFlipped(!isFlipped)} disabled={loading || isLocked}>
              <div className="action-circle"><Shield size={20} /></div>
              <span>{isFlipped ? 'Hide CVV' : 'Show CVV'}</span>
            </button>
            <button className={`action-btn ${isLocked ? 'text-danger' : ''}`} onClick={handleLock} disabled={loading}>
              <div className="action-circle">{isLocked ? <Unlock size={20} /> : <Lock size={20} />}</div>
              <span>{isLocked ? 'Unlock Card' : 'Lock Card'}</span>
            </button>
            <button className="action-btn" onClick={handleNewCard} disabled={loading}>
              <div className="action-circle"><Plus size={20} /></div>
              <span>New Card</span>
            </button>
          </div>
        </section>

        <section className="card-settings-section animate-slide-up-stagger" style={{ animationDelay: '0.1s' }}>
          <div className="card-preferences premium-card">
            <h3>Card Preferences</h3>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[1,2,3].map(i => <Skeleton key={i} height={60} />)}
              </div>
            ) : (
              <div className="pref-list">
                <div className="pref-item" onClick={() => handleToggle('onlineTransactions')} style={{cursor: 'pointer'}}>
                  <div className="pref-info">
                    <p>Online Transactions <Smartphone size={14} style={{marginLeft: 6, opacity: 0.6}} /></p>
                    <span>Enable for e-commerce purchases</span>
                  </div>
                  <div className={`toggle-switch ${cardData?.settings.onlineTransactions ? 'active' : ''}`}></div>
                </div>

                <div className="pref-item" onClick={() => handleToggle('fraudProtection')} style={{cursor: 'pointer'}}>
                  <div className="pref-info">
                    <p>Smart Fraud Protection <Shield size={14} style={{marginLeft: 6, opacity: 0.6}} /></p>
                    <span>Auto-block suspicious activity</span>
                  </div>
                  <div className={`toggle-switch ${cardData?.settings.fraudProtection ? 'active' : ''}`}></div>
                </div>

                <div className="pref-item" onClick={() => setShowLimitModal(true)} style={{cursor: 'pointer'}}>
                  <div className="pref-info">
                    <p>Monthly Limit</p>
                    <span>₹{cardData?.settings.monthlyLimit.toLocaleString('en-IN')} / month</span>
                  </div>
                  <Edit3 size={18} className="edit-icon" />
                </div>
              </div>
            )}
          </div>
          
          <div className="security-notice">
            <CheckCircle2 size={16} />
            <p>Your card is protected by IndiaPay Shield</p>
          </div>
        </section>
      </div>

      {showLimitModal && (
        <div className="payment-overlay-v2 animate-fade-in" style={{zIndex: 9999}}>
          <div className="payment-modal-v2 glass-pane animate-slide-up">
            <div className="modal-header">
              <div className="header-badge">Edit Monthly Limit</div>
              <button className="close-btn" onClick={() => setShowLimitModal(false)}><X size={20}/></button>
            </div>
            <div className="modal-body-v2 animate-slide-in-right">
              <div className="amount-input-v2">
                <span className="unit">₹</span>
                <input 
                  type="number" 
                  placeholder={cardData?.settings.monthlyLimit.toString()} 
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                  autoFocus
                />
              </div>
              <p style={{fontSize: '0.85rem', color: 'var(--text-dim)', textAlign: 'center', marginBottom: 24}}>
                Set your maximum monthly spending limit for this card.
              </p>
              <Button 
                className="main-action-btn hover-scale" 
                disabled={!newLimit || isUpdatingLimit} 
                onClick={handleUpdateLimit}
                fullWidth
              >
                {isUpdatingLimit ? 'Securing Limit...' : 'Update Limit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardsPage;
