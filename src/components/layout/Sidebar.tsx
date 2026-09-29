import React, { useState } from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  BookOpen,
  ArrowDownLeft,
  ArrowUpRight,
  Landmark,
  ShieldCheck,
  Calendar,
  AlertOctagon,
  AlertTriangle,
  FolderLock,
  CheckCheck,
  History,
  BarChart3,
  Sparkles,
  HeartPulse,
  Globe2,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserPlus,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { useApp, NavView } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { VertofiLogo } from '../common/VertofiLogo';

interface SidebarItem {
  id: NavView;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: 'danger' | 'warning' | 'primary' | 'ai';
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, tasks, approvals, riskExceptions, statutoryNotices, bankTransactions, clients, switchClient, currentClient } = useApp();
  const { currentUser, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const pendingTasksCount = tasks.filter((t) => t.status === 'DUE_TODAY' || t.status === 'PENDING_REVIEW').length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length;
  const openExceptionsCount = riskExceptions.filter((e) => e.status === 'OPEN' || e.status === 'INVESTIGATING').length;
  const openNoticesCount = statutoryNotices.filter((n) => n.status === 'OPEN' || n.status === 'IN_PROGRESS').length;
  const unreconciledTxnCount = bankTransactions.filter((b) => b.status === 'UNMATCHED' || b.status === 'EXCEPTION').length;

  const sections: SidebarSection[] = [
    {
      title: 'WORKSPACE',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: pendingTasksCount, badgeColor: 'warning' },
        { id: 'clients', label: 'Clients Directory', icon: Users }
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { id: 'accounting', label: 'Accounting & GL', icon: BookOpen },
        { id: 'ar', label: 'Accounts Receivable', icon: ArrowDownLeft },
        { id: 'ap', label: 'Accounts Payable', icon: ArrowUpRight },
        { id: 'reconciliation', label: 'Bank & Recon', icon: Landmark, badge: unreconciledTxnCount > 0 ? unreconciledTxnCount : undefined, badgeColor: 'warning' }
      ]
    },
    {
      title: 'COMPLIANCE',
      items: [
        { id: 'tax', label: 'Tax & GST/TDS', icon: ShieldCheck },
        { id: 'notices', label: 'Statutory Notices', icon: AlertOctagon, badge: openNoticesCount, badgeColor: 'danger' },
        { id: 'exceptions', label: 'Exceptions & Risk', icon: AlertTriangle, badge: openExceptionsCount, badgeColor: 'danger' }
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { id: 'documents', label: 'Documents & VDR', icon: FolderLock },
        { id: 'approvals', label: 'Approval Centre', icon: CheckCheck, badge: pendingApprovalsCount, badgeColor: 'primary' },
        { id: 'audit', label: 'Audit Trail', icon: History }
      ]
    },
    {
      title: 'INSIGHTS',
      items: [
        { id: 'analytics', label: 'Practice Analytics', icon: BarChart3 },
        { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, badge: 'AI', badgeColor: 'ai' },
        { id: 'bhs', label: 'Business Health (BHS)', icon: HeartPulse }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'network', label: 'Professional Network', icon: Globe2 },
        { id: 'settings', label: 'Settings & RBAC', icon: Settings }
      ]
    }
  ];

  const projectEntities = [
    { id: 'client-1', name: 'Acme FinTech Technologies', color: '#10B981' },
    { id: 'client-2', name: 'Nova Retail Logistics', color: '#6366F1' },
    { id: 'client-3', name: 'Meridian Healthtech', color: '#F59E0B' }
  ];

  return (
    <aside
      style={{
        width: collapsed ? '74px' : '260px',
        backgroundColor: '#13121C',
        color: '#94A3B8',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        transition: 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 40,
        flexShrink: 0,
        borderRight: '1px solid #1E1C2B'
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '0' : '0 16px',
          borderBottom: '1px solid #1E1C2B',
          flexShrink: 0
        }}
      >
        {!collapsed ? (
          <VertofiLogo size={32} showText={true} textColor="#FFFFFF" showSubtitle={true} />
        ) : (
          <VertofiLogo size={28} showText={false} />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: '#1E1C2B',
            border: 'none',
            color: '#94A3B8',
            cursor: 'pointer',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '6px'
          }}
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Navigation Sections */}
      <div style={{ padding: collapsed ? '12px 6px' : '14px 10px', flex: 1 }}>
        {sections.map((section, idx) => (
          <div key={section.title} style={{ marginBottom: idx === sections.length - 1 ? '16px' : '14px' }}>
            {!collapsed && (
              <div
                style={{
                  fontSize: '0.66rem',
                  fontWeight: 800,
                  color: '#64748B',
                  letterSpacing: '0.08em',
                  padding: '4px 12px 6px 12px',
                  textTransform: 'uppercase'
                }}
              >
                {section.title}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: collapsed ? 'center' : 'space-between',
                      width: '100%',
                      padding: collapsed ? '10px 0' : '8px 12px',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(99, 102, 241, 0.16)' : 'transparent',
                      border: isActive ? '1px solid rgba(99, 102, 241, 0.35)' : '1px solid transparent',
                      color: isActive ? '#FFFFFF' : '#94A3B8',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                    title={collapsed ? item.label : undefined}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <IconComponent
                        size={17}
                        color={isActive ? '#818CF8' : '#94A3B8'}
                        style={{ flexShrink: 0 }}
                      />
                      {!collapsed && (
                        <span
                          style={{
                            fontSize: '0.81rem',
                            fontWeight: isActive ? 700 : 500,
                            whiteSpace: 'nowrap',
                            textAlign: 'left'
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!collapsed && item.badge !== undefined && (
                      <span
                        className={
                          item.badgeColor === 'danger'
                            ? 'badge badge-danger'
                            : item.badgeColor === 'warning'
                            ? 'badge badge-warning'
                            : item.badgeColor === 'ai'
                            ? 'badge badge-ai'
                            : 'badge badge-info'
                        }
                        style={{ fontSize: '0.64rem', padding: '1px 6px' }}
                      >
                        {item.badge}
                      </span>
                    )}

                    {collapsed && item.badge !== undefined && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '6px',
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor:
                            item.badgeColor === 'danger'
                              ? '#EF4444'
                              : item.badgeColor === 'warning'
                              ? '#F59E0B'
                              : '#6366F1'
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Assigned Projects / Entities */}
        {!collapsed && (
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #1E1C2B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 12px 6px 12px' }}>
              <span style={{ fontSize: '0.66rem', fontWeight: 800, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Assigned Entities
              </span>
              <span style={{ fontSize: '0.7rem', color: '#818CF8', cursor: 'pointer', fontWeight: 700 }} onClick={() => setActiveView('clients')}>
                + All
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {projectEntities.map((ent) => {
                const isCurrent = currentClient.id === ent.id;
                return (
                  <div
                    key={ent.id}
                    onClick={() => switchClient(ent.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      background: isCurrent ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                      color: isCurrent ? '#FFFFFF' : '#94A3B8',
                      fontSize: '0.78rem',
                      fontWeight: isCurrent ? 700 : 500
                    }}
                  >
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: ent.color, flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ent.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer / User Profile & Sign Out Strip */}
      {!collapsed ? (
        <div
          style={{
            padding: '12px 14px',
            borderTop: '1px solid #1E1C2B',
            backgroundColor: '#0F0E16',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #6366F1' }}
              />
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFFFFF' }}>
                  {currentUser.name}
                </div>
                <div style={{ fontSize: '0.68rem', color: '#818CF8', fontWeight: 600 }}>
                  {currentUser.roleTitle}
                </div>
              </div>
            </div>

            <button
              onClick={logout}
              title="Sign Out to Login Portal"
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '6px',
                padding: '6px 8px',
                cursor: 'pointer',
                color: '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748B' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10B981', fontWeight: 700 }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />
              DSC Class 3 Active
            </span>
            <span>{currentUser.role} Workspace</span>
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px 0', display: 'flex', justifyContent: 'center', borderTop: '1px solid #1E1C2B', backgroundColor: '#0F0E16' }}>
          <button
            onClick={logout}
            title="Sign Out"
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '6px',
              padding: '8px',
              cursor: 'pointer',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </aside>
  );
};
