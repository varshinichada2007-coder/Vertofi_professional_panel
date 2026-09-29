import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalSearchModal } from './components/layout/GlobalSearchModal';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { AiDrawer } from './components/layout/AiDrawer';
import { ToastContainer } from './components/layout/ToastContainer';

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

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activeView, setIsAiDrawerOpen } = useApp();
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);

  useEffect(() => {
    if (activeView === 'ai-assistant') {
      setIsAiDrawerOpen(true);
    }
  }, [activeView, setIsAiDrawerOpen]);

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
      case 'ai-assistant':
        return <DashboardView />;
      case 'settings':
        return <SettingsView />;
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
      <GlobalSearchModal />
      <NotificationDrawer />
      <AiDrawer />
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
