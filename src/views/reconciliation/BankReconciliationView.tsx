import React, { useState } from 'react';
import {
  Landmark,
  GitMerge,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BankReconciliationView: React.FC = () => {
  const { bankAccounts, bankTransactions, reconcileTransaction, showToast } = useApp();
  const [selectedAccountId, setSelectedAccountId] = useState(bankAccounts[0]?.id || '');

  const currentAccount = bankAccounts.find((b) => b.id === selectedAccountId) || bankAccounts[0];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={24} color="var(--primary-500)" /> Bank Feeds & Intelligent Auto-Reconciliation
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Multi-Bank Feeds (HDFC, ICICI, SBI) with Heuristic Hash Matching & AI Explanation Engine.
          </p>
        </div>

        <button
          onClick={() => showToast('Bank Feeds Refreshed', 'Synced 48 new statement lines from direct bank open API.', 'success')}
          className="btn btn-secondary btn-sm"
        >
          <RefreshCw size={14} /> Refresh Direct Feeds
        </button>
      </div>

      {/* Bank Account Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
        {bankAccounts.map((acc) => (
          <div
            key={acc.id}
            onClick={() => setSelectedAccountId(acc.id)}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: acc.id === selectedAccountId ? 'var(--bg-card)' : 'var(--bg-subtle)',
              border: acc.id === selectedAccountId ? '1px solid var(--primary-500)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              boxShadow: acc.id === selectedAccountId ? 'var(--shadow-md)' : 'none'
            }}
            className="glass-panel-hover"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>{acc.bankName}</div>
                <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{acc.accountNumberMasked}</div>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>{acc.reconciliationRate}% Matched</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '14px', fontSize: '0.76rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Ledger Balance</div>
                <div className="font-mono" style={{ fontWeight: 700 }}>₹{acc.ledgerBalance.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Bank Feed Balance</div>
                <div className="font-mono" style={{ fontWeight: 700, color: 'var(--success-500)' }}>₹{acc.bankFeedBalance.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Unreconciled / Matched Transactions Queue */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Transaction Match & Reconcile Queue</h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>AI suggests match against invoice, payroll or vendor vouchers</p>
          </div>
          <span className="badge badge-ai">
            <Sparkles size={12} /> Heuristic Match Active
          </span>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Statement Narrative</th>
                <th>Reference #</th>
                <th>Type</th>
                <th>Amount (INR)</th>
                <th>AI Match Confidence</th>
                <th>Explanation & Citations</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bankTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td style={{ fontWeight: 600, maxWidth: '240px' }}>{tx.description}</td>
                  <td className="font-mono" style={{ fontSize: '0.72rem' }}>{tx.referenceNumber}</td>
                  <td>
                    <span className={tx.type === 'CREDIT' ? 'badge badge-success' : 'badge badge-danger'} style={{ fontSize: '0.62rem' }}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="font-mono" style={{ fontWeight: 700, color: tx.type === 'CREDIT' ? 'var(--success-500)' : 'inherit' }}>
                    {tx.type === 'CREDIT' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '45px', height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${tx.matchConfidence}%`,
                            height: '100%',
                            backgroundColor: tx.matchConfidence > 90 ? 'var(--success-500)' : tx.matchConfidence > 70 ? 'var(--warning-500)' : 'var(--danger-500)'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700 }}>{tx.matchConfidence}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', maxWidth: '220px' }}>
                    {tx.aiExplanation}
                  </td>
                  <td>
                    <span
                      className={
                        tx.status === 'MATCHED'
                          ? 'badge badge-success'
                          : tx.status === 'EXCEPTION'
                          ? 'badge badge-danger'
                          : 'badge badge-warning'
                      }
                      style={{ fontSize: '0.62rem' }}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    {tx.status !== 'MATCHED' ? (
                      <button
                        onClick={() => reconcileTransaction(tx.id)}
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '0.7rem', padding: '4px 8px' }}
                      >
                        ✓ 1-Click Reconcile
                      </button>
                    ) : (
                      <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>Reconciled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
