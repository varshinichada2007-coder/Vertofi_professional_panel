import React from 'react';
import {
  ShieldCheck,
  Award,
  Building,
  Key,
  CheckCircle2,
  ChevronDown,
  UserCheck,
  Sparkles,
  ExternalLink,
  Briefcase,
  LogOut,
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const PractitionerProfileCard: React.FC = () => {
  const { currentUser, logout, switchRole } = useAuth();
  const { currentClient } = useApp();

  const roleStatutoryMap: Record<string, { body: string; regType: string; portalDesc: string }> = {
    CA: {
      body: 'Institute of Chartered Accountants of India (ICAI)',
      regType: 'ICAI Reg / COP',
      portalDesc: 'Statutory Audits, Form 3CD, Direct Tax & Balance Sheet Signoffs'
    },
    CMA: {
      body: 'Institute of Cost Accountants of India (ICMAI)',
      regType: 'ICMAI Reg / ACMA',
      portalDesc: 'Cost Accounting Standards (CAS-1 to 24), ITC Quarantine & SKU Margins'
    },
    CS: {
      body: 'Institute of Company Secretaries of India (ICSI)',
      regType: 'ICSI Reg / FCS',
      portalDesc: 'MCA V3 e-Filings (AOC-4, MGT-7), AGM Minutes & Secretarial Audits'
    },
    CFO: {
      body: 'Corporate Treasury Leadership',
      regType: 'Executive Mandate',
      portalDesc: 'Cash Runway Modeling, EBITDA Expansion, DSO/DPO & Board MIS'
    },
    ACCOUNTANT: {
      body: 'Finance & Accounts Operations',
      regType: 'Maker Mandate',
      portalDesc: 'Journal Voucher Entry, e-Invoicing & Bank Statement Feeds'
    },
    AUDITOR: {
      body: 'Independent Quality Review Board',
      regType: 'Forensic Reviewer',
      portalDesc: 'Forensic Audit Trail (SHA-256), ICFR Testing & CARO Verification'
    },
    INTERNAL_ADMIN: {
      body: 'Practice Operations & Firm Administration',
      regType: 'Operations Lead',
      portalDesc: 'Client Mandate Onboarding, Team RBAC, and Workflow SLA Management'
    },
    SUPER_ADMIN: {
      body: 'Firm Managing Partnership & Enterprise Controller',
      regType: 'Managing Partner Mandate',
      portalDesc: 'Global Multi-Tenant Administration, Security Governance & Cryptographic Vault'
    }
  };

  const meta = roleStatutoryMap[currentUser.role] || roleStatutoryMap.CA;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '24px 28px',
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        boxShadow: '0 1px 3px rgba(16, 24, 40, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}
    >
      {/* Top Identity Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #EEF2FF',
                boxShadow: '0 2px 8px rgba(79, 70, 229, 0.15)'
              }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--success-500)',
                border: '2px solid #FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800
              }}
              title="Class-3 Digital Signature Active"
            >
              ✓
            </span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {currentUser.name}
              </h2>
              <span className="badge badge-success" style={{ fontSize: '0.7rem', padding: '3px 9px' }}>
                <ShieldCheck size={13} /> Verified {currentUser.role} Practitioner
              </span>
              <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>
                DSC Active (Class 3)
              </span>
            </div>

            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '3px', fontWeight: 600 }}>
              {currentUser.roleTitle} • <strong style={{ color: 'var(--text-primary)' }}>{currentUser.firmName}</strong>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', flexWrap: 'wrap' }}>
              {currentUser.membershipNumber && (
                <span>
                  Membership #: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{currentUser.membershipNumber}</strong>
                </span>
              )}
              {currentUser.copNumber && (
                <>
                  <span>•</span>
                  <span>
                    COP #: <strong className="font-mono" style={{ color: 'var(--text-primary)' }}>{currentUser.copNumber}</strong>
                  </span>
                </>
              )}
              <span>•</span>
              <span>
                Statutory Body: <strong style={{ color: 'var(--text-primary)' }}>{meta.body}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Action: Switch Portal / Sign Out */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={logout}
            className="btn btn-secondary btn-sm"
            style={{
              padding: '8px 14px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#DC2626',
              background: '#FEF2F2',
              borderColor: '#FECACA',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <LogOut size={14} /> Switch Portal / Sign Out
          </button>
        </div>
      </div>

      {/* Specialization Tags & Active Entity */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '14px',
          borderTop: '1px solid #F1F5F9',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.8rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Authorized Mandates:</span>
          {currentUser.specialization.map((spec, i) => (
            <span key={i} className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
              {spec}
            </span>
          ))}
        </div>

        <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem' }}>
          Active Entity Mandate: <strong style={{ color: 'var(--text-primary)' }}>{currentClient.name}</strong> ({currentClient.financialYear})
        </div>
      </div>
    </div>
  );
};

