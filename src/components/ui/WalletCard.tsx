import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Plus, CreditCard } from 'lucide-react';
import { apiClient } from '../../api/client';
import { Skeleton } from './Skeleton';
import AddMoneyModal from './AddMoneyModal';
import './WalletCard.css';

const WalletCard = () => {
  const [showBalance, setShowBalance] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddMoney, setShowAddMoney] = useState(false);

  useEffect(() => {
    apiClient.getBalance().then(res => {
      setBalance(res);
      setLoading(false);
    });
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate rotation (-10 to 10 degrees)
    const rotateX = ((y / rect.height) - 0.5) * -20;
    const rotateY = ((x / rect.width) - 0.5) * 20;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    
    // Calculate glare position
    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.15
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div className="wallet-card-wrapper animate-slide-up">
      <div 
        ref={cardRef}
        className="wallet-card-v2 wallet-card-3d"
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="card-glare" 
          style={{ 
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,${glare.opacity}) 0%, transparent 60%)` 
          }}
        />
        
        <div className="card-top">
          <div className="brand">
            <CreditCard size={20} className="brand-icon" />
            <span>IndiaPay Digital</span>
          </div>
          <button className="add-money-chip" onClick={(e) => { e.stopPropagation(); setShowAddMoney(true); }}>
            <Plus size={16} />
            <span>Add Money</span>
          </button>
        </div>

        <div className="card-middle">
          <p className="balance-label">Available Balance</p>
          <div className="balance-row">
            <h2 className="balance-amount">
              {showBalance ? (
                loading ? <Skeleton width={180} height={36} /> : `₹ ${balance?.toLocaleString('en-IN')}.00`
              ) : '••••••••'}
            </h2>
            <button 
              className="visibility-toggle" 
              onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }}
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        
        <div className="card-bottom">
          <div className="chip-visual"></div>
          <div className="card-details">
            <p className="card-holder">AVINASH PANDEY</p>
            <p className="card-number">•••• •••• •••• 9921</p>
          </div>
        </div>

        <div className="card-glow"></div>
      </div>
      <AddMoneyModal 
        isOpen={showAddMoney} 
        onClose={() => setShowAddMoney(false)} 
        onBalanceUpdate={(newBalance) => setBalance(newBalance)}
      />
    </div>
  );
};

export default WalletCard;
