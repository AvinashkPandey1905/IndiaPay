import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Smartphone, CreditCard, ChevronRight, Settings, LogOut, Copy, Share2 } from 'lucide-react';
import { maskPhone } from '../../utils/formatters';
import { apiClient } from '../../api/client';
import { Skeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.getUserProfile().then((res) => {
      setUser(res);
      setLoading(false);
    });
  }, []);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} copied to clipboard`, 'success');
  };

  const handleLogout = () => {
    showToast('Securely ending your session...', 'info');
    setTimeout(() => {
      setIsLoggedOut(true);
      showToast('You have been logged out successfully.', 'success');
    }, 1500);
  };

  if (isLoggedOut) {
    return (
      <div className="profile-v2 animate-fade-in" style={{alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh'}}>
         <Shield size={64} style={{color: 'var(--success)', marginBottom: 24}} />
         <h2>Session Ended</h2>
         <p style={{color: 'var(--text-dim)', marginBottom: 32}}>Your IndiaPay account has been securely logged out.</p>
         <Button onClick={() => window.location.reload()}>Log Back In</Button>
      </div>
    );
  }

  return (
    <div className="profile-v2 animate-fade-in">
      <div className="profile-hero animate-slide-up">
        {loading ? (
           <Skeleton width={80} height={80} borderRadius="50%" className="avatar-large" />
        ) : (
          <div className="avatar-large">
            <span>{user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}</span>
          </div>
        )}
        
        <div className="user-meta">
          {loading ? (
             <Skeleton width={150} height={28} style={{ marginBottom: 8 }} />
          ) : (
             <h2>{user.name}</h2>
          )}

          {loading ? (
             <Skeleton width={200} height={24} style={{ marginBottom: 8 }} />
          ) : (
             <div className="upi-badge" onClick={() => handleCopy(user.upiId, 'UPI ID')} style={{cursor: 'pointer'}}>
               <span>{user.upiId}</span>
               <button className="copy-btn"><Copy size={14}/></button>
             </div>
          )}

          {loading ? (
             <Skeleton width={120} height={20} />
          ) : (
            <span className="kyc-indicator verified">
              <Shield size={14} /> {user.kycStatus} Account
            </span>
          )}
        </div>
      </div>

      <div className="profile-actions grid-responsive animate-slide-up-stagger">
        <div className="premium-card qr-card hover-scale">
          <div className="qr-container">
            <div className="qr-box-inner">
               <div className="qr-logo">IP</div>
               {/* QR Pattern visual */}
               <div className="qr-pattern"></div>
            </div>
          </div>
          <p className="qr-label">Your Personal QR Code</p>
          <div className="qr-actions">
            <button className="icon-btn-text" onClick={() => showToast('Initializing sharing options...', 'info')}><Share2 size={18}/> Share</button>
            <button className="icon-btn-text" onClick={() => handleCopy(user.upiId, 'QR Link')}><Copy size={18}/> Copy</button>
          </div>
        </div>

        <div className="settings-stack animate-slide-up-stagger">
          {[
            { icon: <Smartphone />, label: 'Linked Number', value: loading ? 'Loading...' : maskPhone(user.phone) },
            { icon: <CreditCard />, label: 'Bank Accounts', value: '2 Linked' },
            { icon: <Shield />, label: 'Privacy & Security', value: 'Enabled' },
            { icon: <Settings />, label: 'App Preferences', value: 'EN (IN)' },
          ].map((item, i) => (
            <div 
              key={i} 
              className="settings-card premium-card hover-slide-up"
              style={{cursor: 'pointer'}}
              onClick={() => {
                if (item.label === 'Privacy & Security') navigate('/security');
                else if (item.label === 'App Preferences') navigate('/settings');
                else showToast(`Opening ${item.label} settings...`, 'info');
              }}
            >
              <div className="item-icon">{item.icon}</div>
              <div className="item-content">
                <p className="item-label">{item.label}</p>
                <p className="item-value">{item.value}</p>
              </div>
              <ChevronRight size={18} className="chevron" />
            </div>
          ))}
        </div>
      </div>

      <button className="danger-btn logout animate-slide-up" onClick={handleLogout}>
        <LogOut size={20} />
        <span>Logout Session</span>
      </button>
    </div>
  );
};

export default ProfilePage;
