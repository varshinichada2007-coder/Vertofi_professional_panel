import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle2,
  Building,
  KeyRound,
  UserCheck,
  Sparkles,
  ShieldCheck,
  Scale,
  Calculator,
  Briefcase,
  FileCheck2,
  FileText,
  Clock,
  RefreshCw,
  AlertCircle,
  Check,
  ArrowLeft,
  Phone
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { VertofiLogo } from '../../components/common/VertofiLogo';

export const LoginView: React.FC<{ onStartOnboarding?: () => void }> = () => {
  const { login, signUp, sendTwoFactorOtp, verifyTwoFactorOtp } = useAuth();

  // Mode: Sign In vs Sign Up
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [step, setStep] = useState<'CREDENTIALS' | 'MFA'>('CREDENTIALS');

  // Form Fields
  const [selectedRole, setSelectedRole] = useState<UserRole>('CA');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [maskedRecipient, setMaskedRecipient] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firmName, setFirmName] = useState('');
  const [membershipNumber, setMembershipNumber] = useState('');
  const [copNumber, setCopNumber] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // 2FA State
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState<number>(60);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // 2FA Timer countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'MFA' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, otpTimer]);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (authMode === 'SIGNUP') {
      if (!fullName.trim() || !email.trim() || !password || !phone.trim()) {
        setErrorMessage('Please fill in all mandatory fields including your mobile phone number.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify.');
        return;
      }
    } else {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter your professional email and password.');
        return;
      }
    }

    setIsVerifying(true);
    try {
      const res = await sendTwoFactorOtp(email.trim(), phone.trim());
      setIsVerifying(false);
      setMaskedRecipient(res.maskedRecipient || phone || email);
      setOtpTimer(60);
      setOtpDigits(['', '', '', '', '', '']);
      setStep('MFA');
      setSuccessMessage(res.message || `Verification SMS sent.`);
    } catch {
      setIsVerifying(false);
      setErrorMessage('Could not send verification code. Please check your network and try again.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^[0-9]{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtpDigits(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  const handleVerify2Fa = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullOtp = otpDigits.join('');

    if (fullOtp.length !== 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsVerifying(true);
    const isValid = await verifyTwoFactorOtp(fullOtp, email.trim(), phone.trim());

    if (isValid) {
      if (authMode === 'SIGNUP') {
        signUp({
          name: fullName.trim() || 'Practicing Professional',
          email: email.trim(),
          phone: phone.trim(),
          role: selectedRole,
          firmName: firmName.trim() || `${fullName.trim() || 'Professional'}'s Practice`,
          membershipNumber: membershipNumber.trim() || undefined,
          copNumber: copNumber.trim() || undefined
        });
      } else {
        await login(email.trim(), selectedRole, {
          name: fullName.trim() || undefined,
          phone: phone.trim() || undefined,
          firmName: firmName.trim() || undefined
        });
      }
    } else {
      setIsVerifying(false);
      setErrorMessage('Invalid or expired verification code. Please check your phone messages and try again.');
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await sendTwoFactorOtp(email.trim(), phone.trim());
      setMaskedRecipient(res.maskedRecipient || phone || email);
      setOtpTimer(60);
      setOtpDigits(['', '', '', '', '', '']);
      setSuccessMessage(`New verification code sent via SMS.`);
    } catch {
      setErrorMessage('Could not resend SMS. Please wait and try again.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F6FA',
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, #EEF2FF 0%, #F5F6FA 75%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px'
      }}
    >
      <div style={{ width: '100%', maxWidth: '520px' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <VertofiLogo size={52} showText={true} showSubtitle={true} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="badge badge-neutral" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
              ⚡ Business Portal Sync Active
            </span>
            <span className="badge badge-success" style={{ fontSize: '0.68rem', padding: '3px 8px' }}>
              🛡️ Legal & Compliance Bridge
            </span>
          </div>
        </div>

        {/* Main Authentication Card */}
        <div
          className="saas-card"
          style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '20px',
            padding: '32px 36px',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.07)'
          }}
        >
          {step === 'CREDENTIALS' ? (
            <div>
              {/* Login / Sign Up Tabs */}
              <div
                style={{
                  display: 'flex',
                  background: '#F1F5F9',
                  borderRadius: '10px',
                  padding: '3px',
                  marginBottom: '24px'
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('LOGIN');
                    setErrorMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    fontSize: '0.82rem',
                    fontWeight: authMode === 'LOGIN' ? 800 : 600,
                    border: 'none',
                    borderRadius: '8px',
                    background: authMode === 'LOGIN' ? '#FFFFFF' : 'transparent',
                    color: authMode === 'LOGIN' ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: authMode === 'LOGIN' ? '0 1px 3px rgba(16, 24, 40, 0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('SIGNUP');
                    setErrorMessage('');
                  }}
                  style={{
                    flex: 1,
                    padding: '8px 0',
                    fontSize: '0.82rem',
                    fontWeight: authMode === 'SIGNUP' ? 800 : 600,
                    border: 'none',
                    borderRadius: '8px',
                    background: authMode === 'SIGNUP' ? '#FFFFFF' : 'transparent',
                    color: authMode === 'SIGNUP' ? 'var(--text-primary)' : 'var(--text-muted)',
                    boxShadow: authMode === 'SIGNUP' ? '0 1px 3px rgba(16, 24, 40, 0.08)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Create Account
                </button>
              </div>

              {/* Role Selection Dropdown */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Professional Role / Discipline
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="input-field"
                  style={{ fontWeight: 600 }}
                >
                  <option value="CA">Chartered Accountant (CA) — Statutory Audit & Tax</option>
                  <option value="CMA">Cost & Management Accountant (CMA) — Cost Audit & ITC</option>
                  <option value="CS">Company Secretary (CS) — MCA V3 & Governance</option>
                  <option value="CFO">Chief Financial Officer (CFO) — Treasury & Strategy</option>
                  <option value="ACCOUNTANT">Accountant / Finance Executive — Maker Bookkeeping</option>
                  <option value="AUDITOR">Statutory & Forensic Auditor — Quality Review</option>
                  <option value="INTERNAL_ADMIN">Internal Admin — Practice Operations & Client Setup</option>
                  <option value="SUPER_ADMIN">Super Admin — Managing Partner & Enterprise Controller</option>
                </select>
              </div>

              <form onSubmit={handleCredentialsSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {authMode === 'SIGNUP' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Full Name & Credentials
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. CA Rajesh Kumar, FCA"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                )}

                {authMode === 'SIGNUP' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Firm / Organization Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        placeholder="e.g. Apex Partners & Chartered Accountants"
                        value={firmName}
                        onChange={(e) => setFirmName(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '38px' }}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    Professional Work Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="email"
                      placeholder="name@firm-ca.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '38px' }}
                      required
                    />
                  </div>
                </div>

                {authMode === 'SIGNUP' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Mobile Phone Number (for 2-Step SMS Verification)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '38px' }}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)' }}>Password</label>
                    {authMode === 'LOGIN' && (
                      <a href="#forgot" style={{ fontSize: '0.74rem', color: '#6366F1', textDecoration: 'none', fontWeight: 600 }}>
                        Forgot password?
                      </a>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '38px' }}
                      required
                    />
                  </div>
                </div>

                {authMode === 'SIGNUP' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="password"
                        placeholder="••••••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field"
                        style={{ paddingLeft: '38px' }}
                        required
                      />
                    </div>
                  </div>
                )}

                {authMode === 'LOGIN' && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        style={{ accentColor: '#6366F1' }}
                      />
                      Remember this device
                    </label>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>MFA Protected</span>
                  </div>
                )}

                {errorMessage && (
                  <div style={{ padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertCircle size={14} /> {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '11px',
                    fontWeight: 700,
                    borderRadius: '8px',
                    marginTop: '6px'
                  }}
                >
                  {authMode === 'LOGIN' ? 'Continue to 2-Step Verification' : 'Register & Setup 2FA'} <ArrowRight size={16} />
                </button>
              </form>
            </div>
          ) : (
            /* Step 2: 2-Step Authentication (2FA Verification) */
            <form onSubmit={handleVerify2Fa} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <button
                  type="button"
                  onClick={() => setStep('CREDENTIALS')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    fontWeight: 600
                  }}
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <span className="badge badge-ai" style={{ fontSize: '0.68rem' }}>
                  Class-3 DSC Token Active
                </span>
              </div>

              <div style={{ textAlign: 'center', padding: '6px 0' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: '#EEF2FF',
                    color: '#6366F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto'
                  }}
                >
                  <KeyRound size={24} />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Two-Factor Authentication
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
                  Enter the 6-digit security code sent via SMS to <strong>{maskedRecipient || phone || email}</strong>
                </p>
              </div>

              {/* Secure SMS Dispatch Notice */}
              <div
                style={{
                  background: '#EEF2FF',
                  border: '1px solid #C7D2FE',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '0.78rem',
                  color: '#3730A3'
                }}
              >
                <ShieldCheck size={20} color="#4F46E5" />
                <div>
                  <div style={{ fontWeight: 700 }}>Real-Time SMS Verification Dispatched</div>
                  <div style={{ fontSize: '0.72rem', color: '#4338CA', marginTop: '2px' }}>
                    Please check your phone text messages for your 6-digit one-time code.
                  </div>
                </div>
              </div>

              {/* 6 Individual Digit Inputs */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }} onPaste={handleOtpPaste}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpInputsRef.current[i] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="font-mono"
                    style={{
                      width: '46px',
                      height: '52px',
                      textAlign: 'center',
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      borderRadius: '10px',
                      border: digit ? '2px solid #6366F1' : '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      outline: 'none',
                      boxShadow: digit ? '0 0 0 3px rgba(99, 102, 241, 0.12)' : 'none'
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {/* Countdown & Resend Code */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> Expires in: <strong style={{ color: 'var(--text-primary)' }}>{otpTimer}s</strong>
                </span>

                {otpTimer === 0 ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#6366F1',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RefreshCw size={12} /> Resend Security Code
                  </button>
                ) : (
                  <span>Resend available after timer</span>
                )}
              </div>

              {errorMessage && (
                <div style={{ padding: '8px 12px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', color: '#DC2626', fontSize: '0.76rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertCircle size={14} /> {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="btn btn-primary"
                style={{
                  padding: '11px',
                  fontWeight: 700,
                  borderRadius: '8px',
                  marginTop: '4px'
                }}
              >
                {isVerifying ? 'Validating Token...' : `Verify & Enter ${selectedRole} Portal`}
              </button>
            </form>
          )}
        </div>

        {/* Multi-Panel Architecture Assurance */}
        <div
          style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5
          }}
        >
          🔒 <strong>Enterprise Architecture</strong>: Business Transaction Ingestion → Financial Professional Validation → Legal & Statutory Defense
        </div>
      </div>
    </div>
  );
};
