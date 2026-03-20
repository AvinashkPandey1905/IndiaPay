import { useState, useEffect } from 'react';
import WalletCard from '../../components/ui/WalletCard';
import WalletFeatures from '../../features/wallet/WalletFeatures';
import { UpcomingBills, CreditScore, Subscriptions, MarketOverview, ActiveLoans } from '../../features/dashboard/DashboardWidgets';
import PaymentModal from '../../features/payments/PaymentModal';
import { Skeleton } from '../../components/ui/Skeleton';
import { Send, ArrowDownLeft, Zap, ShieldCheck, ChevronRight } from 'lucide-react';
import { apiClient } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import './HomePage.css';

const HomePage = () => {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'send' | 'request'>('send');
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  
  const [contacts, setContacts] = useState<any[]>([]);
  const [insight, setInsight] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    Promise.all([
      apiClient.getRecentContacts(),
      apiClient.getAnalytics()
    ]).then(([contactsData, analyticsData]) => {
      setContacts(contactsData);
      setInsight(analyticsData);
      setLoading(false);
    });
  }, []);

  const handlePersonClick = (name: string, upi: string, initials: string) => {
    setSelectedRecipient({ name, upi, initials });
    setPaymentMode('send');
    setIsPaymentOpen(true);
  };

  const handleClaim = () => {
    showToast('Processing your ₹50 cashback...', 'info');
    setTimeout(() => {
       apiClient.addMoney(50).then(() => {
          showToast('₹50 Cashback credited to your wallet!', 'success');
       });
    }, 1500);
  };

  return (
    <div className="home-dashboard animate-fade-in">
      <div className="dashboard-top animate-slide-up-stagger">
        <WalletCard />
        
        <div className="quick-actions-grid animate-slide-up-stagger">
          <div className="action-card-v2 hover-slide-up" onClick={() => {
            setSelectedRecipient(null);
            setPaymentMode('send');
            setIsPaymentOpen(true);
          }}>
            <div className="icon-box purple">
              <Send size={24} />
            </div>
            <div className="action-info">
              <h4>Send Money</h4>
              <p>Safe & Secure</p>
            </div>
            <ChevronRight size={20} className="arrow" />
          </div>

          <div className="action-card-v2 hover-slide-up" onClick={() => {
            setSelectedRecipient(null);
            setPaymentMode('request');
            setIsPaymentOpen(true);
          }}>
            <div className="icon-box orange">
              <ArrowDownLeft size={24} />
            </div>
            <div className="action-info">
              <h4>Request</h4>
              <p>From Contacts</p>
            </div>
            <ChevronRight size={20} className="arrow" />
          </div>

          <div className="action-card-v2 hover-slide-up" onClick={() => showToast('IndiaPay Assured Cover protects all your transactions automatically.', 'success')}>
            <div className="icon-box green">
              <ShieldCheck size={24} />
            </div>
            <div className="action-info">
              <h4>Assured</h4>
              <p>Verified Pay</p>
            </div>
            <ChevronRight size={20} className="arrow" />
          </div>

          <div className="action-card-v2 hover-slide-up" onClick={() => {
            showToast('Fetching pending bills...', 'info');
            setTimeout(() => showToast('No pending utility bills found for this month.', 'success'), 1200);
          }}>
            <div className="icon-box blue">
              <Zap size={24} />
            </div>
            <div className="action-info">
              <h4>Utilities</h4>
              <p>Pay Bills</p>
            </div>
            <ChevronRight size={20} className="arrow" />
          </div>
        </div>
      </div>

      <div className="dashboard-content grid-responsive animate-slide-up-stagger">
        <section className="premium-card section-card">
          <div className="section-header">
            <h3>Recent People</h3>
            <button className="text-btn" onClick={() => showToast('Syncing your phonebook contacts...', 'info')}>View Contacts</button>
          </div>
          <div className="people-row">
            {loading ? (
               [1,2,3,4,5].map(i => <Skeleton key={i} width={56} height={56} borderRadius="50%" />)
            ) : (
              contacts.map((person, i) => (
                <div key={i} className="person-chip hover-scale" onClick={() => handlePersonClick(person.name, person.upi, person.initials)}>
                  <div className="avatar-v2">{person.initials}</div>
                  <span>{person.name.split(' ')[0]}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="premium-card section-card highlights hover-slide-up">
          <div className="section-header">
            <h3>Reward Hub</h3>
          </div>
          <div className="offer-banner reward-gradient">
            <div className="banner-text">
              <h4>Cashback Bonanza</h4>
              <p>Flat ₹50 on all UPI transfers today!</p>
            </div>
            <button className="banner-btn hover-scale" onClick={handleClaim}>Claim Now</button>
          </div>
        </section>

        <section className="premium-card section-card">
          <div className="section-header">
            <h3>Monthly Insights</h3>
          </div>
          {loading ? (
             <div className="stats-placeholder">
               {[1,2,3,4,5].map((i) => <Skeleton key={i} height={i * 10 + 30} width="100%" borderRadius="4px 4px 0 0" />)}
             </div>
          ) : (
            <>
              <div className="stats-placeholder">
                 <div className="chart-bar hover-scale" style={{height: '60%'}}></div>
                 <div className="chart-bar hover-scale" style={{height: '80%'}}></div>
                 <div className="chart-bar hover-scale" style={{height: '40%'}}></div>
                 <div className="chart-bar hover-scale" style={{height: '90%'}}></div>
                 <div className="chart-bar hover-scale" style={{height: '50%'}}></div>
              </div>
              <p className="insight-text">You've saved <strong>₹{insight ? (insight.totalInflow - insight.totalOutflow).toLocaleString('en-IN') : '1240'}</strong> this month!</p>
            </>
          )}
        </section>

        <UpcomingBills />
        <Subscriptions />
        <ActiveLoans />
        <CreditScore />
        <MarketOverview />

        <WalletFeatures />
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        initialRecipient={selectedRecipient}
        mode={paymentMode}
      />
    </div>
  );
};

export default HomePage;
