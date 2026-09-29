import React, { useState } from 'react';
import {
  History,
  Shield,
  Search,
  Filter,
  Download,
  Fingerprint,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { LineageViewer } from '../../components/common/LineageViewer';

export const AuditTrailView: React.FC = () => {
  const { auditLogs, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModule, setSelectedModule] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedModule !== 'ALL' && log.module !== selectedModule) return false;
    if (
      searchQuery &&
      !log.userName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.resourceId.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !log.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={24} color="var(--primary-500)" /> Immutable Audit Trail & Forensics
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Cryptographically Chained Event Log with Timestamp, IP Metadata, User Role & Before/After Diffs.
          </p>
        </div>

        <button
          onClick={() => showToast('Audit Export Generated', 'Downloaded SHA-256 verified CSV audit export.', 'success')}
          className="btn btn-secondary btn-sm"
        >
          <Download size={14} /> Export Tamper-Proof Audit Log
        </button>
      </div>

      {/* Chained Lineage Viewer */}
      <LineageViewer />

      {/* Filter Bar */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px', maxWidth: '380px' }}>
          <Search size={16} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search by user, resource ID, or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field"
            style={{ padding: '6px 10px', fontSize: '0.8rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto' }}>
          {['ALL', 'ACCOUNTING', 'TAX', 'BANK_RECON', 'APPROVALS', 'DOCUMENTS', 'SETTINGS'].map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={selectedModule === mod ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ fontSize: '0.72rem', padding: '4px 10px' }}
            >
              {mod.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Timestamp (IST)</th>
              <th>Professional / User</th>
              <th>Role</th>
              <th>Client Entity</th>
              <th>Module</th>
              <th>Action</th>
              <th>Resource ID</th>
              <th>Audit Payload / Diff</th>
              <th>IP & Device Metadata</th>
              <th>SHA-256 Hash</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{log.timestamp}</td>
                <td style={{ fontWeight: 700 }}>{log.userName}</td>
                <td><span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>{log.userRole}</span></td>
                <td style={{ fontSize: '0.78rem' }}>{log.clientName}</td>
                <td><span className="badge badge-neutral" style={{ fontSize: '0.62rem' }}>{log.module}</span></td>
                <td>
                  <span
                    className={
                      log.action === 'APPROVED' || log.action === 'RECONCILED'
                        ? 'badge badge-success'
                        : log.action === 'OVERRIDDEN'
                        ? 'badge badge-warning'
                        : 'badge badge-info'
                    }
                    style={{ fontSize: '0.62rem' }}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="font-mono" style={{ fontWeight: 700 }}>{log.resourceId}</td>
                <td style={{ fontSize: '0.74rem', maxWidth: '240px' }}>
                  {log.newValue || log.resource}
                </td>
                <td style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{log.ipAddress}</td>
                <td className="font-mono" style={{ fontSize: '0.66rem', color: 'var(--primary-500)' }}>
                  {log.recordHash.substring(0, 14)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
