import React, { useState } from 'react';
import {
  Globe2,
  Copy,
  Check,
  Building,
  Plus,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Sparkles,
  Link2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ConnectedBusiness } from '../../types';

export const BusinessSyncView: React.FC = () => {
  const { currentUser } = useAuth();
  const {
    connectedBusinesses,
    connectBusinessViaCaId,
    showToast,
    setActiveView,
    switchClient,
    clients
  } = useApp();

  const [copiedCaId, setCopiedCaId] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState<string | null>(null);

  // Form State for new connection
  const [businessName, setBusinessName] = useState('');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const activeCaId = currentUser.caIdNumber || currentUser.membershipNumber || 'V-CA-84920';

  const handleCopyCaId = () => {
    navigator.clipboard.writeText(activeCaId);
    setCopiedCaId(true);
    showToast('CA ID Copied', `CA ID ${activeCaId} copied to clipboard. Share with clients on the Business Portal.`, 'success');
    setTimeout(() => setCopiedCaId(false), 2500);
  };

  const handleManualConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !gstin || !pan) {
      showToast('Validation Error', 'Please complete business name, GSTIN and PAN.', 'error');
      return;
    }

    connectBusinessViaCaId({
      businessName,
      gstin,
      pan,
      contactPerson: contactPerson || 'Authorized Finance Officer',
      contactEmail: contactEmail || 'finance@business.in'
    });

    setIsConnectModalOpen(false);
    setBusinessName('');
    setGstin('');
    setPan('');
    setContactPerson('');
    setContactEmail('');
  };

  const handleSyncNow = (id: string, name: string) => {
    setIsSyncing(id);
    setTimeout(() => {
      setIsSyncing(null);
      showToast('Live Feed Synchronized', `${name} ledger, bank feeds, and invoices refreshed in real time.`, 'success');
    }, 1200);
  };

  const filteredBusinesses = connectedBusinesses.filter(
    (b) =>
      b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.pan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        className="glass-panel"
        style={{
          padding: '24px 28px',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          color: '#FFFFFF',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Globe2 size={24} color="#FFFFFF" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Vertofi Business Portal Integration
              </h1>
              <p style={{ fontSize: '0.8rem', color: '#E0E7FF', marginTop: '2px' }}>
                Multi-Panel Bridge: Real-time sync between Business Portal, CA Workspace, and Legal Defense
              </p>
            </div>
          </div>
        </div>

        {/* CA ID Copier Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C7D2FE', fontWeight: 700 }}>
              Your Official CA ID No.
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: '#FFFFFF', letterSpacing: '0.04em' }}>
              {activeCaId}
            </div>
          </div>

          <button
            onClick={handleCopyCaId}
            style={{
              background: '#FFFFFF',
              color: '#312E81',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 14px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
            }}
          >
            {copiedCaId ? <Check size={15} color="#16A34A" /> : <Copy size={15} />}
            {copiedCaId ? 'Copied!' : 'Copy CA ID'}
          </button>
        </div>
      </div>

      {/* How it Works / 3-Step Connection Guide */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
              1
            </span>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Client Enters CA ID No.</h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Client signs into their <strong>Vertofi Business Portal</strong> and enters your CA ID (<strong className="font-mono">{activeCaId}</strong>) under "Assign Chartered Accountant".
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
              2
            </span>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Automated Live Sync</h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            Business transactions, bank feeds, and supplier invoices flow directly to your professional workbench for maker-checker validation and tax preparation.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#FAF5FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.82rem' }}>
              3
            </span>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>Live Queries & Notifications</h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
            When clients raise questions on invoices or tax notices, you receive immediate notifications with direct two-way resolution capabilities.
          </p>
        </div>
      </div>

      {/* Connected Businesses Table Section */}
      <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Connected Business Clients ({connectedBusinesses.length})
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
              Live businesses linked to your CA Partner ID <strong className="font-mono">{activeCaId}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search by name, GSTIN, PAN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field"
                style={{ paddingLeft: '36px', width: '260px', height: '38px', fontSize: '0.8rem' }}
              />
            </div>

            <button
              onClick={() => setIsConnectModalOpen(true)}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '38px' }}
            >
              <Plus size={15} /> Connect Business Client
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Business Entity & PAN</th>
                <th>GSTIN</th>
                <th>Connected Via</th>
                <th>Annual Turnover</th>
                <th>Key Contact</th>
                <th>Last Live Sync</th>
                <th>Sync Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((b) => (
                <tr key={b.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '8px',
                          background: 'var(--bg-app)',
                          border: '1px solid var(--border-strong)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Building size={18} color="var(--primary-600)" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                          {b.businessName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                          PAN: {b.pan}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge font-mono" style={{ background: '#EEF2FF', color: '#4F46E5', fontWeight: 700 }}>
                      {b.gstin}
                    </span>
                  </td>
                  <td>
                    <span className="badge font-mono" style={{ background: '#FAF5FF', color: '#9333EA', fontWeight: 700 }}>
                      {b.connectedViaCaId}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700 }}>{b.annualTurnover}</td>
                  <td>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600 }}>{b.contactPerson}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{b.contactEmail}</div>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{b.lastSyncedAt}</td>
                  <td>
                    <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                      Live Connected
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => handleSyncNow(b.id, b.businessName)}
                        disabled={isSyncing === b.id}
                        className="btn btn-secondary btn-sm"
                        title="Force sync live feed"
                      >
                        <RefreshCw size={13} className={isSyncing === b.id ? 'spin' : ''} />
                      </button>
                      <button
                        onClick={() => {
                          const clientMatch = clients.find((c) => c.pan === b.pan);
                          if (clientMatch) {
                            switchClient(clientMatch.id);
                          }
                          setActiveView('client-360');
                        }}
                        className="btn btn-primary btn-sm"
                      >
                        Open 360 View <ArrowRight size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Connect Business Modal */}
      {isConnectModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsConnectModalOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '540px',
              background: 'var(--bg-card)',
              borderRadius: '20px',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link2 size={22} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Connect New Business Client</h3>
              </div>
              <span className="badge badge-neutral font-mono">CA ID: {activeCaId}</span>
            </div>

            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.4 }}>
              Enter the business details to issue a connection link with your CA ID. The business will immediately appear in your workspace.
            </p>

            <form onSubmit={handleManualConnect} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                  Business Legal Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Apex Omnichannel Retail Pvt Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    GSTIN
                  </label>
                  <input
                    type="text"
                    placeholder="27AABCA1234F1Z8"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    className="input-field font-mono"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Company PAN
                  </label>
                  <input
                    type="text"
                    placeholder="AABCA1234F"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    className="input-field font-mono"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rajesh Khurana (CFO)"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    placeholder="finance@apexretail.in"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsConnectModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <CheckCircle2 size={16} /> Link & Connect Business
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
