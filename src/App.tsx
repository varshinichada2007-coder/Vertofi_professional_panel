import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { ToastContainer } from './components/layout/ToastContainer';
import { UserProfileModal } from './components/profile/UserProfileModal';

// Views
import { LoginView } from './views/auth/LoginView';
import { OnboardingWizard } from './views/auth/OnboardingWizard';
import { DashboardView } from './views/dashboard/DashboardView';
import { MyTasksView } from './views/tasks/MyTasksView';
import { ClientsListView } from './views/clients/ClientsListView';
import { Client360View } from './views/clients/Client360View';
import { AccountingView } from './views/accounting/AccountingView';
import { TaxComplianceView } from './views/tax/TaxComplianceView';
import { AccountsReceivableView } from './views/receivables/AccountsReceivableView';
import { AccountsPayableView } from './views/payables/AccountsPayableView';
import { BankReconciliationView } from './views/reconciliation/BankReconciliationView';
import { DocumentManagementView } from './views/documents/DocumentManagementView';
import { NoticesView } from './views/notices/NoticesView';
import { ExceptionsRiskView } from './views/exceptions/ExceptionsRiskView';
import { ApprovalCentreView } from './views/approvals/ApprovalCentreView';
import { AuditTrailView } from './views/audit/AuditTrailView';
import { AnalyticsView } from './views/analytics/AnalyticsView';
import { ProfessionalNetworkView } from './views/network/ProfessionalNetworkView';
import { BhsView } from './views/bhs/BhsView';
import { SettingsView } from './views/settings/SettingsView';
import { ProfileView } from './views/profile/ProfileView';
import { ClientQueriesView } from './views/queries/ClientQueriesView';
import { BusinessSyncView } from './views/businessSync/BusinessSyncView';

const LoadingScreen: React.FC = () => (
  <div style={{
    position: 'fixed', inset: 0,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg-app, #f8faff)',
    gap: '20px',
    zIndex: 9999
  }}>
    <div style={{
      width: 56, height: 56,
      border: '4px solid var(--border-color, #e2e8f0)',
      borderTopColor: 'var(--color-primary, #4F46E5)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite'
    }} />
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary, #1e293b)', margin: 0 }}>Vertofi</p>
      <p style={{ fontSize: 13, color: 'var(--text-secondary, #64748b)', margin: '4px 0 0' }}>Connecting to database…</p>
    </div>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeView, isLoading } = useApp();
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  if (isLoading) return <LoadingScreen />;

  if (!isAuthenticated) {
    if (isOnboardingActive) {
      return <OnboardingWizard onComplete={() => setIsOnboardingActive(false)} />;
    }
    return <LoginView onStartOnboarding={() => setIsOnboardingActive(true)} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <MyTasksView />;
      case 'clients':
        return <ClientsListView />;
      case 'client-360':
        return <Client360View />;
      case 'accounting':
        return <AccountingView />;
      case 'tax':
        return <TaxComplianceView />;
      case 'ar':
        return <AccountsReceivableView />;
      case 'ap':
        return <AccountsPayableView />;
      case 'reconciliation':
        return <BankReconciliationView />;
      case 'documents':
        return <DocumentManagementView />;
      case 'notices':
        return <NoticesView />;
      case 'exceptions':
        return <ExceptionsRiskView />;
      case 'approvals':
        return <ApprovalCentreView />;
      case 'audit':
        return <AuditTrailView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'network':
        return <ProfessionalNetworkView />;
      case 'bhs':
        return <BhsView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      case 'queries':
        return <ClientQueriesView />;
      case 'business-sync':
        return <BusinessSyncView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-app)' }}>
      {/* Collapsible Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals, Drawers & Toasts */}
      <UserProfileModal />
      <GlobalSearchModal />
      <NotificationDrawer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
