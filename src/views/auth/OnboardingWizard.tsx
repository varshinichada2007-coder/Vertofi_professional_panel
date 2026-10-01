import React, { useState } from 'react';
import {
  UserCheck,
  Building,
  Award,
  Shield,
  Users,
  Briefcase,
  Bell,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Zap,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { VertofiLogo } from '../../components/common/VertofiLogo';

export const OnboardingWizard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { completeOnboarding, currentUser, currentOrg } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: currentUser.name || '',
    email: currentUser.email || '',
    role: (currentUser.role || 'CA') as UserRole,
    specializations: ['Direct Tax & Transfer Pricing', 'Statutory Audits'],
    membershipNumber: currentUser.membershipNumber || '',
    copNumber: '',
    firmName: currentOrg.name || '',
    firmGstin: '',
    invitedEmails: [] as string[],
    selectedClients: [] as string[],
    notificationPref: { email: true, sms: true, inApp: true, whatsapp: false }
  });

  const steps = [
    { num: 1, label: 'Professional Details', icon: UserCheck },
    { num: 2, label: 'Role Selection', icon: Briefcase },
    { num: 3, label: 'Specializations', icon: Award },
    { num: 4, label: 'Verification & COP', icon: Shield },
    { num: 5, label: 'Firm Details', icon: Building },
    { num: 6, label: 'Invite Team', icon: Users },
    { num: 7, label: 'Assign Clients', icon: Briefcase },
    { num: 8, label: 'Notifications', icon: Bell },
    { num: 9, label: 'Finish Setup', icon: CheckCircle2 }
  ];

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding({
        name: formData.fullName,
        role: formData.role,
        membershipNumber: formData.membershipNumber,
        copNumber: formData.copNumber,
        firmName: formData.firmName,
        specialization: formData.specializations
      });
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #EEF2FF 0%, #F8FAFC 85%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          padding: '32px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <VertofiLogo size={34} showText={false} />
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Professional Onboarding Wizard</h2>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                Step {currentStep} of 9: {steps[currentStep - 1].label}
              </p>
            </div>
          </div>
          <span className="badge badge-ai" style={{ fontSize: '0.72rem' }}>
            <Sparkles size={12} /> Guided Setup
          </span>
        </div>

        {/* Progress Stepper Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '4px',
            marginBottom: '28px',
            background: 'var(--bg-subtle)',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          {steps.map((s) => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;
            return (
              <div
                key={s.num}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: isCurrent || isCompleted ? 1 : 0.45
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isCompleted ? 'var(--success-500)' : isCurrent ? 'var(--primary-500)' : 'var(--border-strong)',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Contents */}
        <div style={{ minHeight: '260px' }}>
          {currentStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Step 1: Professional Details</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Enter your identity as an authorized financial or governance practitioner.
              </p>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Full Name with Qualifications</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Primary Professional Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Step 2: Professional Role</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Select your primary statutory or executive operating role:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {(['CA', 'CMA', 'CS', 'CFO', 'ACCOUNTANT', 'AUDITOR'] as UserRole[]).map((r) => (
                  <div
                    key={r}
                    onClick={() => setFormData({ ...formData, role: r })}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-sm)',
                      background: formData.role === r ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-subtle)',
                      border: formData.role === r ? '1px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer'
                    }}
                    className="glass-panel-hover"
                  >
                    <div style={{ fontWeight: 700, color: 'var(--primary-500)' }}>{r}</div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {r === 'CA' ? 'Chartered Accountant (Direct Tax & Audit)' : r === 'CMA' ? 'Cost & Management Accountant' : r === 'CS' ? 'Company Secretary & Legal MCA' : r === 'CFO' ? 'Finance Head & Treasury' : r === 'AUDITOR' ? 'Independent Reviewer' : 'Financial Executive'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Step 3: Professional Specializations</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Select key practice competencies for automated task routing:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {[
                  'Direct Tax & Transfer Pricing',
                  'GST Inward/Outward ITC Recon',
                  'Statutory & CARO 2020 Audits',
                  'MCA AOC-4 & Secretarial Filing',
                  'Bank Reconciliation Automation',
                  'Forensic Exception Detection'
                ].map((spec) => {
                  const isChecked = formData.specializations.includes(spec);
                  return (
                    <div
                      key={spec}
                      onClick={() => {
                        if (isChecked) {
                          setFormData({ ...formData, specializations: formData.specializations.filter((s) => s !== spec) });
                        } else {
                          setFormData({ ...formData, specializations: [...formData.specializations, spec] });
                        }
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        background: isChecked ? 'rgba(99, 102, 241, 0.15)' : 'var(--bg-subtle)',
                        border: isChecked ? '1px solid var(--primary-500)' : '1px solid var(--border-subtle)',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{spec}</span>
                      {isChecked && <CheckCircle2 size={16} color="var(--primary-500)" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Step 4: Statutory Verification Credentials</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Enter professional institute registration for tamper-proof digital signoffs:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>ICAI / ICMAI / ICSI Membership #</label>
                  <input
                    type="text"
                    value={formData.membershipNumber}
                    onChange={(e) => setFormData({ ...formData, membershipNumber: e.target.value })}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Certificate of Practice (COP) #</label>
                  <input
                    type="text"
                    value={formData.copNumber}
                    onChange={(e) => setFormData({ ...formData, copNumber: e.target.value })}
                    className="input-field"
                    style={{ marginTop: '4px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Step 5: Organization / Practice Firm</h3>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Practice Firm Legal Name</label>
                <input
                  type="text"
                  value={formData.firmName}
                  onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Firm GSTIN</label>
                <input
                  type="text"
                  value={formData.firmGstin}
                  onChange={(e) => setFormData({ ...formData, firmGstin: e.target.value })}
                  className="input-field"
                  style={{ marginTop: '4px' }}
                />
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Step 6: Invite Team Members & Assign RBAC</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Collaborate with junior accountants, partner reviewers, and audit leads:
              </p>
              {formData.invitedEmails.map((em, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="email"
                    value={em}
                    readOnly
                    className="input-field"
                    style={{ background: 'var(--bg-subtle)' }}
                  />
                  <span className="badge badge-info" style={{ alignSelf: 'center' }}>Invited</span>
                </div>
              ))}
            </div>
          )}

          {currentStep === 7 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Step 7: Authorized Client Entities</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Select initial client businesses to link to your workspace:
              </p>
              {['Acme FinTech Technologies Pvt Ltd', 'Nexus Retail Tech Ltd', 'Bharat BioPharma Corp'].map((c) => (
                <div
                  key={c}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontSize: '0.84rem', fontWeight: 600 }}>{c}</span>
                  <CheckCircle2 size={16} color="var(--success-500)" />
                </div>
              ))}
            </div>
          )}

          {currentStep === 8 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Step 8: Notification & SLA Alerts</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { key: 'inApp', label: 'In-App Compliance & Approval Push Alerts' },
                  { key: 'email', label: 'Daily SLA & Statutory Notice Digest (Email)' },
                  { key: 'sms', label: 'Critical Risk & Exception SMS Notifications' }
                ].map((n) => (
                  <div
                    key={n.key}
                    style={{
                      padding: '10px 12px',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span style={{ fontSize: '0.82rem' }}>{n.label}</span>
                    <span className="badge badge-success">Enabled</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 9 && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--success-bg)',
                  border: '2px solid var(--success-500)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}
              >
                <CheckCircle2 size={32} color="var(--success-500)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Workspace Setup Completed!</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', maxWidth: '460px', margin: '8px auto 0 auto', lineHeight: 1.5 }}>
                Your professional profile as <strong>{formData.role}</strong> with <strong>{formData.firmName}</strong> is verified. All tenant isolation, maker-checker, and audit rules are initialized.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '28px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)'
          }}
        >
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className="btn btn-secondary"
            style={{ opacity: currentStep === 1 ? 0.4 : 1 }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <button onClick={handleNext} className="btn btn-primary">
            {currentStep === 9 ? 'Launch Operating Workspace' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
