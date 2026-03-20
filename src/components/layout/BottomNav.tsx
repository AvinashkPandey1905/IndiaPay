import { NavLink } from 'react-router-dom';
import { Home, History, ScanLine, User, PieChart, CreditCard } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <History size={24} />
        <span>History</span>
      </NavLink>
      <button className="nav-link scan-fab" onClick={() => alert('Scanner coming soon!')}>
        <div className="scan-icon-container">
          <ScanLine size={32} color="white" />
        </div>
        <span>Scan</span>
      </button>

      <NavLink to="/cards" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <CreditCard size={24} />
        <span>Cards</span>
      </NavLink>

      <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <PieChart size={24} />
        <span>Insights</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
