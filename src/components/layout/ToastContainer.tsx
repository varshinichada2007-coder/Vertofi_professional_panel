import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '380px'
      }}
    >
      {toasts.map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle size={18} color="var(--success-500)" />;
            case 'warning':
              return <AlertTriangle size={18} color="var(--warning-500)" />;
            case 'error':
              return <XCircle size={18} color="var(--danger-500)" />;
            default:
              return <Info size={18} color="var(--info-500)" />;
          }
        };

        const getBorderColor = () => {
          switch (toast.type) {
            case 'success':
              return 'var(--success-border)';
            case 'warning':
              return 'var(--warning-border)';
            case 'error':
              return 'var(--danger-border)';
            default:
              return 'var(--info-border)';
          }
        };

        return (
          <div
            key={toast.id}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-card)',
              border: `1px solid ${getBorderColor()}`,
              boxShadow: 'var(--shadow-lg)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              animation: 'fadeIn 0.2s ease-out'
            }}
          >
            <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon()}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.4 }}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '2px'
              }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
