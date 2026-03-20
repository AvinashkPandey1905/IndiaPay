import { useState } from 'react';
import { Shield, Smartphone, Key, Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/ui/Button';

const SecurityPage = () => {
  const { showToast } = useToast();
  const [toggles, setToggles] = useState({
    twoFa: true,
    biometric: false,
    appLock: true,
    blockIntl: true
  });

  const handleToggle = (key: keyof typeof toggles) => {
    const next = !toggles[key];
    setToggles((prev: typeof toggles) => ({ ...prev, [key]: next }));
    showToast(`${String(key)} security preference updated securely.`, 'success');
  };

  return (
    <div className="animate-fade-in" style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
      <div className="page-header">
        <h2>Security Center</h2>
      </div>

      <div className="grid-responsive">
        <section className="premium-card animate-slide-up">
          <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'}}>
            <div style={{padding: '12px', background: 'var(--surface-hover)', borderRadius: '12px'}}>
              <Shield size={24} style={{color: 'var(--accent)'}} />
            </div>
            <div>
              <h3 style={{fontSize: '1.2rem', marginBottom: '4px'}}>Application Security</h3>
              <p style={{color: 'var(--text-dim)', fontSize: '0.85rem'}}>Manage access and authentication methods.</p>
            </div>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <Key size={18} style={{color: 'var(--text-muted)'}} />
                <div>
                  <p style={{fontWeight: 600, fontSize: '0.9rem'}}>Two-Factor Authentication</p>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>Requires SMS code on login.</p>
                </div>
              </div>
              <div className={`toggle-switch ${toggles.twoFa ? 'active' : ''}`} onClick={() => handleToggle('twoFa')}></div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <Fingerprint size={18} style={{color: 'var(--text-muted)'}} />
                <div>
                  <p style={{fontWeight: 600, fontSize: '0.9rem'}}>Biometric Unlock</p>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>Use FaceID or Fingerprint.</p>
                </div>
              </div>
              <div className={`toggle-switch ${toggles.biometric ? 'active' : ''}`} onClick={() => handleToggle('biometric')}></div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                <Lock size={18} style={{color: 'var(--text-muted)'}} />
                <div>
                  <p style={{fontWeight: 600, fontSize: '0.9rem'}}>Background App Lock</p>
                  <p style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>Lock app immediately when minimized.</p>
                </div>
              </div>
              <div className={`toggle-switch ${toggles.appLock ? 'active' : ''}`} onClick={() => handleToggle('appLock')}></div>
            </div>
          </div>
        </section>

        <section className="animate-slide-up-stagger" style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
          <div className="premium-card">
            <h3 style={{marginBottom: '16px', fontSize: '1.2rem'}}>Active Sessions</h3>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-primary)'}}>
              <Smartphone size={24} style={{color: 'var(--success)'}} />
              <div style={{flex: 1}}>
                <p style={{fontWeight: 600, fontSize: '0.9rem'}}>iPhone 14 Pro Max</p>
                <p style={{fontSize: '0.75rem', color: 'var(--text-dim)'}}>Gurugram, IN • Currently Active</p>
              </div>
              <div style={{fontSize: '0.75rem', padding: '4px 8px', background: 'var(--surface-hover)', borderRadius: '8px', border: '1px solid var(--border)'}}>This Device</div>
            </div>
            
            <Button variant="secondary" fullWidth style={{marginTop: '16px', border: '1px solid var(--danger)', color: 'var(--danger)'}} onClick={() => showToast('All unused sessions terminated.', 'success')}>
              Log Out All Other Devices
            </Button>
          </div>

          <div className="premium-card" style={{display: 'flex', gap: '16px', alignItems: 'center', borderColor: 'var(--accent)'}}>
            <ShieldCheck size={32} style={{color: 'var(--accent)'}} />
            <div>
              <h4 style={{fontSize: '1rem', marginBottom: '4px'}}>IndiaPay Secure</h4>
              <p style={{fontSize: '0.8rem', color: 'var(--text-dim)'}}>Your account is protected by military-grade 256-bit encryption routing.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SecurityPage;
