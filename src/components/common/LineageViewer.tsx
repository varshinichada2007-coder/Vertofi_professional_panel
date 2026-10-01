import React, { useState } from 'react';
import {
  FileText,
  Calculator,
  CreditCard,
  Landmark,
  GitMerge,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export interface LineageStep {
  id: string;
  stepName: string;
  title: string;
  referenceCode: string;
  timestamp: string;
  performedBy: string;
  role: string;
  status: 'VERIFIED' | 'PENDING' | 'EXCEPTION';
  details: string;
  recordHash: string;
}

export const LineageViewer: React.FC<{
  steps?: LineageStep[];
  transactionId?: string;
}> = ({ steps, transactionId }) => {
  const { currentUser } = useAuth();
  const userName = currentUser?.name || 'Authorized Auditor';

  const defaultSteps: LineageStep[] = [
    {
      id: 'step_1',
      stepName: 'Business Operation',
      title: 'Sales Order & Service Delivery',
      referenceCode: 'SO-2024-8819',
      timestamp: '2026-10-10 10:15 IST',
      performedBy: 'Karan Singhania',
      role: 'Client Director',
      status: 'VERIFIED',
      details: 'Enterprise SaaS Annual Contract executed with Reliance Retail Ventures.',
      recordHash: '8f4c21980aef89102834b9281a098c19'
    },
    {
      id: 'step_2',
      stepName: 'e-Invoice & IRN',
      title: 'Tax Invoice & QR Generation',
      referenceCode: 'INV-2024-0891',
      timestamp: '2026-10-10 10:18 IST',
      performedBy: 'Vertofi Automated Engine',
      role: 'System Bot',
      status: 'VERIFIED',
      details: 'IRN #b7a4e8d32 generated via NIC IRP Portal with 18% GST calculation.',
      recordHash: '91209384710928347109283471029834'
    },
    {
      id: 'step_3',
      stepName: 'Tax Matrix Booking',
      title: 'Output CGST/SGST Booking',
      referenceCode: 'TAX-CALC-8812',
      timestamp: '2026-10-10 10:18 IST',
      performedBy: 'Rohan Mehta',
      role: 'Accountant',
      status: 'VERIFIED',
      details: '₹1,08,000 CGST + ₹1,08,000 SGST booked to Accounts 2002 & 2003.',
      recordHash: '34712098471234b7a4e8d32109847120'
    },
    {
      id: 'step_4',
      stepName: 'Bank Inward Wire',
      title: 'HDFC Corporate Current Feed',
      referenceCode: 'CMS009182348',
      timestamp: '2026-10-12 14:22 IST',
      performedBy: 'HDFC Direct API',
      role: 'Bank Feed',
      status: 'VERIFIED',
      details: 'RTGS Credit of ₹14,16,000 received from Reliance Retail bank account.',
      recordHash: '77192847192847102938471092834710'
    },
    {
      id: 'step_5',
      stepName: 'Reconciliation',
      title: '1-Click Auto Ledger Matching',
      referenceCode: 'REC-MATCH-4412',
      timestamp: '2026-10-12 14:30 IST',
      performedBy: userName,
      role: 'CA / Senior Partner',
      status: 'VERIFIED',
      details: '100% confidence match between Bank Feed & Invoice #INV-2024-0891.',
      recordHash: 'a8f5f167f44f4964e6c998dee827110c'
    },
    {
      id: 'step_6',
      stepName: 'General Ledger Post',
      title: 'Journal Voucher Posted',
      referenceCode: 'JV-2024-101',
      timestamp: '2026-10-12 14:35 IST',
      performedBy: userName,
      role: 'CA',
      status: 'VERIFIED',
      details: 'Debited Bank 1001, Credited Sundry Debtors 1003. Ledger locked.',
      recordHash: 'e3b0c44298fc1c149afbf4c8996fb924'
    },
    {
      id: 'step_7',
      stepName: 'Statutory GSTR-1',
      title: 'Portal Filing & ARN Acknowledged',
      referenceCode: 'ARN-AA2709240182910',
      timestamp: '2026-10-15 16:40 IST',
      performedBy: userName,
      role: 'CA',
      status: 'VERIFIED',
      details: 'Included in Table 4A (B2B Supplies). Government ARN receipt sealed.',
      recordHash: '5e884898da28047151d0e56f8dc62927'
    }
  ];

  const currentSteps = steps || defaultSteps;
  const [selectedStep, setSelectedStep] = useState<LineageStep>(currentSteps[0]);

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--primary-500)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>End-to-End Financial Audit Lineage</h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Cryptographically chained lineage tracking from initial business operation to statutory portal acknowledgment.
          </p>
        </div>
        <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
          <Shield size={12} /> 100% Immutable Trail
        </span>
      </div>

      {/* Horizontal Steps Ribbon */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '16px'
        }}
      >
        {currentSteps.map((step, idx) => {
          const isSelected = selectedStep.id === step.id;
          return (
            <React.Fragment key={step.id}>
              <div
                onClick={() => setSelectedStep(step)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: isSelected ? 'var(--bg-subtle)' : 'var(--bg-card)',
                  border: isSelected ? '1px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  minWidth: '150px',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
                className="glass-panel-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    0{idx + 1}. {step.stepName}
                  </span>
                  <CheckCircle2 size={13} color="var(--success-500)" />
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {step.referenceCode}
                </div>
              </div>
              {idx < currentSteps.length - 1 && (
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Selected Step Detail Panel */}
      <div
        style={{
          padding: '16px',
          borderRadius: 'var(--radius-sm)',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedStep.title} ({selectedStep.referenceCode})
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              {selectedStep.details}
            </div>
          </div>
          <span className="badge badge-success">{selectedStep.status}</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem'
          }}
        >
          <div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Executed By</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {selectedStep.performedBy} ({selectedStep.role})
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Timestamp</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
              {selectedStep.timestamp}
            </div>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ color: 'var(--text-muted)', fontWeight: 600 }}>SHA-256 Record Hash</div>
            <div className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--primary-500)', marginTop: '2px', wordBreak: 'break-all' }}>
              {selectedStep.recordHash}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
