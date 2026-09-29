import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  FileSearch,
  ArrowRight,
  Filter,
  Check,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RiskException } from '../../types';

export const ExceptionsRiskView: React.FC = () => {
  const { riskExceptions, resolveRiskException, showToast } = useApp();

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={24} color="var(--danger-500)" /> Exceptions & Financial Risk Radar
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Automated Detection of Duplicate Payments, ITC Ineligibility, TDS Rate Mismatches & Unusual Outliers.
          </p>
        </div>

        <button
          onClick={() => showToast('Deep Anomaly Scan Complete', 'Scanned 1,420 transactions across 5 clients. Zero new critical risks.', 'success')}
          className="btn btn-secondary btn-sm"
        >
          <Sparkles size={14} color="var(--ai-purple)" /> Run Deep Anomaly Scan
        </button>
      </div>

      {/* Exception Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {riskExceptions.map((exception) => {
          const isResolved = exception.status === 'RESOLVED';
          return (
            <div
              key={exception.id}
              className="glass-panel"
              style={{
                padding: '20px',
                border: isResolved ? '1px solid var(--success-border)' : exception.severity === 'CRITICAL' ? '1px solid var(--danger-border)' : '1px solid var(--warning-border)',
                background: isResolved ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)'
              }}
            >
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-500)' }}>
                      {exception.code}
                    </span>
                    <span className={exception.severity === 'CRITICAL' ? 'badge badge-danger' : 'badge badge-warning'}>
                      {exception.severity}
                    </span>
                    <span className="badge badge-neutral">{exception.type.replace(/_/g, ' ')}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '6px' }}>
                    {exception.title}
                  </h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Client Entity: <strong>{exception.clientName}</strong> • Assigned: {exception.assignedTo}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  {exception.amountInvolved && (
                    <div className="font-mono" style={{ fontSize: '1.2rem', fontWeight: 800, color: isResolved ? 'var(--text-muted)' : 'var(--danger-500)' }}>
                      ₹{exception.amountInvolved.toLocaleString('en-IN')}
                    </div>
                  )}
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    AI Confidence: <strong>{exception.confidenceScore}%</strong>
                  </div>
                </div>
              </div>

              {/* 4-Box Structured Explanation (What happened? Why detected? Source evidence? Recommended next action?) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '12px',
                  marginTop: '16px',
                  padding: '14px',
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem'
                }}
              >
                <div>
                  <div style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                    1. What Happened?
                  </div>
                  <div style={{ color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.4 }}>
                    {exception.whatHappened}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                    2. Why Was It Detected?
                  </div>
                  <div style={{ color: 'var(--text-primary)', marginTop: '4px', lineHeight: 1.4 }}>
                    {exception.whyDetected}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                    3. Source & Evidence
                  </div>
                  <div className="font-mono" style={{ color: 'var(--primary-500)', marginTop: '4px', fontSize: '0.72rem', lineHeight: 1.4 }}>
                    {exception.sourceEvidence}
                  </div>
                </div>

                <div>
                  <div style={{ color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.68rem' }}>
                    4. Recommended Action
                  </div>
                  <div style={{ color: 'var(--success-500)', fontWeight: 600, marginTop: '4px', lineHeight: 1.4 }}>
                    {exception.recommendedAction}
                  </div>
                </div>
              </div>

              {/* Action Ribbon */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                {!isResolved ? (
                  <>
                    <button
                      onClick={() => showToast('Investigation Initiated', `Assigned case ${exception.code} to team.`, 'info')}
                      className="btn btn-secondary btn-sm"
                    >
                      Investigate Evidence
                    </button>
                    <button
                      onClick={() => resolveRiskException(exception.id)}
                      className="btn btn-success btn-sm"
                    >
                      ✓ Execute Corrective Action & Resolve
                    </button>
                  </>
                ) : (
                  <span className="badge badge-success" style={{ fontSize: '0.74rem' }}>
                    <CheckCircle2 size={12} /> Resolved & Audited
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
