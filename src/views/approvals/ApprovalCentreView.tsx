import React, { useState } from 'react';
import {
  CheckCheck,
  ShieldCheck,
  Check,
  X,
  Clock,
  ArrowRight,
  Filter,
  DollarSign,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { ApprovalItem } from '../../types';

export const ApprovalCentreView: React.FC = () => {
  const { approvals, approveItem, rejectItem, showToast } = useApp();
  const { currentUser } = useAuth();
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredApprovals = approvals.filter((a) => {
    if (filterType !== 'ALL' && a.type !== filterType) return false;
    return true;
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCheck size={24} color="var(--primary-500)" /> Maker-Checker Authorization & Approval Queue
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Dual-Signoff Workflow for Journal Vouchers, High-Value Bank Payments, and Tax Adjustments.
          </p>
        </div>

        <span className="badge badge-success" style={{ fontSize: '0.74rem' }}>
          <ShieldCheck size={14} /> Dual-Control Active
        </span>
      </div>

      {/* Filter Ribbon */}
      <div className="glass-panel" style={{ padding: '12px 16px', display: 'flex', gap: '6px', overflowX: 'auto' }}>
        {[
          { key: 'ALL', label: 'All Items' },
          { key: 'JOURNAL_VOUCHER', label: 'Journal Vouchers' },
          { key: 'HIGH_VALUE_TXN', label: 'High-Value Payments (>₹5L)' },
          { key: 'TAX_ADJUSTMENT', label: 'Tax Adjustments' }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilterType(f.key)}
            className={filterType === f.key ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{ fontSize: '0.72rem', padding: '4px 12px' }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Approvals Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredApprovals.map((item) => {
          const isApproved = item.status === 'APPROVED';
          const isRejected = item.status === 'REJECTED';
          return (
            <div
              key={item.id}
              className="glass-panel"
              style={{
                padding: '20px',
                border: isApproved ? '1px solid var(--success-border)' : isRejected ? '1px solid var(--danger-border)' : '1px solid var(--border-subtle)',
                background: isApproved ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-primary">{item.type.replace(/_/g, ' ')}</span>
                    <span className={item.riskLevel === 'HIGH' ? 'badge badge-danger' : 'badge badge-neutral'}>
                      {item.riskLevel} Risk
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Date: {item.date}</span>
                  </div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginTop: '6px' }}>{item.title}</h3>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Client Entity: <strong>{item.clientName}</strong> • Prepared by: <strong>{item.requestedBy} ({item.requestedByRole})</strong>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    ₹{item.amount.toLocaleString('en-IN')}
                  </div>
                  <span className={isApproved ? 'badge badge-success' : isRejected ? 'badge badge-danger' : 'badge badge-warning'} style={{ marginTop: '4px' }}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.4 }}>
                {item.details}
              </div>

              {/* Ledger Diff Summary */}
              {item.diffSummary && (
                <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Ledger Impact / Diff Before & After:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {item.diffSummary.map((diff, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem' }}>
                        <span style={{ fontWeight: 600 }}>{diff.field}:</span>
                        <span>
                          <span style={{ color: 'var(--text-muted)' }}>{diff.before}</span> → <strong style={{ color: 'var(--primary-500)' }}>{diff.after}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Maker-Checker Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '14px' }}>
                {!isApproved && !isRejected ? (
                  <>
                    <button onClick={() => rejectItem(item.id)} className="btn btn-outline-danger btn-sm">
                      <X size={14} /> Reject & Return to Maker
                    </button>
                    <button onClick={() => approveItem(item.id)} className="btn btn-success btn-sm">
                      <Check size={14} /> Approve & Digitally Seal (Checker)
                    </button>
                  </>
                ) : (
                  <span className="badge badge-success">
                    Sealed by {currentUser.name} ({currentUser.role})
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
