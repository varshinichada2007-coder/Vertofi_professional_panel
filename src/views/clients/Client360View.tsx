import React, { useState } from 'react';
import {
  Building,
  DollarSign,
  BookOpen,
  ShieldCheck,
  FileText,
  CreditCard,
  FolderLock,
  CheckSquare,
  AlertOctagon,
  CheckCheck,
  MessageSquare,
  History,
  Phone,
  Mail,
  MapPin,
  HeartPulse,
  Sparkles,
  ExternalLink,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LineageViewer } from '../../components/common/LineageViewer';

export const Client360View: React.FC = () => {
  const {
    currentClient,
    accounts,
    journalEntries,
    invoices,
    tasks,
    statutoryNotices,
    approvals,
    documents,
    riskExceptions,
    auditLogs,
    setActiveView,
    setIsAiDrawerOpen
  } = useApp();

  type TabKey =
    | 'OVERVIEW'
    | 'FINANCIALS'
    | 'ACCOUNTING'
    | 'TAX'
    | 'INVOICES'
    | 'PAYMENTS'
    | 'DOCUMENTS'
    | 'TASKS'
    | 'NOTICES'
    | 'APPROVALS'
    | 'COMMUNICATION'
    | 'TIMELINE';

  const [activeTab, setActiveTab] = useState<TabKey>('OVERVIEW');

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'OVERVIEW', label: 'Overview', icon: Building },
    { key: 'FINANCIALS', label: 'Financials', icon: DollarSign },
    { key: 'ACCOUNTING', label: 'Accounting & GL', icon: BookOpen },
    { key: 'TAX', label: 'Tax & GST/TDS', icon: ShieldCheck },
    { key: 'INVOICES', label: 'Invoices & Bills', icon: FileText },
    { key: 'PAYMENTS', label: 'Payments', icon: CreditCard },
    { key: 'DOCUMENTS', label: 'Documents', icon: FolderLock },
    { key: 'TASKS', label: 'Tasks', icon: CheckSquare },
    { key: 'NOTICES', label: 'Notices', icon: AlertOctagon },
    { key: 'APPROVALS', label: 'Approvals', icon: CheckCheck },
    { key: 'COMMUNICATION', label: 'Communication', icon: MessageSquare },
    { key: 'TIMELINE', label: 'Activity Lineage', icon: History }
  ];

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Client 360 Header Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)',
          borderColor: '#E0E7FF',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-strong)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Building size={24} color="var(--primary-500)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{currentClient.name}</h1>
              <span className="badge badge-success">{currentClient.status}</span>
              <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>BHS {currentClient.bhsScore}/100</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', flexWrap: 'wrap' }}>
              <span>PAN: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{currentClient.pan}</strong></span>
              <span>•</span>
              <span>GSTIN: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{currentClient.gstin}</strong></span>
              <span>•</span>
              <span>CIN: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{currentClient.cin || 'U72900MH2021PTC361284'}</strong></span>
              <span>•</span>
              <span>Industry: <strong style={{ color: 'var(--text-primary)' }}>{currentClient.industry}</strong></span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsAiDrawerOpen(true)} className="btn btn-secondary btn-sm pulse-ai" style={{ color: 'var(--ai-purple)' }}>
            <Sparkles size={14} /> AI Copilot Deep Dive
          </button>
          <button onClick={() => setActiveView('tasks')} className="btn btn-primary btn-sm">
            <Plus size={14} /> New Task
          </button>
        </div>
      </div>

      {/* 12-Tab Navigation Bar */}
      <div className="tab-list">
        {tabs.map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <div
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`tab-item ${isActive ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IconComp size={15} color={isActive ? 'var(--primary-500)' : 'currentColor'} />
              <span>{tab.label}</span>
            </div>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'OVERVIEW' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive KPI summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>ANNUAL TURNOVER (FY 24-25)</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px' }}>₹4.28 Cr</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success-500)', marginTop: '2px' }}>Verified against Books</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>COMPLIANCE HEALTH</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--success-500)' }}>94%</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Zero pending returns</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>OUTSTANDING RECEIVABLES</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--info-500)' }}>₹22.84 L</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>DSO: 34 Days</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>OUTSTANDING PAYABLES</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, marginTop: '4px', color: 'var(--warning-500)' }}>₹11.45 L</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>DPO: 28 Days</div>
            </div>
          </div>

          {/* Business & Governance Details */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Corporate & Contact Profile</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Key Contact Person:</span>
                  <span style={{ fontWeight: 600 }}>{currentClient.contactPerson}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Official Email:</span>
                  <span style={{ fontWeight: 600 }}>{currentClient.contactEmail}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Phone:</span>
                  <span style={{ fontWeight: 600 }}>{currentClient.contactPhone}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Registered Office:</span>
                  <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{currentClient.address}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Assigned Professional Team</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>CA Vikramaditya Sharma</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Lead CA & Partner Signoff</div>
                  </div>
                  <span className="badge badge-success">Lead Partner</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Rohan Mehta</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Senior Accountant (Maker)</div>
                  </div>
                  <span className="badge badge-neutral">Maker</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Divya Krishnan</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fractional CFO / Treasury</div>
                  </div>
                  <span className="badge badge-ai">Advisory</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Financials */}
      {activeTab === 'FINANCIALS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>Executive Financial Summary (FY 2024-25)</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Metric</th>
                    <th>Current Period (Q3)</th>
                    <th>YTD FY 24-25</th>
                    <th>Previous FY 23-24</th>
                    <th>Variance (%)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Revenue from Operations (Gross)</td>
                    <td>₹1,42,50,000</td>
                    <td>₹4,28,00,000</td>
                    <td>₹3,60,00,000</td>
                    <td style={{ color: 'var(--success-500)', fontWeight: 600 }}>+18.8%</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Cost of Services & Infrastructure</td>
                    <td>₹32,40,000</td>
                    <td>₹98,00,000</td>
                    <td>₹84,00,000</td>
                    <td style={{ color: 'var(--warning-500)' }}>+16.6%</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700 }}>Employee Benefits Expense</td>
                    <td>₹71,00,000</td>
                    <td>₹2,14,00,000</td>
                    <td>₹1,80,00,000</td>
                    <td style={{ color: 'var(--warning-500)' }}>+18.8%</td>
                  </tr>
                  <tr style={{ background: 'var(--bg-subtle)' }}>
                    <td style={{ fontWeight: 800 }}>EBITDA (Operating Profit)</td>
                    <td style={{ fontWeight: 800, color: 'var(--success-500)' }}>₹39,10,000</td>
                    <td style={{ fontWeight: 800, color: 'var(--success-500)' }}>₹1,16,00,000</td>
                    <td style={{ fontWeight: 800 }}>₹96,00,000</td>
                    <td style={{ color: 'var(--success-500)', fontWeight: 800 }}>+20.8%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Accounting */}
      {activeTab === 'ACCOUNTING' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>General Ledger & Chart of Accounts</h3>
            <button onClick={() => setActiveView('accounting')} className="btn btn-secondary btn-sm">
              Open Full Accounting Workspace →
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Account Code</th>
                  <th>Account Name</th>
                  <th>Category</th>
                  <th>Sub-Category</th>
                  <th>Type</th>
                  <th>Balance (INR)</th>
                  <th>Reconciliation</th>
                </tr>
              </thead>
              <tbody>
                {accounts.slice(0, 8).map((acc) => (
                  <tr key={acc.id}>
                    <td className="font-mono" style={{ fontWeight: 700 }}>{acc.code}</td>
                    <td style={{ fontWeight: 600 }}>{acc.name}</td>
                    <td><span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>{acc.category}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{acc.subCategory}</td>
                    <td style={{ fontWeight: 600 }}>{acc.type}</td>
                    <td className="font-mono" style={{ fontWeight: 700 }}>₹{acc.balance.toLocaleString('en-IN')}</td>
                    <td>
                      {acc.isReconciled ? (
                        <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>Reconciled</span>
                      ) : (
                        <span className="badge badge-warning" style={{ fontSize: '0.62rem' }}>Unreconciled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Tax */}
      {activeTab === 'TAX' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>GST & TDS Statutory Records</h3>
            <button onClick={() => setActiveView('tax')} className="btn btn-secondary btn-sm">
              Open Tax Center →
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-500)' }}>GSTR-1 Outward Supplies</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '6px' }}>₹34.20 Lakhs Taxable</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--success-500)', marginTop: '2px' }}>ARN Generated: AA2709240182910</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--warning-500)' }}>GSTR-3B Summary Return</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '6px' }}>₹12.40 Lakhs Cash Due</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--warning-500)', marginTop: '2px' }}>Due Tomorrow (20th Oct)</div>
            </div>
            <div className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--info-500)' }}>TDS Challan 281 Matched</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '6px' }}>₹8.90 Lakhs Deducted</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>Form 26Q Draft Ready</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Invoices */}
      {activeTab === 'INVOICES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Invoices & e-Invoice IRN Records</h3>
            <button onClick={() => setActiveView('ar')} className="btn btn-secondary btn-sm">
              Create Invoice →
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Party Name</th>
                  <th>Date</th>
                  <th>Taxable Amount</th>
                  <th>GST</th>
                  <th>Grand Total</th>
                  <th>Status</th>
                  <th>e-Invoice IRN</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="font-mono" style={{ fontWeight: 700 }}>{inv.invoiceNumber}</td>
                    <td style={{ fontWeight: 600 }}>{inv.partyName}</td>
                    <td>{inv.date}</td>
                    <td className="font-mono">₹{inv.subtotal.toLocaleString('en-IN')}</td>
                    <td className="font-mono">₹{inv.totalTax.toLocaleString('en-IN')}</td>
                    <td className="font-mono" style={{ fontWeight: 700 }}>₹{inv.grandTotal.toLocaleString('en-IN')}</td>
                    <td>
                      <span className={inv.status === 'PAID' ? 'badge badge-success' : 'badge badge-warning'} style={{ fontSize: '0.62rem' }}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="font-mono" style={{ fontSize: '0.66rem', color: 'var(--primary-500)' }}>
                      {inv.irn ? `${inv.irn.substring(0, 16)}...` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 6: Payments */}
      {activeTab === 'PAYMENTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Bank Receipts & Vendor Payments</h3>
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              14 bank receipts and 8 vendor disbursements cleared for FY 24-25. Total inward cash: <strong>₹1.42 Cr</strong>. Total outward vendor payments: <strong>₹48.50 L</strong>.
            </div>
            <div style={{ marginTop: '14px' }}>
              <button onClick={() => setActiveView('reconciliation')} className="btn btn-secondary btn-sm">
                View Bank Reconciliation Queue →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: Documents */}
      {activeTab === 'DOCUMENTS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Virtual Data Room & OCR Evidence</h3>
            <button onClick={() => setActiveView('documents')} className="btn btn-secondary btn-sm">
              Manage All Documents →
            </button>
          </div>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Document Title</th>
                  <th>Category</th>
                  <th>File Size</th>
                  <th>Uploaded By</th>
                  <th>OCR Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.title}</td>
                    <td><span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>{d.category}</span></td>
                    <td style={{ color: 'var(--text-muted)' }}>{d.fileSize}</td>
                    <td>{d.uploadedBy}</td>
                    <td>
                      <span className="badge badge-ai" style={{ fontSize: '0.62rem' }}>
                        {d.ocrConfidence}% OCR
                      </span>
                    </td>
                    <td><span className="badge badge-success" style={{ fontSize: '0.62rem' }}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 8: Tasks */}
      {activeTab === 'TASKS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Open & Assigned Tasks for {currentClient.name}</h3>
            <button onClick={() => setActiveView('tasks')} className="btn btn-secondary btn-sm">
              Go to Workbench →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasks.filter((t) => t.clientId === currentClient.id).map((t) => (
              <div key={t.id} className="glass-panel" style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{t.title}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Assigned to: {t.assignedToName} • Due: {t.dueDate}
                  </div>
                </div>
                <span className="badge badge-primary">{t.status.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 9: Notices */}
      {activeTab === 'NOTICES' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Statutory Notice Trackers</h3>
            <button onClick={() => setActiveView('notices')} className="btn btn-secondary btn-sm">
              Notice Centre →
            </button>
          </div>
          {statutoryNotices.map((n) => (
            <div key={n.id} className="glass-panel" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{n.noticeId}: {n.title}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Authority: {n.authority} • Section: {n.section}
                  </div>
                </div>
                <span className="badge badge-danger">{n.daysRemaining} days left</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                {n.description}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 10: Approvals */}
      {activeTab === 'APPROVALS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Maker-Checker Authorization Queue</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {approvals.map((a) => (
              <div key={a.id} className="glass-panel" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{a.title}</div>
                  <span className="badge badge-warning">{a.status}</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Requested by: {a.requestedBy} • Amount: <strong>₹{a.amount.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 11: Communication */}
      {activeTab === 'COMMUNICATION' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '12px' }}>Client Message & Document Request Log</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
            <div style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary-500)' }}>Document Request Sent to Karan Singhania</div>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>Requested FIRC Bank Advice for foreign SaaS remittances received in HDFC A/c.</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>Sent 2026-10-17 11:00 IST</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 12: Activity Timeline */}
      {activeTab === 'TIMELINE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <LineageViewer />
        </div>
      )}
    </div>
  );
};
