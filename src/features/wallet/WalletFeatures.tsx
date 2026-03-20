import { Landmark, RefreshCw, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import './WalletFeatures.css';

const WalletFeatures = () => {
  const { showToast } = useToast();

  return (
    <section className="premium-card animate-slide-up-stagger section-card">
      <div className="section-header">
        <h3>Wallet Features</h3>
      </div>
      <div className="wallet-features-list">
        <div className="feature-item hover-scale" onClick={() => showToast('Opening Bank Details...', 'info')}>
          <div className="feature-icon" style={{background: 'rgba(94, 80, 250, 0.15)', color: 'var(--accent)'}}>
            <Landmark size={20} />
          </div>
          <div className="feature-text">
            <h4>Linked Banks</h4>
            <p>HDFC & SBI Connected</p>
          </div>
          <ChevronRight size={18} className="arrow" />
        </div>

        <div className="feature-item hover-scale" onClick={() => showToast('Auto-top up config opened.', 'info')}>
          <div className="feature-icon" style={{background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)'}}>
            <RefreshCw size={20} />
          </div>
          <div className="feature-text">
            <h4>Auto Top-up</h4>
            <p>Refill below ₹500</p>
          </div>
          <ChevronRight size={18} className="arrow" />
        </div>

        <div className="feature-item hover-scale" onClick={() => showToast('Select friends to split bills.', 'info')}>
          <div className="feature-icon" style={{background: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)'}}>
            <Users size={20} />
          </div>
          <div className="feature-text">
            <h4>Split Bills</h4>
            <p>Divide expenses</p>
          </div>
          <ChevronRight size={18} className="arrow" />
        </div>

        <div className="feature-item hover-scale" onClick={() => showToast('Fetching wealth portfolio...', 'info')}>
          <div className="feature-icon" style={{background: 'rgba(248, 49, 47, 0.15)', color: 'var(--danger)'}}>
            <TrendingUp size={20} />
          </div>
          <div className="feature-text">
            <h4>Wealth</h4>
            <p>Gold & Funds</p>
          </div>
          <ChevronRight size={18} className="arrow" />
        </div>
      </div>
    </section>
  );
};

export default WalletFeatures;
