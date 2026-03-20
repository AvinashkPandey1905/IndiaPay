import { useState, useEffect, useMemo } from 'react';
import { formatINR, formatDate } from '../../utils/formatters';
import type { Transaction } from '../../types';
import { Search, Download, BarChart2, Calendar, Coffee, Home, Zap } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';
import { apiClient } from '../../api/client';
import TransactionDetailsModal from '../../features/transactions/TransactionDetailsModal';
import './HistoryPage.css';

// Helper to determine icon based on category/type
const getCategoryIcon = (category: string, type: string) => {
  if (type === 'Bill' || category === 'Utilities') return <Zap size={18} />;
  if (category === 'Food & Drinks') return <Coffee size={18} />;
  if (category === 'Rent' || category === 'Housing') return <Home size={18} />;
  return <span>{category.charAt(0)}</span>;
};

const HistoryPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  useEffect(() => {
    apiClient.getTransactions().then((data) => {
      setTransactions(data);
      setLoading(false);
    });
  }, []);

  const totalSpent = transactions
    .filter(t => t.type === 'Send' || t.type === 'Bill')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalReceived = transactions
    .filter(t => t.type === 'Receive')
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTxns = useMemo(() => {
    return transactions.filter(t => {
      const matchesFilter = filter === 'All' || t.type === filter;
      const matchesSearch = t.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            t.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [transactions, filter, searchQuery]);

  // Group by date (For real app, use a proper date library like date-fns, mocking for now)
  const groupedTxns = useMemo(() => {
    const groups: { [key: string]: Transaction[] } = {};
    filteredTxns.forEach(txn => {
      // Very naive date grouping
      const dateObj = new Date(txn.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey = formatDate(txn.date).split(',')[0]; // Gets just the date part broadly
      if (dateObj.toDateString() === today.toDateString()) groupKey = 'Today';
      else if (dateObj.toDateString() === yesterday.toDateString()) groupKey = 'Yesterday';

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(txn);
    });
    return groups;
  }, [filteredTxns]);

  return (
    <div className="history-page-v3 animate-fade-in">
      <div className="hp-header-glass animate-slide-up-stagger">
        <div className="hp-header-top">
          <h2>All Transactions</h2>
          <button className="icon-btn-blur"><Download size={20}/></button>
        </div>

        <div className="hp-search-container">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search merchants, people, or categories..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="hp-summary-cards">
          <div className="hp-stat-card spend-gradient">
            <p>Spent this month</p>
            {loading ? <Skeleton width={120} height={28} style={{marginTop: 4}}/> : <h3>{formatINR(totalSpent)}</h3>}
            <div className="stat-deco"><BarChart2 size={40} /></div>
          </div>
          <div className="hp-stat-card receive-gradient">
            <p>Received this month</p>
            {loading ? <Skeleton width={120} height={28} style={{marginTop: 4}}/> : <h3>{formatINR(totalReceived)}</h3>}
            <div className="stat-deco"><Calendar size={40} /></div>
          </div>
        </div>

        <div className="hp-filter-scroll">
          {['All', 'Send', 'Receive', 'Bill'].map((f) => (
            <button 
              key={f} 
              className={`hp-chip ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="hp-body animate-slide-up-stagger" style={{ animationDelay: '0.1s' }}>
        {loading ? (
          <div className="hp-loading-wrapper">
             {[1,2,3,4,5].map(i => <Skeleton key={i} height={70} borderRadius={16} style={{marginBottom: 12}} />)}
          </div>
        ) : filteredTxns.length === 0 ? (
          <div className="hp-empty-state">
             <div className="empty-icon">🔍</div>
             <h4>No transactions found</h4>
             <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          Object.keys(groupedTxns).map((dateKey) => (
            <div key={dateKey} className="txn-group">
              <div className="txn-date-header">
                <span>{dateKey}</span>
                <div className="line"></div>
              </div>
              <div className="txn-list">
                {groupedTxns[dateKey].map((txn) => (
                  <div 
                    key={txn.id} 
                    className="txn-row-v3 hover-scale"
                    onClick={() => setSelectedTxn(txn)}
                  >
                    <div className="txn-row-left">
                      <div className={`txn-brand-avatar ${txn.type.toLowerCase()}`}>
                        {getCategoryIcon(txn.category, txn.type)}
                      </div>
                      <div className="txn-info-stack">
                        <p className="txn-title">{txn.recipientName}</p>
                        <p className="txn-subtitle">{txn.category} • {formatDate(txn.date).split(',')[1] || '12:00 PM'}</p>
                      </div>
                    </div>
                    <div className="txn-row-right">
                      <p className={`txn-price ${txn.type === 'Receive' ? 'positive' : ''}`}>
                        {txn.type === 'Receive' ? '+' : '-'}{formatINR(txn.amount)}
                      </p>
                      <span className={`txn-status-dot ${txn.status.toLowerCase()}`}>
                        {txn.status !== 'Success' && txn.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <TransactionDetailsModal 
        isOpen={selectedTxn !== null} 
        onClose={() => setSelectedTxn(null)} 
        transaction={selectedTxn} 
      />
    </div>
  );
};

export default HistoryPage;
