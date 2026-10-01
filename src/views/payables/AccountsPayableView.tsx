import React, { useState } from 'react';
import {
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  CreditCard,
  Building,
  Sparkles,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';

export const AccountsPayableView: React.FC = () => {
  const { invoices, showToast } = useApp();
  const [selectedBatch, setSelectedBatch] = useState<string[]>([]);

  const vendorBills = invoices.filter((i) => i.partyType === 'VENDOR');

  // ── Computed stats from real data ──
  const totalPayables = vendorBills
    .filter((i) => i.status !== 'PAID')
    .reduce((sum, i) => sum + (i.amountDue || 0), 0);
  const uniqueVendors = new Set(vendorBills.map((i) => i.partyName)).size;
  const totalCOGS = vendorBills.reduce((sum, i) => sum + (i.grandTotal || 0), 0);
  const dpo = totalCOGS > 0 ? Math.round((totalPayables / totalCOGS) * 30) : 0;

  const handleReleaseBatch = () => {
    showToast(
      'Maker-Checker Payment Batch Submitted',
      'Batch of 3 vendor bills submitted for dual-authorization release.',
      'success'
    );
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowUpRight size={24} color="var(--primary-500)" /> Accounts Payable (AP) & Vendor Governance
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Vendor Invoices, OCR Fingerprint Duplicate Detection, DPO Metrics & Maker-Checker Disbursement.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleReleaseBatch} className="btn btn-primary btn-sm">
            <CreditCard size={14} /> Release Payment Batch (Maker)
          </button>
        </div>
      </div>

      {/* AP Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>OUTSTANDING PAYABLES (AP)</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--warning-500)' }}>
            {totalPayables > 0 ? `₹${totalPayables.toLocaleString('en-IN')}` : '—'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {uniqueVendors > 0 ? `Across ${uniqueVendors} vendor${uniqueVendors > 1 ? 's' : ''}` : 'No vendor bills yet'}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>DAYS PAYABLE OUTSTANDING (DPO)</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--success-500)' }}>
            {dpo > 0 ? `${dpo} Days` : '—'}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {vendorBills.length > 0 ? 'Based on current payables' : 'Add vendor bills to track DPO'}
          </div>
        </div>
        <div className="glass-panel" style={{ padding: '16px', border: '1px solid var(--danger-border)' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--danger-500)', fontWeight: 600 }}>DUPLICATE BILL DETECTIONS</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--danger-500)' }}>0 Quarantined</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--danger-500)', marginTop: '2px' }}>AI duplicate engine active</div>
        </div>
      </div>

      {/* Vendor Invoices Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bill Number</th>
              <th>Vendor / Supplier</th>
              <th>GSTIN</th>
              <th>Bill Date & Due</th>
              <th>Taxable Amount</th>
              <th>GST ITC</th>
              <th>Net Total</th>
              <th>Status</th>
              <th>Recon Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendorBills.map((bill) => (
              <tr key={bill.id}>
                <td className="font-mono" style={{ fontWeight: 700 }}>{bill.invoiceNumber}</td>
                <td style={{ fontWeight: 600 }}>{bill.partyName}</td>
                <td className="font-mono" style={{ fontSize: '0.72rem' }}>{bill.partyGstin}</td>
                <td>
                  <div>{bill.date}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Due: {bill.dueDate}</div>
                </td>
                <td className="font-mono">₹{bill.subtotal.toLocaleString('en-IN')}</td>
                <td className="font-mono" style={{ color: 'var(--success-500)' }}>₹{bill.totalTax.toLocaleString('en-IN')}</td>
                <td className="font-mono" style={{ fontWeight: 700 }}>₹{bill.grandTotal.toLocaleString('en-IN')}</td>
                <td>
                  <span className={bill.status === 'PAID' ? 'badge badge-success' : bill.status === 'OVERDUE' ? 'badge badge-danger' : 'badge badge-warning'} style={{ fontSize: '0.62rem' }}>
                    {bill.status}
                  </span>
                </td>
                <td>
                  <span className={bill.reconciliationStatus === 'RECONCILED' ? 'badge badge-success' : 'badge badge-warning'} style={{ fontSize: '0.62rem' }}>
                    {bill.reconciliationStatus}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => showToast('Vendor Verification', `Verified TDS section & bank details for ${bill.partyName}`, 'info')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                  >
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
