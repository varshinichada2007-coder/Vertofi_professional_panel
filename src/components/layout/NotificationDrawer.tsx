import React, { useState } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  Clock,
  FileCheck,
  CreditCard,
  Building,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    switchClient,
    setActiveView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'COMPLIANCE' | 'APPROVALS'>('ALL');

  if (!isNotificationDrawerOpen) return null;

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'UNREAD') return !n.isRead;
    if (activeTab === 'COMPLIANCE') return n.category === 'COMPLIANCE_DEADLINE' || n.category === 'NOTICE_DEADLINE';
    if (activeTab === 'APPROVALS') return n.category === 'APPROVAL_REQUEST';
    return true;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case 'COMPLIANCE_DEADLINE':
      case 'NOTICE_DEADLINE':
        return <Clock size={16} color="var(--danger-500)" />;
      case 'APPROVAL_REQUEST':
        return <CheckCheck size={16} color="var(--primary-500)" />;
      case 'EXCEPTION':
        return <AlertTriangle size={16} color="var(--warning-500)" />;
      case 'PAYMENT':
        return <CreditCard size={16} color="var(--info-500)" />;
      default:
        return <FileCheck size={16} color="var(--success-500)" />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsNotificationDrawerOpen(false)}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={18} color="var(--primary-500)" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Notification Centre</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={markAllNotificationsRead}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.72rem', padding: '4px 8px' }}
            >
              Mark all read
            </button>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', padding: '8px 16px', gap: '6px', borderBottom: '1px solid var(--border-subtle)' }}>
          {(['ALL', 'UNREAD', 'COMPLIANCE', 'APPROVALS'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ fontSize: '0.72rem', padding: '4px 10px' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)' }}>
              <Bell size={32} style={{ margin: '0 auto 10px auto', opacity: 0.3 }} />
              <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>No notifications in this view</div>
              <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>You're all caught up with compliance deadlines!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.clientId) switchClient(notif.clientId);
                    if (notif.category === 'APPROVAL_REQUEST') setActiveView('approvals');
                    else if (notif.category === 'COMPLIANCE_DEADLINE') setActiveView('tax');
                    else if (notif.category === 'NOTICE_DEADLINE') setActiveView('notices');
                    else if (notif.category === 'EXCEPTION') setActiveView('exceptions');
                    setIsNotificationDrawerOpen(false);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    background: notif.isRead ? 'var(--bg-card)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                  className="glass-panel-hover"
                >
                  {!notif.isRead && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-500)'
                      }}
                    />
                  )}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ marginTop: '2px' }}>{getIcon(notif.category)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', paddingRight: '16px' }}>
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                        {notif.message}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        <span>{notif.timestamp}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-500)', fontWeight: 600 }}>
                          Open Action <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
