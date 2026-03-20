import React, { useState, useEffect } from 'react';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`layout-root ${isMobile ? 'is-mobile' : 'is-desktop'}`}>
      {!isMobile && <Sidebar />}
      
      <div className="main-wrapper">
        <header className="main-header glass-pane">
          <div className="header-left">
            <h1 className="brand-logo">India<span>Pay</span></h1>
          </div>
          <div className="header-right">
            <div className="profile-indicator">
              <span className="reward-points">₹ 248 <small>Rewards</small></span>
              <div className="avatar-chip">AP</div>
            </div>
          </div>
        </header>

        <main className="content-container">
          {children}
        </main>
      </div>

      {isMobile && <BottomNav />}
    </div>
  );
};

export default Layout;
