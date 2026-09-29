import React, { useState } from 'react';
import {
  ShieldCheck,
  Calendar,
  AlertTriangle,
  FileText,
  DollarSign,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  Download,
  Upload
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export const TaxComplianceView: React.FC = () => {
  const { gstRecords, tdsRecords, currentClient, showToast } = useApp();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'GST' | 'TDS' | 'CALENDAR' | 'ITC_RECON'>('GST');

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={24} color="var(--primary-500)" /> Tax & Statutory Compliance Workspace
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            GSTR-1, GSTR-3B, GSTR-2B Input Tax Credit Reconciliation & TDS/TCS Sections (194C, 194J, 194Q).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => showToast('GST Auto-Recon Synced', 'Matched 128 inward supplier records against GSTR-2B API.', 'success')}
            className="btn btn-secondary btn-sm"
          >
            <Sparkles size={14} color="var(--ai-purple)" /> Run GSTR-2B Auto-Recon
          </button>
          <button
            onClick={() => showToast('Filing Simulator Ready', 'GSTR-3B tax payload verified for client authorization.', 'info')}
            className="btn btn-primary btn-sm"
          >
            Review GSTR-3B Filing
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        {[
          { key: 'GST', label: 'GST Returns & Liability' },
          { key: 'ITC_RECON', label: 'GSTR-2B ITC Mismatch Finder' },
          { key: 'TDS', label: 'TDS & TCS Section Master' },
          { key: 'CALENDAR', label: 'Compliance Calendar' }
        ].map((t) => (
          <div
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`tab-item ${activeTab === t.key ? 'active' : ''}`}
          >
            {t.label}
          </div>
        ))}
      </div>

      {/* Tab: GST */}
      {activeTab === 'GST' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* GST Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>OUTWARD TAX LIABILITY</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px' }}>₹34,20,000</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>CGST: ₹17.1L | SGST: ₹17.1L</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>AVAILABLE ITC (GSTR-2B)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--success-500)' }}>₹21,80,000</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>98.4% Matched with Inward Ledger</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>NET CASH PAYABLE (TABLE 6.1)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--warning-500)' }}>₹12,40,000</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--danger-500)', marginTop: '2px' }}>Due 20th Oct 2024</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>QUARANTINED ITC MISMATCH</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--danger-500)' }}>₹24,500</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>2 Suppliers Flagged</div>
            </div>
          </div>

          {/* GST Return History Table */}
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Filing Period</th>
                  <th>Return Type</th>
                  <th>Calculated Liability</th>
                  <th>ITC Claimed</th>
                  <th>Cash Paid</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Government ARN</th>
                </tr>
              </thead>
              <tbody>
                {gstRecords.map((gst) => (
                  <tr key={gst.id}>
                    <td style={{ fontWeight: 700 }}>{gst.period}</td>
                    <td><span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>{gst.returnType}</span></td>
                    <td className="font-mono">₹{gst.liabilityCalculated.toLocaleString('en-IN')}</td>
                    <td className="font-mono" style={{ color: 'var(--success-500)' }}>₹{gst.itcAvailable.toLocaleString('en-IN')}</td>
                    <td className="font-mono" style={{ color: 'var(--warning-500)' }}>₹{gst.cashPaid.toLocaleString('en-IN')}</td>
                    <td>{gst.dueDate}</td>
                    <td>
                      <span className={gst.status === 'FILED' ? 'badge badge-success' : 'badge badge-warning'} style={{ fontSize: '0.62rem' }}>
                        {gst.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--primary-500)' }}>
                      {gst.arn || 'Pending Verification'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: ITC Recon */}
      {activeTab === 'ITC_RECON' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>GSTR-2B vs Inward Books Mismatch Analysis</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Automated cross-check of purchase invoices against GSTN portal</p>
            </div>
            <span className="badge badge-danger">2 Mismatches Isolated</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--danger-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 700, color: 'var(--danger-500)' }}>Supplier GSTIN Cancelled: CloudNet Services</div>
                <span className="badge badge-danger">₹12,480 ITC at risk</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Supplier GSTIN 29AAACC9918K1Z5 was cancelled retrospectively from Aug 2024. Invoice #VL-9921 date 2026-09-14 is not visible in GSTR-2B.
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => showToast('ITC Reversal Booked', 'Reversed ₹12,480 in GSTR-3B Table 4(B)(2).', 'success')}
                  className="btn btn-danger btn-sm"
                  style={{ fontSize: '0.7rem' }}
                >
                  Reverse in 3B Table 4(B)(2)
                </button>
                <button
                  onClick={() => showToast('Vendor Notice Sent', 'Payment hold placed on CloudNet Services.', 'warning')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.7rem' }}
                >
                  Hold Vendor Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: TDS */}
      {activeTab === 'TDS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Description</th>
                  <th>Vendor / Deductee</th>
                  <th>PAN</th>
                  <th>Gross Amount</th>
                  <th>Rate</th>
                  <th>TDS Amount</th>
                  <th>Deposit Due Date</th>
                  <th>Challan Status</th>
                </tr>
              </thead>
              <tbody>
                {tdsRecords.map((tds) => (
                  <tr key={tds.id}>
                    <td className="font-mono" style={{ fontWeight: 800, color: 'var(--primary-500)' }}>{tds.section}</td>
                    <td style={{ fontSize: '0.78rem' }}>{tds.description}</td>
                    <td style={{ fontWeight: 600 }}>{tds.vendorName}</td>
                    <td className="font-mono" style={{ fontSize: '0.72rem' }}>{tds.vendorPan}</td>
                    <td className="font-mono">₹{tds.grossAmount.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 700 }}>{tds.ratePercent}%</td>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--warning-500)' }}>₹{tds.tdsAmount.toLocaleString('en-IN')}</td>
                    <td>{tds.depositDueDate}</td>
                    <td>
                      <span className={tds.status === 'DEPOSITED' ? 'badge badge-success' : 'badge badge-info'} style={{ fontSize: '0.62rem' }}>
                        {tds.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Calendar */}
      {activeTab === 'CALENDAR' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Statutory Compliance Calendar — Q3 FY 2024-25</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
            {[
              { date: '11 Oct 2024', event: 'GSTR-1 Monthly Outward Filing', status: 'FILED', badge: 'badge-success' },
              { date: '20 Oct 2024', event: 'GSTR-3B Summary Return & Tax Payment', status: 'DUE TOMORROW', badge: 'badge-danger' },
              { date: '07 Nov 2024', event: 'TDS/TCS Deposit (Challan 281) for Oct', status: 'UPCOMING', badge: 'badge-info' },
              { date: '15 Nov 2024', event: 'Advance Tax Q3 Calculation Review', status: 'UPCOMING', badge: 'badge-info' },
              { date: '30 Nov 2024', event: 'Form 26Q Quarterly Return for Q2', status: 'UPCOMING', badge: 'badge-info' }
            ].map((ev, i) => (
              <div key={i} style={{ padding: '14px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.74rem', color: 'var(--primary-500)', fontWeight: 700 }}>{ev.date}</div>
                <div style={{ fontWeight: 700, fontSize: '0.84rem', marginTop: '4px' }}>{ev.event}</div>
                <div style={{ marginTop: '8px' }}>
                  <span className={`badge ${ev.badge}`} style={{ fontSize: '0.62rem' }}>{ev.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
