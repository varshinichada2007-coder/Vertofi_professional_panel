import React from 'react';
import {
  HeartPulse,
  Award,
  ShieldCheck,
  TrendingUp,
  Download,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BhsView: React.FC = () => {
  const { bhsReport, currentClient, showToast } = useApp();

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HeartPulse size={24} color="var(--primary-500)" /> Business Health Score (BHS) Matrix
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Composite 5-Dimensional Financial Solvency, Statutory Punctuality & Governance Index for <strong>{currentClient.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => showToast('BHS Diagnostic Report', 'Generated comprehensive PDF health report for sharing with board/lenders.', 'success')}
          className="btn btn-primary btn-sm"
        >
          <Download size={14} /> Export Certified BHS Report
        </button>
      </div>

      {/* Principle Disclaimer Notice */}
      <div
        style={{
          padding: '10px 14px',
          background: 'rgba(99, 102, 241, 0.08)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.74rem',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Info size={16} color="var(--primary-500)" style={{ flexShrink: 0 }} />
        <span>
          Vertofi BHS is a data-driven diagnostic intelligence tool. It does not represent a statutory certification or autonomous guarantee of solvency. Professional review required.
        </span>
      </div>

      {/* Main Score & Grade Hero Card */}
      <div
        className="glass-panel"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(99, 102, 241, 0.08))',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'var(--bg-card)',
              border: '4px solid var(--success-500)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)'
            }}
          >
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--success-500)', lineHeight: 1 }}>
              {bhsReport.overallScore}
            </div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: 700 }}>/ 100</div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Grade {bhsReport.grade} — Exceptional Financial Health</h2>
              <span className="badge badge-success">
                <TrendingUp size={12} /> Positive Trend
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              As of {bhsReport.asOfDate} • Verified across General Ledger, GST Returns & Bank Feeds
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => showToast('Controlled Access Granted', 'Generated secure expiring share link for lender due diligence.', 'info')}
            className="btn btn-secondary btn-sm"
          >
            Share with Expiry Access
          </button>
        </div>
      </div>

      {/* 5 Dimensional Factors Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Factor-Level Breakdown & Explainable Sources</h3>
        {bhsReport.dimensions.map((dim, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{dim.name}</span>
                  <span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>Weight: {dim.weight}%</span>
                  <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>{dim.status}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {dim.explanation}
                </div>
              </div>
              <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success-500)' }}>
                {dim.score}/100
              </div>
            </div>

            <div style={{ width: '100%', height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden', marginTop: '6px' }}>
              <div style={{ width: `${dim.score}%`, height: '100%', backgroundColor: 'var(--success-500)' }} />
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              Auditable Evidence: <strong style={{ color: 'var(--text-primary)' }}>{dim.keyMetric}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
