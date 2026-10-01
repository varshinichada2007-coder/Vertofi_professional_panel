import React, { useState } from 'react';
import {
  X,
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
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const UserProfileModal: React.FC = () => {
  const { currentUser, updateProfile, switchRole, logout } = useAuth();
  const { isProfileModalOpen, setIsProfileModalOpen, showToast, setActiveView } = useApp();

  const [activeTab, setActiveTab] = useState<'CREDENTIALS' | 'EDIT_PROFILE' | 'SECURITY' | 'BUSINESS_LINK'>('CREDENTIALS');
  const [copiedCaId, setCopiedCaId] = useState(false);

  // Edit form state
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone || '+91 98201 44829');
  const [firmName, setFirmName] = useState(currentUser.firmName);
  const [membershipNumber, setMembershipNumber] = useState(currentUser.membershipNumber || 'FCA-084920');
  const [caIdNumber, setCaIdNumber] = useState(currentUser.caIdNumber || 'V-CA-84920');
  const [copNumber, setCopNumber] = useState(currentUser.copNumber || 'COP-409218');

  if (!isProfileModalOpen) return null;

  const handleCopyCaId = () => {
    const idToCopy = currentUser.caIdNumber || currentUser.membershipNumber || 'V-CA-84920';
    navigator.clipboard.writeText(idToCopy);
    setCopiedCaId(true);
    showToast('CA ID Copied', `CA ID ${idToCopy} copied to clipboard for Business Portal linking.`, 'success');
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
    showToast('Profile Updated', 'Professional profile & CA credentials updated successfully.', 'success');
  };

  return (
    <div
      className="modal-backdrop"
      onClick={() => setIsProfileModalOpen(false)}
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
          maxWidth: '740px',
          maxHeight: '90vh',
          background: 'var(--bg-card)',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid var(--border-strong)'
        }}
      >
        {/* Header Strip */}
        <div
          style={{
            padding: '24px 28px',
            background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
            color: '#FFFFFF',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '3px solid #FFFFFF',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: '2px solid #FFFFFF'
                }}
                title="Online & DSC Verified"
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                  {currentUser.name}
                </h2>
                <span
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(4px)',
                    color: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700
                  }}
                >
                  {currentUser.role} Practitioner
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#E0E7FF', marginTop: '3px' }}>
                {currentUser.roleTitle} • {currentUser.firmName}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'var(--bg-app)',
            padding: '0 20px'
          }}
        >
          {[
            { key: 'CREDENTIALS', label: 'CA & Practice Credentials', icon: Award },
            { key: 'EDIT_PROFILE', label: 'Edit Profile Info', icon: User },
            { key: 'BUSINESS_LINK', label: 'Business Panel Link', icon: Globe2 },
            { key: 'SECURITY', label: '2FA & Security', icon: ShieldCheck }
          ].map((t) => {
            const Icon = t.icon;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '14px 16px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)',
                  border: 'none',
                  background: 'transparent',
                  borderBottom: isActive ? '2px solid var(--primary-600)' : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'CREDENTIALS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Highlighted CA ID Banner */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #EEF2FF 0%, #FAF5FF 100%)',
                  border: '1px solid #C7D2FE',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4F46E5', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    Official Vertofi CA Partner ID
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E1B4B', fontFamily: 'monospace', marginTop: '4px' }}>
                    {currentUser.caIdNumber || currentUser.membershipNumber || 'V-CA-84920'}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '2px' }}>
                    Provide this CA ID to clients on the Vertofi Business Portal to connect books & live feeds.
                  </div>
                </div>

                <button
                  onClick={handleCopyCaId}
                  className="btn btn-primary"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', fontSize: '0.82rem' }}
                >
                  {copiedCaId ? <Check size={16} /> : <Copy size={16} />}
                  {copiedCaId ? 'Copied to Clipboard!' : 'Copy CA ID No.'}
                </button>
              </div>

              {/* Grid of Credentials */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>ICAI Membership / Reg No.</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }} className="font-mono">
                    {currentUser.membershipNumber || 'FCA-084920'}
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Certificate of Practice (COP)</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }} className="font-mono">
                    {currentUser.copNumber || 'COP-409218'}
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Email Address</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {currentUser.email}
                  </div>
                </div>

                <div style={{ padding: '14px', background: 'var(--bg-app)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Contact Phone</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px' }}>
                    {currentUser.phone || '+91 98201 44829'}
                  </div>
                </div>
              </div>

              {/* Specializations & Role Switch */}
              <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  Practice Specializations
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {currentUser.specialization?.map((spec, i) => (
                    <span key={i} className="badge badge-neutral" style={{ fontSize: '0.74rem', padding: '4px 10px' }}>
                      ✓ {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    setActiveView('business-sync');
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  <Globe2 size={14} /> Open Business Sync Center
                </button>

                <button
                  onClick={() => {
                    setIsProfileModalOpen(false);
                    logout();
                  }}
                  className="btn btn-danger btn-sm"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'EDIT_PROFILE' && (
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
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
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>Membership No.</label>
                  <input
                    type="text"
                    value={membershipNumber}
                    onChange={(e) => setMembershipNumber(e.target.value)}
                    className="input-field font-mono"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>COP No.</label>
                  <input
                    type="text"
                    value={copNumber}
                    onChange={(e) => setCopNumber(e.target.value)}
                    className="input-field font-mono"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsProfileModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={15} /> Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'BUSINESS_LINK' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px', color: '#166534' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '0.9rem' }}>
                  <ShieldCheck size={18} color="#16A34A" /> Vertofi Multi-Panel Architecture Active
                </div>
                <div style={{ fontSize: '0.78rem', marginTop: '6px', lineHeight: 1.5 }}>
                  This workspace bridges the <strong>Business Portal</strong> (for transaction feeds and client questions) to this <strong>CA / Financial Panel</strong> and downstream to the <strong>Legal Panel</strong> (for GST notice DRC-01 & MCA filings).
                </div>
              </div>

              <div style={{ padding: '16px', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '8px' }}>How Clients Connect via Your CA ID:</h4>
                <ol style={{ paddingLeft: '18px', fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Client logs into the Vertofi Business Portal and navigates to <strong>Settings → Assign CA</strong>.</li>
                  <li>Client inputs your official CA ID: <strong className="font-mono" style={{ color: 'var(--primary-600)' }}>{currentUser.caIdNumber || 'V-CA-84920'}</strong>.</li>
                  <li>A connection handshake is dispatched to your portal for validation and instant ledger sync.</li>
                </ol>
              </div>

              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  setActiveView('business-sync');
                }}
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Go to Business Sync Manager
              </button>
            </div>
          )}

          {activeTab === 'SECURITY' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-app)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Two-Step Verification (2FA)</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Required on every login with OTP code</div>
                </div>
                <span className="badge badge-success">Enabled & Active</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-app)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Class 3 DSC Digital Signature</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Cryptographic token active for GSTR & Form 3CD</div>
                </div>
                <span className="badge badge-neutral">Token #DSC-2024-9918</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: 'var(--bg-app)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Session Security</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>TLS 1.3 / AES-256 Ledger Encryption</div>
                </div>
                <span className="badge badge-success">Encrypted</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
