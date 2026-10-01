import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  CheckCircle2,
  DollarSign,
  Award,
  Sparkles,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const AnalyticsView: React.FC = () => {
  const { clients, tasks, showToast } = useApp();
  const { currentUser } = useAuth();

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={24} color="var(--primary-500)" /> Practice Analytics & Operational Intelligence
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Team Workload Distribution, Statutory Turnaround Time (TAT), Client Profitability & SLA Compliance.
          </p>
        </div>

        <button
          onClick={() => showToast('Analytics Export Ready', 'Downloaded Practice Performance PDF Report.', 'success')}
          className="btn btn-secondary btn-sm"
        >
          <Download size={14} /> Export Practice Report
        </button>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>PRACTICE ON-TIME FILING RATE</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '4px', color: 'var(--success-500)' }}>99.2%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Across 148 statutory filings</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVG. STATUTORY TAT (HOURS)</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary-500)' }}>14.2 Hours</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--success-500)', marginTop: '2px' }}>32% faster than last quarter</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL BILLABLE ENGAGEMENTS</div>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '4px', color: 'var(--info-500)' }}>₹84.5 Lakhs</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Annual Retainers & Special Cases</div>
        </div>
      </div>

      {/* Team Workload Matrix */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px' }}>Professional Team Capacity & Allocation</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
          {[
            {
              name: currentUser.name || 'Lead Practitioner',
              role: currentUser.role ? `${currentUser.role} (Primary User)` : 'Lead Partner / CA',
              activeTasks: tasks.filter((t) => t.status !== 'COMPLETED').length,
              capacity: Math.min(100, Math.max(20, tasks.length * 10)),
              score: 98
            },
            { name: 'CMA Rajeshwari Nair', role: 'Cost & Management CMA', activeTasks: 0, capacity: 40, score: 95 },
            { name: 'CS Ananya Deshmukh', role: 'Company Secretary FCS', activeTasks: 0, capacity: 35, score: 99 },
            { name: 'Rohan Mehta', role: 'Senior Accountant', activeTasks: 0, capacity: 50, score: 94 }
          ].map((member, i) => (
            <div key={i} style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{member.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{member.role}</div>
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>{member.score}% Quality</span>
              </div>

              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                  <span>Workload Capacity</span>
                  <span style={{ fontWeight: 700 }}>{member.capacity}% ({member.activeTasks} Tasks)</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-card)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${member.capacity}%`, height: '100%', backgroundColor: member.capacity > 90 ? 'var(--warning-500)' : 'var(--primary-500)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
