import React, { useState } from 'react';
import { Zap, PlaySquare, AlertCircle, ArrowUpRight, ArrowDownRight, Droplet, Wifi, Flame, Plus, Shield, Briefcase } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';
import { apiClient } from '../../api/client';
import './DashboardWidgets.css';
import './DashboardWidgets.css';

export const UpcomingBills = () => {
  const { showToast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBillerName, setNewBillerName] = useState('');
  const [newBillerAmount, setNewBillerAmount] = useState('');
  
  const [bills, setBills] = useState([
    { id: 1, name: 'Electricity Bill', due: 'Due in 2 days', amount: 2450, icon: <Zap size={18}/>, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.15)' },
    { id: 2, name: 'HDFC Credit Card', due: 'Due Jun 15', amount: 12890, icon: <AlertCircle size={18}/>, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' },
    { id: 3, name: 'Airtel Broadband', due: 'Due in 5 days', amount: 1050, icon: <Wifi size={18}/>, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    { id: 4, name: 'Adani Gas', due: 'Due Jun 20', amount: 840, icon: <Flame size={18}/>, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    { id: 5, name: 'Water Supply', due: 'Due Jun 22', amount: 450, icon: <Droplet size={18}/>, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
  ]);

  const [isPaying, setIsPaying] = useState<number | null>(null);

  const handlePay = async (bill: any) => {
    setIsPaying(bill.id);
    try {
      await apiClient.postPayment(bill.name, bill.amount);
      showToast(`Paid ${formatINR(bill.amount)} to ${bill.name} successfully!`, 'success');
    } catch (e) {
      showToast('Payment failed', 'error');
    }
    setIsPaying(null);
  };

  const handleAddBiller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBillerName || !newBillerAmount) return;
    
    const newBill = {
      id: Date.now(),
      name: newBillerName,
      due: 'Recurring',
      amount: Number(newBillerAmount),
      icon: <Zap size={18}/>,
      color: '#8b80fc',
      bg: 'rgba(139, 128, 252, 0.15)'
    };
    
    setBills([...bills, newBill]);
    setNewBillerName('');
    setNewBillerAmount('');
    setShowAddForm(false);
    showToast(`${newBillerName} added to utilities.`, 'success');
  };

  return (
    <section className="premium-card section-card">
      <div className="section-header">
        <h3>Upcoming Bills</h3>
        <button className="text-btn" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add Biller'}
        </button>
      </div>
      
      {showAddForm && (
        <form className="add-biller-form animate-scale-in" onSubmit={handleAddBiller}>
          <input 
            type="text" 
            placeholder="Provider (e.g. Jio)" 
            value={newBillerName} 
            onChange={(e) => setNewBillerName(e.target.value)} 
            required 
          />
          <input 
            type="number" 
            placeholder="Amount (₹)" 
            value={newBillerAmount} 
            onChange={(e) => setNewBillerAmount(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-primary-small"><Plus size={1}/> Add </button>
        </form>
      )}

      <div className="widget-list scroll-hide">
        {bills.map(bill => (
          <div key={bill.id} className="widget-item hover-scale">
            <div className="widget-icon" style={{background: bill.bg, color: bill.color}}>{bill.icon}</div>
            <div className="widget-info">
              <h4>{bill.name}</h4>
              <p className={bill.due.includes('days') ? 'text-danger' : 'text-dim'}>{bill.due}</p>
            </div>
            <div className="widget-actions">
              <div className="widget-amount">{formatINR(bill.amount)}</div>
              <button 
                 className="pay-btn" 
                 onClick={(e) => { e.stopPropagation(); handlePay(bill); }}
                 disabled={isPaying === bill.id}
                 style={{ opacity: isPaying === bill.id ? 0.5 : 1 }}
              >
                 {isPaying === bill.id ? 'Wait...' : 'Pay'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const ActiveLoans = () => {
  return (
    <section className="premium-card section-card">
      <div className="section-header">
        <h3>Active Loans</h3>
        <button className="text-btn">View All</button>
      </div>
      <div className="widget-list">
        <div className="widget-item hover-scale">
          <div className="widget-icon" style={{background: 'rgba(16, 185, 129, 0.15)', color: '#10b981'}}><Shield size={18}/></div>
          <div className="widget-info" style={{paddingRight: '12px'}}>
            <h4>Home Loan (HDFC)</h4>
            <div className="progress-bg" style={{marginTop: '6px', height: '4px', background: 'rgba(255,255,255,0.05)'}}>
              <div className="progress-fill" style={{width: '65%', background: '#10b981', height: '100%', borderRadius: '4px'}}></div>
            </div>
          </div>
          <div className="widget-actions">
            <div className="widget-amount" style={{fontSize: '0.8rem', color: '#10b981'}}>65%</div>
          </div>
        </div>
        <div className="widget-item hover-scale">
          <div className="widget-icon" style={{background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444'}}><Briefcase size={18}/></div>
          <div className="widget-info" style={{paddingRight: '12px'}}>
            <h4>Car Finance</h4>
            <div className="progress-bg" style={{marginTop: '6px', height: '4px', background: 'rgba(255,255,255,0.05)'}}>
              <div className="progress-fill" style={{width: '24%', background: '#ef4444', height: '100%', borderRadius: '4px'}}></div>
            </div>
          </div>
          <div className="widget-actions">
            <div className="widget-amount" style={{fontSize: '0.8rem', color: '#ef4444'}}>24%</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const CreditScore = () => {
  return (
    <section className="premium-card section-card score-card hover-scale">
      <div className="score-header">
        <div>
          <h3>Credit Score</h3>
          <p>Equifax & CIBIL</p>
        </div>
        <span className="badge-success">Excellent</span>
      </div>
      <div className="score-ring-container">
        <svg viewBox="0 0 36 36" className="score-ring">
          <path className="ring-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className="ring-fill" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
        </svg>
        <div className="score-value">
          <h2>785</h2>
          <p>+12 this month</p>
        </div>
      </div>
    </section>
  );
};

export const Subscriptions = () => {
  const { showToast } = useToast();
  return (
    <section className="premium-card section-card">
      <div className="section-header">
        <h3>Active Subs</h3>
        <button className="text-btn" onClick={() => showToast('Managing mandates...', 'info')}>Manage</button>
      </div>
      <div className="widget-list">
        <div className="widget-item hover-scale">
          <div className="widget-icon" style={{background: 'rgba(229, 9, 20, 0.15)', color: '#e50914'}}><PlaySquare size={18}/></div>
          <div className="widget-info">
            <h4>Netflix Premium</h4>
            <p className="text-dim">Auto-pay on 12th</p>
          </div>
          <div className="widget-amount">₹649</div>
        </div>
        <div className="widget-item hover-scale">
          <div className="widget-icon" style={{background: 'rgba(30, 215, 96, 0.15)', color: '#1ed760'}}><PlaySquare size={18}/></div>
          <div className="widget-info">
            <h4>Spotify Family</h4>
            <p className="text-dim">Auto-pay on 28th</p>
          </div>
          <div className="widget-amount">₹179</div>
        </div>
      </div>
    </section>
  );
};

export const MarketOverview = () => {
  return (
    <section className="premium-card section-card">
      <div className="section-header">
        <h3>Market Overview</h3>
        <button className="text-btn">Invest</button>
      </div>
      <div className="widget-list market-grid">
        <div className="market-item hover-scale">
           <div className="market-head">
             <span className="m-title">NIFTY 50</span>
             <span className="text-success"><ArrowUpRight size={14}/> 1.2%</span>
           </div>
           <h2>22,450.00</h2>
        </div>
        <div className="market-item hover-scale">
           <div className="market-head">
             <span className="m-title">Digital Gold</span>
             <span className="text-danger"><ArrowDownRight size={14}/> 0.4%</span>
           </div>
           <h2>₹7,120 /g</h2>
        </div>
      </div>
    </section>
  );
};
