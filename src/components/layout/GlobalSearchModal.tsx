import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  FileText,
  AlertTriangle,
  BookOpen,
  Landmark,
  Building,
  CheckSquare,
  AlertOctagon,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    clients,
    switchClient,
    invoices,
    tasks,
    journalEntries,
    statutoryNotices,
    riskExceptions,
    documents,
    setActiveView
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut Ctrl/Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(!isSearchModalOpen);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const q = query.toLowerCase().trim();

  const matchedClients = q
    ? clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.gstin.toLowerCase().includes(q) ||
          c.pan.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q)
      )
    : clients.slice(0, 3);

  const matchedInvoices = q
    ? invoices.filter(
        (i) =>
          i.invoiceNumber.toLowerCase().includes(q) ||
          i.partyName.toLowerCase().includes(q) ||
          i.partyGstin.toLowerCase().includes(q) ||
          (i.irn && i.irn.toLowerCase().includes(q))
      )
    : [];

  const matchedTasks = q
    ? tasks.filter((t) => t.title.toLowerCase().includes(q) || t.clientName.toLowerCase().includes(q))
    : [];

  const matchedNotices = q
    ? statutoryNotices.filter(
        (n) =>
          n.noticeId.toLowerCase().includes(q) ||
          n.title.toLowerCase().includes(q) ||
          n.section.toLowerCase().includes(q)
      )
    : [];

  const matchedExceptions = q
    ? riskExceptions.filter((e) => e.code.toLowerCase().includes(q) || e.title.toLowerCase().includes(q))
    : [];

  const matchedJournals = q
    ? journalEntries.filter((j) => j.voucherNumber.toLowerCase().includes(q) || j.narration.toLowerCase().includes(q))
    : [];

  const totalMatches =
    matchedClients.length +
    matchedInvoices.length +
    matchedTasks.length +
    matchedNotices.length +
    matchedExceptions.length +
    matchedJournals.length;

  return (
    <div className="modal-backdrop" onClick={() => setIsSearchModalOpen(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
      >
        {/* Search Input Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-subtle)'
          }}
        >
          <Search size={20} color="var(--primary-500)" />
          <input
            autoFocus
            type="text"
            placeholder="Search invoice, PAN, GSTIN, notice, journal voucher, client..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              fontFamily: 'inherit'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '420px', overflowY: 'auto', padding: '12px 16px' }}>
          {/* Quick Suggestions / Clients */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
              Clients & Entities
            </div>
            {matchedClients.map((client) => (
              <div
                key={client.id}
                onClick={() => {
                  switchClient(client.id);
                  setActiveView('client-360');
                  setIsSearchModalOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  marginBottom: '4px'
                }}
                className="glass-panel-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Building size={16} color="var(--primary-500)" />
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{client.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      GSTIN: {client.gstin} • PAN: {client.pan}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>BHS {client.bhsScore}</span>
                  <ArrowRight size={14} color="var(--text-muted)" />
                </div>
              </div>
            ))}
          </div>

          {/* Invoices */}
          {matchedInvoices.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                Invoices & Bills
              </div>
              {matchedInvoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => {
                    switchClient(inv.clientId);
                    setActiveView(inv.partyType === 'CUSTOMER' ? 'ar' : 'ap');
                    setIsSearchModalOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                  className="glass-panel-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={16} color="var(--info-500)" />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>
                        {inv.invoiceNumber} — {inv.partyName}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        ₹{inv.grandTotal.toLocaleString('en-IN')} • {inv.type}
                      </div>
                    </div>
                  </div>
                  <span className={inv.status === 'PAID' ? 'badge badge-success' : 'badge badge-warning'} style={{ fontSize: '0.62rem' }}>
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Notices */}
          {matchedNotices.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                Statutory Notices
              </div>
              {matchedNotices.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    switchClient(n.clientId);
                    setActiveView('notices');
                    setIsSearchModalOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                  className="glass-panel-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertOctagon size={16} color="var(--danger-500)" />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{n.noticeId}: {n.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {n.authority} • {n.section}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-danger" style={{ fontSize: '0.62rem' }}>{n.status}</span>
                </div>
              ))}
            </div>
          )}

          {/* Exceptions */}
          {matchedExceptions.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                Risk & Exceptions
              </div>
              {matchedExceptions.map((exp) => (
                <div
                  key={exp.id}
                  onClick={() => {
                    switchClient(exp.clientId);
                    setActiveView('exceptions');
                    setIsSearchModalOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                  className="glass-panel-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={16} color="var(--warning-500)" />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{exp.code}: {exp.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{exp.clientName}</div>
                    </div>
                  </div>
                  <span className="badge badge-warning" style={{ fontSize: '0.62rem' }}>{exp.severity}</span>
                </div>
              ))}
            </div>
          )}

          {/* Journal Entries */}
          {matchedJournals.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                Journal Entries
              </div>
              {matchedJournals.map((j) => (
                <div
                  key={j.id}
                  onClick={() => {
                    setActiveView('accounting');
                    setIsSearchModalOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    marginBottom: '4px'
                  }}
                  className="glass-panel-hover"
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <BookOpen size={16} color="var(--primary-500)" />
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600 }}>{j.voucherNumber}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{j.narration}</div>
                    </div>
                  </div>
                  <span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>₹{j.totalDebit.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}

          {query && totalMatches === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
              <Search size={32} style={{ margin: '0 auto 12px auto', opacity: 0.4 }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>No records found for "{query}"</div>
              <div style={{ fontSize: '0.78rem', marginTop: '4px' }}>Try searching by invoice number, vendor name, GSTIN or notice reference.</div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: 'var(--text-muted)'
          }}
        >
          <div style={{ display: 'flex', gap: '12px' }}>
            <span><kbd className="font-mono">↑↓</kbd> to navigate</span>
            <span><kbd className="font-mono">↵</kbd> to select</span>
            <span><kbd className="font-mono">ESC</kbd> to close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--ai-purple)' }}>
            <Sparkles size={12} /> Vertofi Smart Index
          </div>
        </div>
      </div>
    </div>
  );
};
