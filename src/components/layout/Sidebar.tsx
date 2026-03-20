import { NavLink, useNavigate } from 'react-router-dom';
import { Home, History, User, Shield, Settings, PieChart, CreditCard } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
    { icon: <History size={20} />, label: 'History', path: '/history' },
    { icon: <PieChart size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <CreditCard size={20} />, label: 'Cards', path: '/cards' },
    { icon: <User size={20} />, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="desktop-sidebar glass-pane">
      <div className="sidebar-header">
        <div className="logo-icon">IP</div>
        <h2 className="brand-logo">India<span>Pay</span></h2>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <p className="group-label">Main Menu</p>
          {menuItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-group secondary">
          <p className="group-label">Settings</p>
          <NavLink to="/security" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Shield size={20} />
            <span>Security</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="user-card" style={{cursor: 'pointer'}} onClick={() => navigate('/profile')}>
          <div className="avatar">AP</div>
          <div className="user-info">
            <p className="user-name">Avinash P.</p>
            <p className="user-status">Verified</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
