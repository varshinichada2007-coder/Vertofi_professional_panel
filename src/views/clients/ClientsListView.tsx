import React, { useState } from 'react';
import {
  Users,
  Building,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClientEntity } from '../../types';

export const ClientsListView: React.FC = () => {
  const { clients, switchClient, setActiveView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'ACTIVE' | 'HIGH_RISK' | 'COMPLIANCE_DUE'>('ALL');

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.gstin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.pan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterCategory === 'ACTIVE') return c.status === 'ACTIVE';
    if (filterCategory === 'HIGH_RISK') return c.status === 'HIGH_RISK' || c.exceptionsCount > 0;
    if (filterCategory === 'COMPLIANCE_DUE') return c.complianceHealth < 85;
    return true;
  });

  const handleOpenClient360 = (clientId: string) => {
    switchClient(clientId);
    setActiveView('client-360');
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={24} color="var(--primary-500)" /> Client Entity Directory & 360 Workspace
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Multi-client ledger governance, statutory compliance health, and BHS audit matrices.
          </p>
        </div>

        <button onClick={() => setActiveView('client-360')} className="btn btn-primary btn-sm">
          <Plus size={14} /> Onboard New Business Entity
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px', maxWidth: '400px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by client name, GSTIN, PAN, or sector..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {(['ALL', 'ACTIVE', 'HIGH_RISK', 'COMPLIANCE_DUE'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={filterCategory === cat ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ fontSize: '0.72rem', padding: '4px 10px' }}
            >
              {cat.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Client Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Business Entity</th>
              <th>Sector / Industry</th>
              <th>PAN & GSTIN</th>
              <th>Assigned Professional</th>
              <th>Compliance Health</th>
              <th>BHS Score</th>
              <th>Open Items</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '48px 24px' }}>
                  <Building size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '6px' }}>No Client Entities Found</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '16px' }}>
                    {clients.length === 0
                      ? 'No business clients exist in MongoDB yet. Onboard your first client to start managing compliance, books, and taxes.'
                      : 'No clients match your filter or search criteria.'}
                  </p>
                  {clients.length === 0 && (
                    <button onClick={() => setActiveView('client-360')} className="btn btn-primary btn-sm">
                      <Plus size={14} /> Onboard First Client
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredClients.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => handleOpenClient360(client.id)}
                  style={{ cursor: 'pointer' }}
                  className="glass-panel-hover"
                >
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: client.status === 'HIGH_RISK' ? 'var(--danger-bg)' : 'var(--bg-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: client.status === 'HIGH_RISK' ? '1px solid var(--danger-border)' : '1px solid var(--border-subtle)'
                      }}
                    >
                      <Building size={16} color={client.status === 'HIGH_RISK' ? 'var(--danger-500)' : 'var(--primary-500)'} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.86rem' }}>{client.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{client.cin || 'Private Limited'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{client.industry}</td>
                <td>
                  <div className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 600 }}>{client.pan}</div>
                  <div className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{client.gstin}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{client.assignedProfessionalName}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Last active: {client.lastActivity}</div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ flex: 1, width: '70px', height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${client.complianceHealth}%`,
                          height: '100%',
                          backgroundColor: client.complianceHealth > 85 ? 'var(--success-500)' : client.complianceHealth > 70 ? 'var(--warning-500)' : 'var(--danger-500)'
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>{client.complianceHealth}%</span>
                  </div>
                </td>
                <td>
                  <span
                    className={client.bhsScore > 85 ? 'badge badge-success' : client.bhsScore > 70 ? 'badge badge-warning' : 'badge badge-danger'}
                    style={{ fontSize: '0.72rem' }}
                  >
                    <HeartPulse size={12} /> {client.bhsScore}/100
                  </span>
                </td>
                <td>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    <span>Tasks: <strong>{client.openTasksCount}</strong></span> • <span>Risk: <strong style={{ color: client.exceptionsCount > 0 ? 'var(--danger-500)' : 'inherit' }}>{client.exceptionsCount}</strong></span>
                  </div>
                </td>
                <td>
                  <span className={client.status === 'HIGH_RISK' ? 'badge badge-danger' : 'badge badge-success'} style={{ fontSize: '0.65rem' }}>
                    {client.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenClient360(client.id);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    Client 360 <ArrowRight size={12} />
                  </button>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
