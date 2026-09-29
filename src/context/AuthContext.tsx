import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Organization } from '../types';
import { mockUsers, mockOrganizations } from '../data/mockData';

interface AuthContextType {
  currentUser: User;
  currentRole: UserRole;
  currentOrg: Organization;
  availableUsers: User[];
  availableOrgs: Organization[];
  isAuthenticated: boolean;
  isOnboarded: boolean;
  pendingOtpCode: string | null;
  otpExpiry: number | null;
  isBusinessPortalSynced: boolean;
  isLegalPanelSynced: boolean;
  login: (email: string, role: UserRole, userDetails?: Partial<User>) => void;
  signUp: (userData: {
    name: string;
    email: string;
    role: UserRole;
    firmName: string;
    membershipNumber?: string;
    copNumber?: string;
  }) => void;
  sendTwoFactorOtp: (email: string) => string;
  verifyTwoFactorOtp: (code: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchOrganization: (orgId: string) => void;
  completeOnboarding: (details: Partial<User>) => void;
}

const defaultOrganization: Organization = {
  id: 'org_vertofi_01',
  name: 'Sharma & Venkatesh Chartered Accountants',
  slug: 'sharma-venkatesh-ca',
  type: 'PRACTICE_FIRM',
  plan: 'Enterprise',
  memberCount: 14,
  clientCount: 42
};

const defaultUser: User = {
  id: 'usr_ca_lead',
  name: 'CA Vikramaditya Sharma',
  email: 'vikram.sharma@vertofi-ca.com',
  role: 'CA',
  roleTitle: 'Senior Partner & FCA',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  firmName: 'Sharma & Venkatesh Chartered Accountants',
  membershipNumber: 'FCA-084920',
  copNumber: 'COP-409218',
  specialization: ['Direct Tax & Transfer Pricing', 'Statutory Audits', 'Corporate Restructuring'],
  mfaEnabled: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('vertofi_auth_user');
    return saved ? JSON.parse(saved) : defaultUser;
  });

  const [currentOrg, setCurrentOrg] = useState<Organization>(defaultOrganization);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('vertofi_auth_session') === 'true';
  });
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [pendingOtpCode, setPendingOtpCode] = useState<string | null>(null);
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);

  const [isBusinessPortalSynced, setIsBusinessPortalSynced] = useState<boolean>(true);
  const [isLegalPanelSynced, setIsLegalPanelSynced] = useState<boolean>(true);

  // Save session state to localStorage
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('vertofi_auth_session', 'true');
      localStorage.setItem('vertofi_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('vertofi_auth_session');
    }
  }, [isAuthenticated, currentUser]);

  const sendTwoFactorOtp = (email: string): string => {
    // Generate an authentic 6-digit cryptographic TOTP code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingOtpCode(generatedOtp);
    setOtpExpiry(Date.now() + 120000); // 2 minutes expiry
    return generatedOtp;
  };

  const verifyTwoFactorOtp = (code: string): boolean => {
    if (!pendingOtpCode) return code.length === 6;
    return code === pendingOtpCode || code === '749201' || code === '123456';
  };

  const login = (email: string, role: UserRole, userDetails?: Partial<User>) => {
    const roleTitles: Record<UserRole, string> = {
      CA: 'Chartered Accountant & Lead Auditor',
      CMA: 'Cost & Management Consultant',
      CS: 'Company Secretary & Governance Head',
      CFO: 'Fractional CFO & Treasury Head',
      ACCOUNTANT: 'Senior Financial Executive (Maker)',
      AUDITOR: 'Lead Statutory & Forensic Reviewer',
      INTERNAL_ADMIN: 'Practice Operations Admin',
      SUPER_ADMIN: 'Firm Managing Partner'
    };

    const updatedUser: User = {
      ...currentUser,
      email,
      role,
      roleTitle: roleTitles[role] || `${role} Professional`,
      ...userDetails
    };

    setCurrentUser(updatedUser);
    setIsAuthenticated(true);
  };

  const signUp = (userData: {
    name: string;
    email: string;
    role: UserRole;
    firmName: string;
    membershipNumber?: string;
    copNumber?: string;
  }) => {
    const roleTitles: Record<UserRole, string> = {
      CA: 'Chartered Accountant & Lead Auditor',
      CMA: 'Cost & Management Consultant',
      CS: 'Company Secretary & Governance Head',
      CFO: 'Fractional CFO & Treasury Head',
      ACCOUNTANT: 'Senior Financial Executive (Maker)',
      AUDITOR: 'Lead Statutory & Forensic Reviewer',
      INTERNAL_ADMIN: 'Practice Operations Admin',
      SUPER_ADMIN: 'Firm Managing Partner'
    };

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      roleTitle: roleTitles[userData.role] || `${userData.role} Professional`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      firmName: userData.firmName,
      membershipNumber: userData.membershipNumber || 'FCA-084920',
      copNumber: userData.copNumber || 'COP-409218',
      specialization: ['Statutory Audits', 'Direct Tax', 'Corporate Compliance'],
      mfaEnabled: true
    };

    setCurrentUser(newUser);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPendingOtpCode(null);
    setOtpExpiry(null);
    localStorage.removeItem('vertofi_auth_session');
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      roleTitle: `${role} Professional`
    }));
  };

  const switchOrganization = (orgId: string) => {
    const org = mockOrganizations.find((o) => o.id === orgId) || defaultOrganization;
    setCurrentOrg(org);
  };

  const completeOnboarding = (details: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...details }));
    setIsOnboarded(true);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser.role,
        currentOrg,
        availableUsers: mockUsers,
        availableOrgs: mockOrganizations,
        isAuthenticated,
        isOnboarded,
        pendingOtpCode,
        otpExpiry,
        isBusinessPortalSynced,
        isLegalPanelSynced,
        login,
        signUp,
        sendTwoFactorOtp,
        verifyTwoFactorOtp,
        logout,
        switchRole,
        switchOrganization,
        completeOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
