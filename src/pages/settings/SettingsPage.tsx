
import { Bell, Moon, Languages, ChevronRight, Globe } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

const SettingsPage = () => {
  const { showToast } = useToast();
  
  return (
    <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
      <div className="page-header">
        <h2>App Settings</h2>
      </div>

      <div className="grid-responsive">
        <section className="premium-card animate-slide-up">
          <h3 style={{marginBottom: '24px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <Bell size={20} style={{color: 'var(--accent)'}} /> Notifications
          </h3>

          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}} onClick={() => showToast('Push notification preferences saved.', 'success')}>
              <div>
                <p style={{fontWeight: 600, fontSize: '0.9rem'}}>Push Notifications</p>
                <p style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>Transaction alerts down to the second.</p>
              </div>
              <div className="toggle-switch active"></div>
            </div>

            <div style={{height: '1px', background: 'var(--border)'}}></div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}} onClick={() => showToast('Email preferences updated.', 'success')}>
              <div>
                <p style={{fontWeight: 600, fontSize: '0.9rem'}}>Email Receipts</p>
                <p style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>Send weekly summary to avinash@okaxis.</p>
              </div>
              <div className="toggle-switch active"></div>
            </div>

            <div style={{height: '1px', background: 'var(--border)'}}></div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'}} onClick={() => showToast('Marketing promos toggled off.', 'info')}>
              <div>
                <p style={{fontWeight: 600, fontSize: '0.9rem'}}>Marketing Offers</p>
                <p style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>Receive cashback and promo drops.</p>
              </div>
              <div className="toggle-switch"></div>
            </div>
          </div>
        </section>

        <section className="animate-slide-up-stagger" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div className="premium-card">
             <h3 style={{marginBottom: '24px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <Globe size={20} style={{color: 'var(--accent)'}} /> General
            </h3>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer'}} onClick={() => showToast('Dark mode is structurally bound in this version!', 'info')}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <Moon size={18} style={{color: 'var(--text-muted)'}} />
                        <span style={{fontWeight: 500, fontSize: '0.9rem'}}>App Theme</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '0.8rem', color: 'var(--text-dim)'}}>Dark (OLED)</span>
                        <ChevronRight size={16} style={{color: 'var(--text-muted)'}} />
                    </div>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border)', cursor: 'pointer'}} onClick={() => showToast('Language selection opened!', 'info')}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                        <Languages size={18} style={{color: 'var(--text-muted)'}} />
                        <span style={{fontWeight: 500, fontSize: '0.9rem'}}>Language</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontSize: '0.8rem', color: 'var(--text-dim)'}}>English (IN)</span>
                        <ChevronRight size={16} style={{color: 'var(--text-muted)'}} />
                    </div>
                </div>
            </div>
          </div>
          
          <Button variant="secondary" fullWidth onClick={() => showToast('Downloading app diagnostic logs...', 'info')}>
             Download Action Logs
          </Button>
        </section>
      </div>
    </div>
  );
};

export default SettingsPage;
