import React from 'react';
import {
  Globe2,
  ShieldCheck,
  Award,
  Users,
  Search,
  CheckCircle2,
  Send,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const ProfessionalNetworkView: React.FC = () => {
  const { availableUsers } = useAuth();
  const { showToast } = useApp();

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe2 size={24} color="var(--primary-500)" /> Verified Professional Network & Joint Engagements
          </h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Collaborate with Verified CAs, CMAs, CSs, Valuers & Legal Counsel with Granular Client Permission Controls.
          </p>
        </div>

        <button
          onClick={() => showToast('Invitation Dispatched', 'Sent network partnership invitation to practitioner.', 'success')}
          className="btn btn-primary btn-sm"
        >
          <Send size={14} /> Invite External Specialist
        </button>
      </div>

      {/* Directory Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {availableUsers.map((user) => (
          <div key={user.id} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: 700 }}>{user.name}</h3>
                  <span className="badge badge-success" style={{ fontSize: '0.6rem' }}>
                    <ShieldCheck size={10} /> Verified {user.role}
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {user.roleTitle}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {user.firmName}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {user.specialization.map((spec, idx) => (
                <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.64rem' }}>
                  {spec}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}>
              <span className="font-mono" style={{ color: 'var(--text-muted)' }}>
                {user.copNumber || user.membershipNumber || 'FCA Member'}
              </span>
              <button
                onClick={() => showToast('Engagement Request', `Sent specialized mandate request to ${user.name}`, 'info')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.7rem', padding: '4px 10px' }}
              >
                Request Consultation
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
