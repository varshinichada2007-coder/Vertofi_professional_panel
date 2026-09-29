import React, { useState } from 'react';
import {
  ArrowDownLeft,
  Plus,
  QrCode,
  FileCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Send,
  X,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Invoice } from '../../types';

export const AccountsReceivableView: React.FC = () => {
  const { invoices, createInvoice, showToast } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [customerName, setCustomerName] = useState('Tata Consultancy Services Ltd');
  const [customerGstin, setCustomerGstin] = useState('27AAACT2727Q1ZW');
  const [itemDesc, setItemDesc] = useState('Enterprise Cloud API Consulting');
  const [hsnSac, setHsnSac] = useState('998314');
  const [amount, setAmount] = useState('450000');
  const [taxRate, setTaxRate] = useState('18');

  const customerInvoices = invoices.filter((i) => i.partyType === 'CUSTOMER');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmt = parseFloat(amount) || 0;
    const rate = parseFloat(taxRate) || 18;
    const tax = (numAmt * rate) / 100;

    createInvoice({
      partyType: 'CUSTOMER',
      partyName: customerName,
      partyGstin: customerGstin,
      subtotal: numAmt,
      totalTax: tax,
      items: [
        {
          id: `item_${Date.now()}`,
          description: itemDesc,
          hsnSac,
          quantity: 1,
          unit: 'Milestone',
          rate: numAmt,
          taxableAmount: numAmt,
          gstRate: rate,
          cgst: tax / 2,
          sgst: tax / 2,
          igst: 0,
          discount: 0,
          total: numAmt + tax
        }
      ]
    });

    setIsCreateModalOpen(false);
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowDownLeft size={24} color="var(--info-500)" /> Accounts Receivable (AR) & e-Invoicing
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Sales Invoices, IRN & QR Generation, DSO Aging Schedule & Payment Collections.
          </p>
        </div>

        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus size={14} /> Create Sales Invoice
        </button>
      </div>

      {/* AR Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL AR OUTSTANDING</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--info-500)' }}>₹22,84,000</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Across 8 Enterprise Clients</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>DAYS SALES OUTSTANDING (DSO)</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--success-500)' }}>34 Days</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--success-500)', marginTop: '2px' }}>11 Days below industry benchmark</div>
        </div>
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>E-INVOICE (IRN) SUCCESS RATE</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--primary-500)' }}>100%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>NIC IRP Direct API Active</div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice Number</th>
              <th>Customer</th>
              <th>GSTIN</th>
              <th>Date & Due Date</th>
              <th>Taxable Subtotal</th>
              <th>GST Total</th>
              <th>Grand Total</th>
              <th>Status</th>
              <th>e-Invoice IRN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerInvoices.map((inv) => (
              <tr key={inv.id}>
                <td className="font-mono" style={{ fontWeight: 700 }}>{inv.invoiceNumber}</td>
                <td style={{ fontWeight: 600 }}>{inv.partyName}</td>
                <td className="font-mono" style={{ fontSize: '0.72rem' }}>{inv.partyGstin}</td>
                <td>
                  <div>{inv.date}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Due: {inv.dueDate}</div>
                </td>
                <td className="font-mono">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                <td className="font-mono">₹{inv.totalTax.toLocaleString('en-IN')}</td>
                <td className="font-mono" style={{ fontWeight: 700 }}>₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                <td>
                  <span className={inv.status === 'PAID' ? 'badge badge-success' : 'badge badge-warning'} style={{ fontSize: '0.62rem' }}>
                    {inv.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <QrCode size={14} color="var(--primary-500)" />
                    <span className="font-mono" style={{ fontSize: '0.66rem', color: 'var(--primary-500)' }}>
                      {inv.irn ? `${inv.irn.substring(0, 12)}...` : 'Generated'}
                    </span>
                  </div>
                </td>
                <td>
                  <button
                    onClick={() => showToast('Payment Reminder Dispatched', `Sent statement to ${inv.partyName}`, 'info')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                  >
                    <Send size={12} /> Remind
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Sales Invoice Modal */}
      {isCreateModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsCreateModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Generate e-Invoice (Sales / Tax Invoice)</h3>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Customer Name</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Customer GSTIN</label>
                  <input
                    type="text"
                    required
                    value={customerGstin}
                    onChange={(e) => setCustomerGstin(e.target.value)}
                    className="input-field font-mono"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>HSN / SAC Code</label>
                  <input
                    type="text"
                    value={hsnSac}
                    onChange={(e) => setHsnSac(e.target.value)}
                    className="input-field font-mono"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Item / Service Description</label>
                <input
                  type="text"
                  required
                  value={itemDesc}
                  onChange={(e) => setItemDesc(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Taxable Value (INR)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="input-field font-mono"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>GST Rate (%)</label>
                  <select
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="input-field select-field"
                    style={{ marginTop: '4px' }}
                  >
                    <option value="5">5% (Essential)</option>
                    <option value="12">12% (Standard 1)</option>
                    <option value="18">18% (Services & Tech)</option>
                    <option value="28">28% (Luxury)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate IRN & Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
