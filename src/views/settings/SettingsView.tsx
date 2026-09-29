import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Users,
  Building,
  CreditCard,
  Key,
  Lock,
  CheckCircle2,
  Sliders,
  Plus,
  Trash2,
  Eye,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const SettingsView: React.FC = () => {
  const { currentOrg, currentUser, availableUsers } = useAuth();
  const { clients, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'RBAC' | 'ORG' | 'TEAM' | 'SUBSCRIPTION' | 'SECURITY'>('RBAC');

  // RBAC permissions matrix state
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    CA: { accounting_rw: true, tax_approve: true, maker_approve: true, audit_export: true, delete_records: false },
    CMA: { accounting_rw: true, tax_approve: false, maker_approve: true, audit_export: true, delete_records: false },
    CS: { accounting_rw: false, tax_approve: false, maker_approve: false, audit_export: true, delete_records: false },
    ACCOUNTANT: { accounting_rw: true, tax_approve: false, maker_approve: false, audit_export: false, delete_records: false },
    CFO: { accounting_rw: true, tax_approve: true, maker_approve: true, audit_export: true, delete_records: false },
    AUDITOR: { accounting_rw: false, tax_approve: false, maker_approve: false, audit_export: true, delete_records: false }
  });

  const togglePermission = (role: string, perm: string) => {
    setMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [perm]: !prev[role]?.[perm]
      }
    }));
    showToast('RBAC Matrix Updated', `Updated permissions for ${role}`, 'info');
  };

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={24} color="var(--primary-500)" /> Administration, RBAC & Organization Settings
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Role-Based Access Control Matrix, Tenant Segregation, Team Allocations & Enterprise Subscriptions.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-list">
        {[
          { key: 'RBAC', label: 'RBAC Permission Matrix', icon: Shield },
          { key: 'ORG', label: 'Organization Profile', icon: Building },
          { key: 'TEAM', label: 'Team Members & Invites', icon: Users },
          { key: 'SUBSCRIPTION', label: 'Subscription & Usage Plans', icon: CreditCard },
          { key: 'SECURITY', label: 'MFA & API Keys', icon: Key }
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

      {/* Tab: RBAC Matrix */}
      {activeTab === 'RBAC' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Role-Based Access Control (RBAC) Matrix</h3>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Granular segregation of duties preventing unauthorized ledger tampering
              </p>
            </div>
            <span className="badge badge-success">
              <Shield size={12} /> Least-Privilege Enforced
            </span>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Accounting (Read/Write)</th>
                  <th>Statutory Tax Approve</th>
                  <th>Maker-Checker Signoff</th>
                  <th>Audit Trail Export</th>
                  <th>Delete Data (Super Admin Only)</th>
                </tr>
              </thead>
              <tbody>
                {(['CA', 'CMA', 'CS', 'ACCOUNTANT', 'CFO', 'AUDITOR'] as UserRole[]).map((role) => (
                  <tr key={role}>
                    <td style={{ fontWeight: 800, color: 'var(--primary-500)' }}>{role}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!matrix[role]?.accounting_rw}
                        onChange={() => togglePermission(role, 'accounting_rw')}
                        style={{ cursor: 'pointer', transform: 'scale(1.15)' }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!matrix[role]?.tax_approve}
                        onChange={() => togglePermission(role, 'tax_approve')}
                        style={{ cursor: 'pointer', transform: 'scale(1.15)' }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!matrix[role]?.maker_approve}
                        onChange={() => togglePermission(role, 'maker_approve')}
                        style={{ cursor: 'pointer', transform: 'scale(1.15)' }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={!!matrix[role]?.audit_export}
                        onChange={() => togglePermission(role, 'audit_export')}
                        style={{ cursor: 'pointer', transform: 'scale(1.15)' }}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        disabled
                        checked={!!matrix[role]?.delete_records}
                        style={{ cursor: 'not-allowed', opacity: 0.4 }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Organization Profile */}
      {activeTab === 'ORG' && (
        <div className="glass-panel" style={{ padding: '24px', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Organization Profile</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Practice Firm Legal Name</label>
              <input type="text" defaultValue={currentOrg.name} className="input-field" style={{ marginTop: '4px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>GSTIN</label>
                <input type="text" defaultValue={currentOrg.gstin || '27AAAFS9281G1Z3'} className="input-field font-mono" style={{ marginTop: '4px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>PAN</label>
                <input type="text" defaultValue={currentOrg.pan || 'AAAFS9281G'} className="input-field font-mono" style={{ marginTop: '4px' }} />
              </div>
            </div>
            <button
              onClick={() => showToast('Firm Profile Saved', 'Updated organization details.', 'success')}
              className="btn btn-primary"
              style={{ alignSelf: 'flex-start', marginTop: '10px' }}
            >
              Save Organization Changes
            </button>
          </div>
        </div>
      )}

      {/* Tab: Team Members */}
      {activeTab === 'TEAM' && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Team Members ({availableUsers.length})</h3>
            <button
              onClick={() => showToast('Invite Modal', 'Send email invite to junior associate.', 'info')}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} /> Invite New Member
            </button>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Specialization</th>
                  <th>MFA Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {availableUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src={u.avatar} alt={u.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                        <span style={{ fontWeight: 700 }}>{u.name}</span>
                      </div>
                    </td>
                    <td><span className="badge badge-primary">{u.role}</span></td>
                    <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                    <td style={{ fontSize: '0.74rem' }}>{u.specialization.join(', ')}</td>
                    <td><span className="badge badge-success">MFA Enabled</span></td>
                    <td>
                      <button
                        onClick={() => showToast('Permissions Editor', `Editing permissions for ${u.name}`, 'info')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Subscriptions */}
      {activeTab === 'SUBSCRIPTION' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {[
            { name: 'Starter', clients: 'Up to 5 Clients', users: '2 Users', ai: 'Basic AI Reconciliation', isCurrent: false },
            { name: 'Professional', clients: 'Up to 25 Clients', users: '10 Users', ai: 'Full AI Assistant & Notice Drafter', isCurrent: false },
            { name: 'Enterprise', clients: 'Unlimited Clients', users: 'Unlimited Users', ai: 'Dedicated Copilot, Full Forensic Lineage & SLA', isCurrent: true }
          ].map((plan, i) => (
            <div
              key={i}
              className="glass-panel"
              style={{
                padding: '24px',
                border: plan.isCurrent ? '2px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                background: plan.isCurrent ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{plan.name}</h3>
                {plan.isCurrent && <span className="badge badge-success">Active Plan</span>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <div>✔ {plan.clients}</div>
                <div>✔ {plan.users}</div>
                <div>✔ {plan.ai}</div>
                <div>✔ 100% Immutable Audit Trail</div>
              </div>

              <div style={{ marginTop: '20px' }}>
                {plan.isCurrent ? (
                  <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => showToast('Plan Upgrade', `Requested upgrade to ${plan.name} tier.`, 'success')}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    Upgrade Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Security */}
      {activeTab === 'SECURITY' && (
        <div className="glass-panel" style={{ padding: '24px', maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>Enterprise Security & Direct Bank Open APIs</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.82rem' }}>
            <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>Two-Factor Authentication (TOTP)</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Mandatory for all CA, CMA, CS & Checker roles</div>
              </div>
              <span className="badge badge-success">Enforced</span>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>GSTN & NIC IRP e-Invoice API Key</div>
                <div className="font-mono" style={{ color: 'var(--primary-500)', fontSize: '0.72rem' }}>••••••••••••••••••••9281A</div>
              </div>
              <span className="badge badge-success">Connected</span>
            </div>

            <div style={{ padding: '12px', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700 }}>Bank Open API Feeds (HDFC, ICICI, SBI)</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Automated encrypted statement synchronization</div>
              </div>
              <span className="badge badge-success">Live Feeds</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
