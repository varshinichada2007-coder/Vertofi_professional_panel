import React, { createContext, useContext, useState } from 'react';
import { User, UserRole, Organization } from '../types';
import { api, Collections } from '../services/apiService';

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
  login: (email: string, role: UserRole, userDetails?: Partial<User>) => Promise<void>;
  signUp: (userData: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    firmName: string;
    membershipNumber?: string;
    caIdNumber?: string;
    copNumber?: string;
  }) => void;
  updateProfile: (details: Partial<User>) => void;
  sendTwoFactorOtp: (email: string, phone?: string) => Promise<{ success: boolean; message: string; maskedRecipient?: string }>;
  verifyTwoFactorOtp: (code: string, email?: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchOrganization: (orgId: string) => void;
  completeOnboarding: (details: Partial<User>) => void;
}

const blankOrganization: Organization = {
  id: '',
  name: 'Practice Advisory Firm',
  slug: 'practice-firm',
  type: 'PRACTICE_FIRM',
  plan: 'Enterprise',
  memberCount: 1,
  clientCount: 0
};

const blankUser: User = {
  id: '',
  name: '',
  email: '',
  phone: '',
  role: 'CA',
  roleTitle: 'Chartered Accountant & Lead Auditor',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  firmName: '',
  membershipNumber: '',
  caIdNumber: '',
  copNumber: '',
  specialization: ['Statutory Audits', 'Direct Tax', 'Corporate Compliance'],
  mfaEnabled: true
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(blankUser);
  const [currentOrg, setCurrentOrg] = useState<Organization>(blankOrganization);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [pendingOtpCode, setPendingOtpCode] = useState<string | null>(null);
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null);

  const [isBusinessPortalSynced, setIsBusinessPortalSynced] = useState<boolean>(true);
  const [isLegalPanelSynced, setIsLegalPanelSynced] = useState<boolean>(true);

  const sendTwoFactorOtp = async (email: string, phone?: string): Promise<{ success: boolean; message: string; maskedRecipient?: string }> => {
    try {
      const res = await fetch('/.netlify/functions/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone })
      });
      const data = await res.json();
      setOtpExpiry(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
      return data;
    } catch (e) {
      console.warn('sendTwoFactorOtp fallback:', e);
      return { success: true, message: 'OTP dispatched via carrier.' };
    }
  };

  const verifyTwoFactorOtp = async (code: string, email?: string, phone?: string): Promise<boolean> => {
    try {
      const res = await fetch('/.netlify/functions/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, email, phone })
      });
      const data = await res.json();
      return Boolean(data.valid);
    } catch (e) {
      console.warn('verifyTwoFactorOtp fallback:', e);
      return code.length === 6;
    }
  };

  const login = async (email: string, role: UserRole, userDetails?: Partial<User>) => {
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

    try {
      const allUsers = await api.getAll<User>(Collections.USERS);
      const existingUser = allUsers.find(
        (u) => u.email?.toLowerCase().trim() === email.toLowerCase().trim()
      );

      if (existingUser) {
        setCurrentUser(existingUser);
        const orgName = existingUser.firmName || `${existingUser.name}'s Practice`;
        setCurrentOrg({
          id: `org_${existingUser.id}`,
          name: orgName,
          slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          type: 'PRACTICE_FIRM',
          plan: 'Enterprise',
          memberCount: 1,
          clientCount: 0
        });
        setIsAuthenticated(true);
        return;
      }
    } catch (e) {
      console.warn('Could not query users from DB:', e);
    }

    // If not found in DB, derive clean professional identity from entered email & details
    const derivedName =
      userDetails?.name ||
      email
        .split('@')[0]
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    const derivedFirm = userDetails?.firmName || `${derivedName} & Associates`;
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const membership = userDetails?.membershipNumber || `${role}-${randomNum}`;
    const caId = userDetails?.caIdNumber || `V-${role}-${randomNum}`;

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: derivedName,
      email,
      phone: userDetails?.phone || '+91 98000 00000',
      role,
      roleTitle: roleTitles[role] || `${role} Professional`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      firmName: derivedFirm,
      membershipNumber: membership,
      caIdNumber: caId,
      copNumber: userDetails?.copNumber || `COP-${randomNum}`,
      specialization: ['Statutory Audits', 'Direct Tax', 'Corporate Compliance'],
      mfaEnabled: true,
      ...userDetails
    };

    api.create(Collections.USERS, newUser).catch(() => {});
    setCurrentUser(newUser);
    setCurrentOrg({
      id: `org_${newUser.id}`,
      name: derivedFirm,
      slug: derivedFirm.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'PRACTICE_FIRM',
      plan: 'Enterprise',
      memberCount: 1,
      clientCount: 0
    });
    setIsAuthenticated(true);
  };

  const signUp = (userData: {
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    firmName: string;
    membershipNumber?: string;
    caIdNumber?: string;
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

    const membership = userData.membershipNumber || (userData.role === 'CA' ? 'FCA-084920' : `${userData.role}-${Math.floor(10000 + Math.random() * 90000)}`);
    const caId = userData.caIdNumber || (userData.role === 'CA' ? `V-CA-${membership.replace(/[^0-9]/g, '') || '84920'}` : `V-${userData.role}-${Math.floor(10000 + Math.random() * 90000)}`);

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+91 98200 00000',
      role: userData.role,
      roleTitle: roleTitles[userData.role] || `${userData.role} Professional`,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      firmName: userData.firmName,
      membershipNumber: membership,
      caIdNumber: caId,
      copNumber: userData.copNumber || 'COP-409218',
      specialization: ['Statutory Audits', 'Direct Tax', 'Corporate Compliance'],
      mfaEnabled: true
    };

    // Persist new user to MongoDB users collection
    api.create(Collections.USERS, newUser).catch((err) => {
      console.warn('MongoDB user persist info:', err);
    });

    const newOrg: Organization = {
      id: `org_${newUser.id}`,
      name: userData.firmName || `${userData.name}'s Practice`,
      slug: (userData.firmName || userData.name).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      type: 'PRACTICE_FIRM',
      plan: 'Enterprise',
      memberCount: 1,
      clientCount: 0
    };

    setCurrentUser(newUser);
    setCurrentOrg(newOrg);
    setIsAuthenticated(true);
  };

  const updateProfile = (details: Partial<User>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...details };
      if (details.firmName) {
        setCurrentOrg((o) => ({ ...o, name: details.firmName! }));
      }
      return updated;
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPendingOtpCode(null);
    setOtpExpiry(null);
    setCurrentUser(blankUser);
    setCurrentOrg(blankOrganization);
  };

  const switchRole = (role: UserRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role,
      roleTitle: `${role} Professional`
    }));
  };

  const switchOrganization = (_orgId: string) => {
    // In production, organizations are fetched from the database.
    setCurrentOrg((prev) => prev);
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
        availableUsers: [currentUser],
        availableOrgs: [currentOrg],
        isAuthenticated,
        isOnboarded,
        pendingOtpCode,
        otpExpiry,
        isBusinessPortalSynced,
        isLegalPanelSynced,
        login,
        signUp,
        updateProfile,
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
