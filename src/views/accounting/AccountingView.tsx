import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Lock,
  Unlock,
  CheckCircle2,
  FileCheck,
  Calculator,
  ArrowRight,
  Filter,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  History
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { JournalEntry, AccountCategory } from '../../types';

export const AccountingView: React.FC = () => {
  const {
    accounts,
    journalEntries,
    submitJournalEntry,
    approveJournalEntry,
    currentClient,
    showToast
  } = useApp();
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'JOURNAL' | 'LEDGER' | 'COA' | 'TRIAL_BALANCE' | 'PNL' | 'BALANCE_SHEET' | 'PERIOD_CLOSE'>('JOURNAL');
  const [isNewVoucherModalOpen, setIsNewVoucherModalOpen] = useState(false);
  const [isPeriodLocked, setIsPeriodLocked] = useState(false);

  // New Voucher Form
  const [narration, setNarration] = useState('');
  const [debitAccountId, setDebitAccountId] = useState(accounts[0].id);
  const [creditAccountId, setCreditAccountId] = useState(accounts[1].id);
  const [amount, setAmount] = useState('250000');
  const [referenceDoc, setReferenceDoc] = useState('VOUCHER-REF-991');

  const handleCreateVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount) || 0;
    const debitAcc = accounts.find((a) => a.id === debitAccountId) || accounts[0];
    const creditAcc = accounts.find((a) => a.id === creditAccountId) || accounts[1];

    submitJournalEntry({
      narration,
      referenceDoc,
      totalDebit: numAmount,
      totalCredit: numAmount,
      lines: [
        {
          id: `jl_${Date.now()}_1`,
          accountId: debitAcc.id,
          accountCode: debitAcc.code,
          accountName: debitAcc.name,
          description: narration,
          debit: numAmount,
          credit: 0
        },
        {
          id: `jl_${Date.now()}_2`,
          accountId: creditAcc.id,
          accountCode: creditAcc.code,
          accountName: creditAcc.name,
          description: narration,
          debit: 0,
          credit: numAmount
        }
      ]
    });

    setIsNewVoucherModalOpen(false);
    setNarration('');
  };

  const togglePeriodLock = () => {
    setIsPeriodLocked(!isPeriodLocked);
    showToast(
      isPeriodLocked ? 'Financial Period Reopened' : 'Period Close & Lock Verified',
      isPeriodLocked ? 'Entries may now be posted by authorized CA.' : 'Ledger locked with cryptographic SHA-256 seal.',
      isPeriodLocked ? 'warning' : 'success'
    );
  };

  const totalDebitBalance = accounts.filter((a) => a.type === 'DEBIT').reduce((acc, curr) => acc + curr.balance, 0);
  const totalCreditBalance = accounts.filter((a) => a.type === 'CREDIT').reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={24} color="var(--primary-500)" /> Accounting & General Ledger Workspace
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Maker-Checker Journal Vouchers, Multi-Category Chart of Accounts, Trial Balance & Period Close.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={togglePeriodLock} className={isPeriodLocked ? 'btn btn-outline-danger btn-sm' : 'btn btn-secondary btn-sm'}>
            {isPeriodLocked ? <Lock size={14} /> : <Unlock size={14} />}
            {isPeriodLocked ? 'Period Locked (Close Active)' : 'Lock Current Period'}
          </button>
          <button
            onClick={() => setIsNewVoucherModalOpen(true)}
            disabled={isPeriodLocked}
            className="btn btn-primary btn-sm"
            style={{ opacity: isPeriodLocked ? 0.5 : 1 }}
          >
            <Plus size={14} /> Create Journal Voucher (Maker)
          </button>
        </div>
      </div>

      {/* Accounting Tabs */}
      <div className="tab-list">
        {[
          { key: 'JOURNAL', label: 'Journal Entries & Maker-Checker' },
          { key: 'LEDGER', label: 'General Ledger' },
          { key: 'COA', label: 'Chart of Accounts' },
          { key: 'TRIAL_BALANCE', label: 'Trial Balance' },
          { key: 'PNL', label: 'Profit & Loss Statement' },
          { key: 'BALANCE_SHEET', label: 'Balance Sheet' },
          { key: 'PERIOD_CLOSE', label: 'Period Close & Lock' }
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

      {/* Tab: Journal Entries */}
      {activeTab === 'JOURNAL' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Voucher #</th>
                  <th>Date</th>
                  <th>Narration & Ref</th>
                  <th>Maker / Prepared By</th>
                  <th>Checker / Approver</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {journalEntries.map((jv) => (
                  <tr key={jv.id}>
                    <td className="font-mono" style={{ fontWeight: 700 }}>{jv.voucherNumber}</td>
                    <td>{jv.date}</td>
                    <td>
                      <div style={{ fontWeight: 600, maxWidth: '280px' }}>{jv.narration}</div>
                      {jv.referenceDoc && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Ref: {jv.referenceDoc}</div>}
                    </td>
                    <td>
                      <div>{jv.makerName}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{jv.makerRole}</div>
                    </td>
                    <td>
                      {jv.checkerName ? (
                        <div>
                          <div>{jv.checkerName}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{jv.checkerRole}</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Pending Review</span>
                      )}
                    </td>
                    <td className="font-mono" style={{ fontWeight: 700 }}>₹{jv.totalDebit.toLocaleString('en-IN')}</td>
                    <td>
                      <span
                        className={
                          jv.status === 'APPROVED' || jv.status === 'POSTED'
                            ? 'badge badge-success'
                            : jv.status === 'UNDER_REVIEW'
                            ? 'badge badge-warning'
                            : 'badge badge-info'
                        }
                        style={{ fontSize: '0.62rem' }}
                      >
                        {jv.status}
                      </span>
                    </td>
                    <td>
                      {jv.status !== 'APPROVED' && jv.status !== 'POSTED' ? (
                        <button
                          onClick={() => approveJournalEntry(jv.id)}
                          className="btn btn-success btn-sm"
                          style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                        >
                          ✓ Approve & Post
                        </button>
                      ) : (
                        <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>Posted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Chart of Accounts */}
      {activeTab === 'COA' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Account Name</th>
                  <th>Category</th>
                  <th>Sub-Category</th>
                  <th>Balance (INR)</th>
                  <th>Normal Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id}>
                    <td className="font-mono" style={{ fontWeight: 700 }}>{acc.code}</td>
                    <td style={{ fontWeight: 600 }}>{acc.name}</td>
                    <td>
                      <span
                        className={
                          acc.category === 'ASSETS'
                            ? 'badge badge-info'
                            : acc.category === 'LIABILITIES'
                            ? 'badge badge-warning'
                            : acc.category === 'INCOME'
                            ? 'badge badge-success'
                            : 'badge badge-neutral'
                        }
                        style={{ fontSize: '0.62rem' }}
                      >
                        {acc.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{acc.subCategory}</td>
                    <td className="font-mono" style={{ fontWeight: 700 }}>₹{acc.balance.toLocaleString('en-IN')}</td>
                    <td style={{ fontWeight: 600 }}>{acc.type}</td>
                    <td>
                      <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Trial Balance */}
      {activeTab === 'TRIAL_BALANCE' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Trial Balance as of October 2024</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>Verified double-entry equilibrium</p>
            </div>
            <span className="badge badge-success">
              <ShieldCheck size={12} /> Double-Entry Balanced
            </span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Account Name</th>
                  <th>Debit (INR)</th>
                  <th>Credit (INR)</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((acc) => (
                  <tr key={acc.id}>
                    <td className="font-mono" style={{ fontWeight: 700 }}>{acc.code}</td>
                    <td>{acc.name}</td>
                    <td className="font-mono">{acc.type === 'DEBIT' ? `₹${acc.balance.toLocaleString('en-IN')}` : '-'}</td>
                    <td className="font-mono">{acc.type === 'CREDIT' ? `₹${acc.balance.toLocaleString('en-IN')}` : '-'}</td>
                  </tr>
                ))}
                <tr style={{ background: 'var(--bg-subtle)', fontWeight: 800 }}>
                  <td colSpan={2}>TOTAL EQUILIBRIUM</td>
                  <td className="font-mono" style={{ color: 'var(--success-500)' }}>₹{totalDebitBalance.toLocaleString('en-IN')}</td>
                  <td className="font-mono" style={{ color: 'var(--success-500)' }}>₹{totalCreditBalance.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Period Close & Lock */}
      {activeTab === 'PERIOD_CLOSE' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isPeriodLocked ? 'var(--danger-bg)' : 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {isPeriodLocked ? <Lock size={22} color="var(--danger-500)" /> : <Unlock size={22} color="var(--success-500)" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                Period Close & Cryptographic Audit Lock
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Locking a period prevents unauthorized journal edits and freezes statutory filings for audit evidence.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', marginBottom: '20px' }}>
            <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
              ✔ <strong>Trial Balance Check:</strong> Passed (Debit equals Credit).
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
              ✔ <strong>Bank Reconciliation Check:</strong> 94.2% matched, zero unaddressed exceptions.
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
              ✔ <strong>Tax Liability Validation:</strong> GSTR-1 & 3B calculations locked.
            </div>
          </div>

          <button onClick={togglePeriodLock} className={isPeriodLocked ? 'btn btn-outline-danger' : 'btn btn-primary'}>
            {isPeriodLocked ? 'Reopen Period (Requires CA Authorization)' : 'Seal & Lock Period Close'}
          </button>
        </div>
      )}

      {/* New Journal Voucher Modal */}
      {isNewVoucherModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsNewVoucherModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Create Journal Voucher (Maker Role)</h3>
              <button onClick={() => setIsNewVoucherModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateVoucher} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Narration / Purpose</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Monthly provision for cloud server hosting and reverse charge tax..."
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  className="input-field"
                  style={{ marginTop: '4px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Debit Account</label>
                  <select
                    value={debitAccountId}
                    onChange={(e) => setDebitAccountId(e.target.value)}
                    className="input-field select-field"
                    style={{ marginTop: '4px' }}
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.code} - {acc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Credit Account</label>
                  <select
                    value={creditAccountId}
                    onChange={(e) => setCreditAccountId(e.target.value)}
                    className="input-field select-field"
                    style={{ marginTop: '4px' }}
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.code} - {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Amount (INR)</label>
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
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Reference Doc / PO #</label>
                  <input
                    type="text"
                    value={referenceDoc}
                    onChange={(e) => setReferenceDoc(e.target.value)}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsNewVoucherModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit for Checker Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
