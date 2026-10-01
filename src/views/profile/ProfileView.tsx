import React, { useState } from 'react';
import {
  User,
  Shield,
  Key,
  Copy,
  Check,
  Building,
  Mail,
  Phone,
  Award,
  FileCheck,
  Lock,
  Globe2,
  RefreshCw,
  QrCode,
  ShieldCheck,
  Save,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { currentUser, updateProfile, switchRole, logout } = useAuth();
  const { showToast, setActiveView, connectedBusinesses } = useApp();

  const [copiedCaId, setCopiedCaId] = useState(false);
  const [activeTab, setActiveTab] = useState<'CREDENTIALS' | 'EDIT' | 'SECURITY'>('CREDENTIALS');

  // Edit form state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98201 44829');
  const [firmName, setFirmName] = useState(currentUser.firmName);
  const [membershipNumber, setMembershipNumber] = useState(currentUser.membershipNumber || 'FCA-084920');
  const [caIdNumber, setCaIdNumber] = useState(currentUser.caIdNumber || 'V-CA-84920');
  const [copNumber, setCopNumber] = useState(currentUser.copNumber || 'COP-409218');

  const activeCaId = currentUser.caIdNumber || currentUser.membershipNumber || 'V-CA-84920';

  const handleCopyCaId = () => {
    navigator.clipboard.writeText(activeCaId);
    setCopiedCaId(true);
    showToast('CA ID Copied', `CA ID ${activeCaId} copied to clipboard for Business Portal linking.`, 'success');
    setTimeout(() => setCopiedCaId(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      firmName,
      membershipNumber,
      caIdNumber,
      copNumber
    });
    showToast('Profile Updated', 'Professional profile & CA credentials saved successfully.', 'success');
  };

  return (
    <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Profile Top Banner Card */}
      <div
        className="glass-panel"
        style={{
          padding: '28px 32px',
          background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
          color: '#FFFFFF',
          borderRadius: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '18px',
                objectFit: 'cover',
                border: '3px solid #FFFFFF',
                boxShadow: '0 6px 16px rgba(0,0,0,0.25)'
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                background: '#10B981',
                border: '2px solid #FFFFFF'
              }}
              title="Class 3 DSC Verified & Online"
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                {currentUser.name}
              </h1>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: 700
                }}
              >
                {currentUser.role} Workspace
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#E0E7FF', margin: '4px 0 0 0' }}>
              {currentUser.roleTitle} • {currentUser.firmName}
            </p>
          </div>
        </div>

        {/* Highlighted CA ID Box */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '14px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C7D2FE', fontWeight: 700 }}>
              Official Vertofi CA Partner ID
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'monospace', color: '#FFFFFF' }}>
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
              gap: '6px'
            }}
          >
            {copiedCaId ? <Check size={15} color="#16A34A" /> : <Copy size={15} />}
            {copiedCaId ? 'Copied!' : 'Copy CA ID'}
          </button>
        </div>
      </div>

      {/* Profile Details Navigation */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
        {[
          { key: 'CREDENTIALS', label: 'Practice Credentials & Registration', icon: Award },
          { key: 'EDIT', label: 'Edit Profile Information', icon: User },
          { key: 'SECURITY', label: '2FA & Class-3 DSC Security', icon: ShieldCheck }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={isActive ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      {activeTab === 'CREDENTIALS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Key Registration Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>ICAI Membership / Registration No.</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }} className="font-mono">
                {currentUser.membershipNumber || 'FCA-084920'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>✓ Verified with Institute Records</div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Certificate of Practice (COP) No.</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }} className="font-mono">
                {currentUser.copNumber || 'COP-409218'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#10B981', marginTop: '4px', fontWeight: 600 }}>✓ Active Full-Time Practice</div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '14px' }}>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 600 }}>Connected Business Clients</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
                {connectedBusinesses.length} Live Portals
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--primary-600)', marginTop: '4px', fontWeight: 600, cursor: 'pointer' }} onClick={() => setActiveView('business-sync')}>
                Manage Business Sync →
              </div>
            </div>
          </div>

          {/* Contact and Firm Info */}
          <div className="glass-panel" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '16px' }}>Contact & Firm Overview</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Registered Email</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '3px' }}>{currentUser.email}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Contact Mobile</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '3px' }}>{currentUser.phone || '+91 98201 44829'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Firm / Practice Name</div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, marginTop: '3px' }}>{currentUser.firmName}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'EDIT' && (
        <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '16px' }}>Edit Practice Profile & Credentials</h3>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Firm / Practice Name</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>CA ID No.</label>
                <input
                  type="text"
                  value={caIdNumber}
                  onChange={(e) => setCaIdNumber(e.target.value)}
                  className="input-field font-mono"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Membership Registration No.</label>
                <input
                  type="text"
                  value={membershipNumber}
                  onChange={(e) => setMembershipNumber(e.target.value)}
                  className="input-field font-mono"
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>COP Number</label>
                <input
                  type="text"
                  value={copNumber}
                  onChange={(e) => setCopNumber(e.target.value)}
                  className="input-field font-mono"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Practice Profile
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'SECURITY' && (
        <div className="glass-panel" style={{ padding: '28px', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Two-Factor Authentication & Cryptographic Security</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Two-Factor OTP Security</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>Dispatches 6-digit TOTP verification code to {currentUser.email}</div>
            </div>
            <span className="badge badge-success">Active & Enforced</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>Class 3 DSC Cryptographic Signing</div>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '2px' }}>Hardware USB Token & e-Sign verified for MCA & Income Tax e-filings</div>
            </div>
            <span className="badge badge-primary">Token Active</span>
          </div>
        </div>
      )}
    </div>
  );
};
