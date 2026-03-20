import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import HistoryPage from './pages/history/HistoryPage';
import ProfilePage from './pages/profile/ProfilePage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import CardsPage from './pages/cards/CardsPage';
import SecurityPage from './pages/security/SecurityPage';
import SettingsPage from './pages/settings/SettingsPage';
import './index.css';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/cards" element={<CardsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
