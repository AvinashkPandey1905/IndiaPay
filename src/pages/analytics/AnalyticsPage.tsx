import { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownLeft, Target } from 'lucide-react';
import { formatINR } from '../../utils/formatters';
import { apiClient } from '../../api/client';
import { Skeleton } from '../../components/ui/Skeleton';
import './AnalyticsPage.css';

const AnalyticsPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.getAnalytics().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  return (
    <div className="analytics-page animate-fade-in">
      <div className="analytics-header">
        <h2>Financial Insights</h2>
        <div className="period-selector">
          <button className="pill active">Current Month</button>
          <button className="pill">Last 3 Months</button>
        </div>
      </div>

      <div className="analytics-grid animate-slide-up-stagger">
        <section className="premium-card insight-main">
          <div className="insight-header">
            <div className="text-group">
               <p className="label">Total Outflow</p>
               {loading ? <Skeleton width={120} height={32} /> : <h3 className="amount">{formatINR(data.totalOutflow)}</h3>}
            </div>
            <div className="trend positive">
               <TrendingUp size={16} /> <span>+12%</span>
            </div>
          </div>
          
          <div className="visual-chart animate-slide-up-stagger">
            {loading ? (
              [1,2,3,4,5,6,7].map(i => <div key={i} className="bar-group" style={{ height: '100%' }}><Skeleton width="100%" height={100} /></div>)
            ) : (
              data.chartBars.map((height: number, i: number) => (
                <div key={i} className="bar-group hover-scale">
                  <div className="multi-bar-container">
                    <div className="bar income-bar" style={{ height: `${Math.max(30, height)}%` }} title="Income"></div>
                    <div className="bar expense-bar" style={{ height: `${Math.max(10, height - (i * 12))}%` }} title="Expense"></div>
                  </div>
                  <span className="day-label">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="premium-card category-breakdown">
          <h3>Spending by Category</h3>
          <div className="category-list animate-slide-up-stagger">
            {loading ? (
              [1,2,3,4].map(i => <Skeleton key={i} height={40} className="category-item" />)
            ) : (
              data.spendingData.map((item: any, i: number) => (
                <div key={i} className="category-item hover-scale">
                  <div className="item-info">
                    <span className="dot" style={{ background: item.color }}></span>
                    <span className="name">{item.label}</span>
                    <span className="value">{formatINR(item.amount)}</span>
                  </div>
                  <div className="progress-bg">
                    <div 
                      className="progress-fill" 
                      style={{ background: item.color, width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="premium-card savings-goal hover-slide-up">
          <div className="goal-header">
            <Target className="icon" size={24} />
            <div>
               <h4>Monthly Savings Goal</h4>
               <p>₹30,000 Target</p>
            </div>
          </div>
          <div className="goal-status">
             <div className="circular-progress animate-scale-in">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path 
                    className="circle" 
                    strokeDasharray="85, 100" 
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                </svg>
                <div className="percentage">85%</div>
             </div>
             <div className="goal-text">
                <p>You're only <strong>₹4,500</strong> away from your goal!</p>
                <button className="btn-primary-small">View Tips</button>
             </div>
          </div>
        </section>

        <div className="analytics-summary animate-slide-up-stagger">
           <div className="summary-card glass-pane hover-slide-up">
              <ArrowDownLeft className="text-success" />
              <div>
                 <p>Inflow</p>
                 {loading ? <Skeleton width={80} height={24}/> : <h4>{formatINR(data.totalInflow)}</h4>}
              </div>
           </div>
           <div className="summary-card glass-pane hover-slide-up">
              <ArrowUpRight className="text-danger" />
              <div>
                 <p>Outflow</p>
                 {loading ? <Skeleton width={80} height={24}/> : <h4>{formatINR(data.totalOutflow)}</h4>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
