import React, { useState } from 'react';
import {
  Building2,
  ChevronDown,
  Search,
  Bell,
  Sparkles,
  Calendar,
  Shield,
  Moon,
  Sun,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  Layers,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { currentUser, currentOrg, availableOrgs, switchOrganization, switchRole, logout } = useAuth();
  const {
    currentClient,
    clients,
    switchClient,
    financialPeriod,
    setFinancialPeriod,
    setIsSearchModalOpen,
    setIsNotificationDrawerOpen,
    setIsProfileModalOpen,
    notifications,
    theme,
    toggleTheme,
    setActiveView
  } = useApp();

  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const [isPeriodDropdownOpen, setIsPeriodDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const periods = [
    'FY 2024-25 (Current)',
    'FY 2023-24 (Audited)',
    'Q3 FY 24-25 (Oct-Dec)',
    'Q2 FY 24-25 (Jul-Sep)',
    'Sep 2024 (Monthly Filing)',
    'Oct 2024 (Current Month)'
  ];

  const roleList: { role: UserRole; title: string; desc: string }[] = [
    { role: 'CA', title: currentUser.role === 'CA' ? currentUser.name || 'Chartered Accountant' : 'Chartered Accountant', desc: 'Senior Partner & Direct Tax Head' },
    { role: 'CMA', title: currentUser.role === 'CMA' ? currentUser.name || 'Cost & Management Consultant' : 'Cost & Management Consultant', desc: 'Cost & Management CMA' },
    { role: 'CS', title: currentUser.role === 'CS' ? currentUser.name || 'Company Secretary' : 'Company Secretary', desc: 'Company Secretary & MCA Compliance' },
    { role: 'CFO', title: currentUser.role === 'CFO' ? currentUser.name || 'Fractional CFO' : 'Fractional CFO', desc: 'Treasury Head & Fractional CFO' },
    { role: 'ACCOUNTANT', title: currentUser.role === 'ACCOUNTANT' ? currentUser.name || 'Senior Accountant' : 'Senior Accountant', desc: 'Senior Financial Executive' },
    { role: 'AUDITOR', title: currentUser.role === 'AUDITOR' ? currentUser.name || 'Statutory Auditor' : 'Statutory Auditor', desc: 'Lead Statutory & CARO Reviewer' },
    { role: 'INTERNAL_ADMIN', title: currentUser.role === 'INTERNAL_ADMIN' ? currentUser.name || 'Operations Admin' : 'Operations Admin', desc: 'Practice Operations Admin' }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '64px',
        backgroundColor: 'var(--bg-header)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        gap: '16px'
      }}
    >
      {/* Left Section: Brand & Entity Switchers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Organization Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setIsOrgDropdownOpen(!isOrgDropdownOpen);
              setIsClientDropdownOpen(false);
              setIsPeriodDropdownOpen(false);
              setIsUserDropdownOpen(false);
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}
          >
            <Building2 size={16} color="var(--primary-500)" />
            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>
              {currentOrg.name}
            </span>
          <span className="badge badge-ai" style={{ fontSize: '0.65rem' }}>{currentOrg.plan}</span>
          <ChevronDown size={14} color="var(--text-muted)" />
        </button>

        {/* Portal Telemetry Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="badge badge-neutral" style={{ fontSize: '0.62rem', padding: '2px 7px' }} title="Real-time transaction feed from Vertofi Business Portal">
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} /> Business Sync
          </span>
          <span className="badge badge-neutral" style={{ fontSize: '0.62rem', padding: '2px 7px' }} title="Encrypted bridge to Vertofi Legal & Notice Defense Panel">
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#6366F1', display: 'inline-block' }} /> Legal Bridge
          </span>
        </div>

          {isOrgDropdownOpen && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '280px',
                padding: '8px',
                zIndex: 60
              }}
            >
              <div style={{ padding: '6px 8px', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Practice Organizations
              </div>
              {availableOrgs.map((org) => (
                <div
                  key={org.id}
                  onClick={() => {
                    switchOrganization(org.id);
                    setIsOrgDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: org.id === currentOrg.id ? 'var(--bg-subtle)' : 'transparent'
                  }}
                  className="glass-panel-hover"
                >
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{org.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {org.memberCount} Team Members • {org.clientCount} Clients
                    </div>
                  </div>
                  {org.id === currentOrg.id && <CheckCircle2 size={16} color="var(--primary-500)" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Client Entity Switcher */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setIsClientDropdownOpen(!isClientDropdownOpen);
              setIsOrgDropdownOpen(false);
              setIsPeriodDropdownOpen(false);
              setIsUserDropdownOpen(false);
            }}
            className="btn btn-secondary btn-sm"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              border: currentClient.status === 'HIGH_RISK' ? '1px solid var(--danger-border)' : undefined
            }}
          >
            <Layers size={16} color={currentClient.status === 'HIGH_RISK' ? 'var(--danger-500)' : 'var(--info-500)'} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentClient?.name || 'Select Client Entity'}
              </div>
            </div>
            {currentClient?.status === 'HIGH_RISK' && (
              <span className="badge badge-danger" style={{ fontSize: '0.62rem' }}>Risk</span>
            )}
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {isClientDropdownOpen && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '320px',
                padding: '8px',
                zIndex: 60,
                maxHeight: '360px',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                <span>Assigned Clients</span>
                <span
                  style={{ color: 'var(--primary-500)', cursor: 'pointer' }}
                  onClick={() => {
                    setActiveView('clients');
                    setIsClientDropdownOpen(false);
                  }}
                >
                  View All ({clients.length})
                </span>
              </div>
              {clients.length === 0 ? (
                <div style={{ padding: '16px 10px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div>No client entities onboarded yet.</div>
                  <button
                    onClick={() => {
                      setActiveView('client-360');
                      setIsClientDropdownOpen(false);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '10px', fontSize: '0.72rem', width: '100%' }}
                  >
                    + Onboard First Client
                  </button>
                </div>
              ) : (
                clients.map((client) => (
                  <div
                    key={client.id}
                    onClick={() => {
                      switchClient(client.id);
                      setIsClientDropdownOpen(false);
                    }}
                    style={{
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '2px',
                      backgroundColor: client.id === currentClient.id ? 'var(--bg-subtle)' : 'transparent'
                    }}
                    className="glass-panel-hover"
                  >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{client.name}</span>
                      {client.status === 'HIGH_RISK' && <span className="badge badge-danger" style={{ fontSize: '0.58rem' }}>Alert</span>}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      GSTIN: {client.gstin} • BHS: <strong style={{ color: 'var(--success-500)' }}>{client.bhsScore}/100</strong>
                    </div>
                  </div>
                  {client.id === currentClient.id && <CheckCircle2 size={16} color="var(--primary-500)" />}
                </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Financial Period Selector */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setIsPeriodDropdownOpen(!isPeriodDropdownOpen);
              setIsOrgDropdownOpen(false);
              setIsClientDropdownOpen(false);
              setIsUserDropdownOpen(false);
            }}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 10px' }}
          >
            <Calendar size={14} color="var(--warning-500)" />
            <span style={{ fontSize: '0.78rem' }}>{financialPeriod}</span>
            <ChevronDown size={12} color="var(--text-muted)" />
          </button>

          {isPeriodDropdownOpen && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                width: '220px',
                padding: '6px',
                zIndex: 60
              }}
            >
              {periods.map((p) => (
                <div
                  key={p}
                  onClick={() => {
                    setFinancialPeriod(p);
                    setIsPeriodDropdownOpen(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    fontSize: '0.8rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    color: p === financialPeriod ? 'var(--primary-500)' : 'var(--text-primary)',
                    fontWeight: p === financialPeriod ? 600 : 400,
                    backgroundColor: p === financialPeriod ? 'var(--bg-subtle)' : 'transparent'
                  }}
                  className="glass-panel-hover"
                >
                  {p}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center / Search Trigger */}
      <div style={{ flex: 1, maxWidth: '420px' }}>
        <div
          onClick={() => setIsSearchModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '7px 12px',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease'
          }}
          className="glass-panel-hover"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', overflow: 'hidden' }}>
            <Search size={15} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Search invoice, GSTIN, notice, voucher...</span>
          </div>
          <kbd
            style={{
              fontSize: '0.68rem',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section: Notifications, Role Badge & User Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Notifications */}
        <button
          onClick={() => setIsNotificationDrawerOpen(true)}
          className="btn btn-secondary btn-sm"
          style={{ position: 'relative', padding: '7px 10px' }}
        >
          <Bell size={16} color="var(--text-secondary)" />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-3px',
                right: '-3px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: 'var(--danger-500)',
                color: '#FFFFFF',
                fontSize: '0.65rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.4)'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* Role Pill & User Dropdown */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => {
              setIsUserDropdownOpen(!isUserDropdownOpen);
              setIsOrgDropdownOpen(false);
              setIsClientDropdownOpen(false);
              setIsPeriodDropdownOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer'
            }}
            className="glass-panel-hover"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{currentUser.name.split(' ')[0]}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--primary-500)', fontWeight: 600 }}>{currentUser.role}</div>
            </div>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {isUserDropdownOpen && (
            <div
              className="glass-panel"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '320px',
                padding: '12px',
                zIndex: 60
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-subtle)' }}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{currentUser.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <span className="badge badge-success" style={{ fontSize: '0.62rem' }}>
                      <Shield size={10} /> Verified {currentUser.role}
                    </span>
                    {currentUser.copNumber && (
                      <span className="badge badge-neutral" style={{ fontSize: '0.6rem' }}>{currentUser.copNumber}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Role Switcher Matrix */}
              <div style={{ marginTop: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '6px' }}>
                  Switch Practitioner Session:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {roleList.map((r) => (
                    <div
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setIsUserDropdownOpen(false);
                      }}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: currentUser.role === r.role ? 'var(--bg-subtle)' : 'transparent'
                      }}
                      className="glass-panel-hover"
                    >
                      <div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{r.role}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: '8px' }}>{r.title}</span>
                      </div>
                      {currentUser.role === r.role && <CheckCircle2 size={14} color="var(--primary-500)" />}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button
                  onClick={() => {
                    setIsProfileModalOpen(true);
                    setIsUserDropdownOpen(false);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  My Practice Profile & CA ID
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    onClick={() => {
                      setActiveView('settings');
                      setIsUserDropdownOpen(false);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ width: '48%' }}
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserDropdownOpen(false);
                    }}
                    className="btn btn-outline-danger btn-sm"
                    style={{ width: '48%' }}
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dedicated Direct Sign Out Button */}
        <button
          onClick={logout}
          className="btn btn-secondary btn-sm"
          title="Sign Out to Login Portal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#DC2626',
            borderColor: '#FECACA',
            background: '#FEF2F2',
            fontWeight: 700,
            padding: '6px 12px'
          }}
        >
          <LogOut size={14} color="#DC2626" />
          <span style={{ fontSize: '0.76rem' }}>Sign Out</span>
        </button>
      </div>
    </header>
  );
};

