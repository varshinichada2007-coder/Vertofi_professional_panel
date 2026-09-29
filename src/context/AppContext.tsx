import React, { createContext, useContext, useState } from 'react';
import {
  ClientEntity,
  ProfessionalTask,
  Account,
  JournalEntry,
  Invoice,
  GstFilingRecord,
  TdsRecord,
  BankAccount,
  BankTransaction,
  DocumentItem,
  StatutoryNotice,
  RiskException,
  ApprovalItem,
  AuditLogItem,
  BhsReport,
  AppNotification
} from '../types';
import {
  mockClients,
  mockTasks,
  mockAccounts,
  mockJournalEntries,
  mockInvoices,
  mockGstRecords,
  mockTdsRecords,
  mockBankAccounts,
  mockBankTransactions,
  mockDocuments,
  mockStatutoryNotices,
  mockRiskExceptions,
  mockApprovals,
  mockAuditLogs,
  mockBhsReport,
  mockNotifications
} from '../data/mockData';
import { useAuth } from './AuthContext';

export type NavView =
  | 'dashboard'
  | 'tasks'
  | 'clients'
  | 'client-360'
  | 'accounting'
  | 'tax'
  | 'ar'
  | 'ap'
  | 'reconciliation'
  | 'documents'
  | 'notices'
  | 'exceptions'
  | 'approvals'
  | 'audit'
  | 'analytics'
  | 'network'
  | 'bhs'
  | 'ai-assistant'
  | 'notifications'
  | 'settings';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

interface AppContextType {
  currentClient: ClientEntity;
  clients: ClientEntity[];
  switchClient: (clientId: string) => void;
  financialPeriod: string;
  setFinancialPeriod: (period: string) => void;
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Data lists & mutations
  tasks: ProfessionalTask[];
  updateTaskStatus: (taskId: string, newStatus: ProfessionalTask['status']) => void;
  createTask: (task: Partial<ProfessionalTask>) => void;
  
  accounts: Account[];
  journalEntries: JournalEntry[];
  submitJournalEntry: (entry: Partial<JournalEntry>) => void;
  approveJournalEntry: (id: string) => void;
  
  invoices: Invoice[];
  createInvoice: (invoice: Partial<Invoice>) => void;
  
  gstRecords: GstFilingRecord[];
  tdsRecords: TdsRecord[];
  
  bankAccounts: BankAccount[];
  bankTransactions: BankTransaction[];
  reconcileTransaction: (transactionId: string) => void;
  
  documents: DocumentItem[];
  uploadDocument: (doc: Partial<DocumentItem>) => void;
  
  statutoryNotices: StatutoryNotice[];
  updateNoticeStatus: (noticeId: string, status: StatutoryNotice['status']) => void;
  
  riskExceptions: RiskException[];
  resolveRiskException: (exceptionId: string) => void;
  
  approvals: ApprovalItem[];
  approveItem: (approvalId: string) => void;
  rejectItem: (approvalId: string) => void;
  
  auditLogs: AuditLogItem[];
  addAuditLog: (log: Omit<AuditLogItem, 'id' | 'timestamp' | 'recordHash'>) => void;
  
  bhsReport: BhsReport;
  
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Modals & Drawers
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [clients] = useState<ClientEntity[]>(mockClients);
  const [currentClient, setCurrentClient] = useState<ClientEntity>(mockClients[0]);
  const [financialPeriod, setFinancialPeriod] = useState<string>('FY 2024-25');
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const [tasks, setTasks] = useState<ProfessionalTask[]>(mockTasks);
  const [accounts] = useState<Account[]>(mockAccounts);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [gstRecords] = useState<GstFilingRecord[]>(mockGstRecords);
  const [tdsRecords] = useState<TdsRecord[]>(mockTdsRecords);
  const [bankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>(mockBankTransactions);
  const [documents, setDocuments] = useState<DocumentItem[]>(mockDocuments);
  const [statutoryNotices, setStatutoryNotices] = useState<StatutoryNotice[]>(mockStatutoryNotices);
  const [riskExceptions, setRiskExceptions] = useState<RiskException[]>(mockRiskExceptions);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(mockApprovals);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(mockAuditLogs);
  const [bhsReport] = useState<BhsReport>(mockBhsReport);
  const [notifications, setNotifications] = useState<AppNotification[]>(mockNotifications);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const showToast = (title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const switchClient = (clientId: string) => {
    const found = clients.find((c) => c.id === clientId);
    if (found) {
      setCurrentClient(found);
      showToast('Client Context Switched', `Active client is now ${found.name}`, 'info');
      addAuditLog({
        userId: currentUser.id,
        userName: currentUser.name,
        userRole: currentUser.role,
        clientId: found.id,
        clientName: found.name,
        module: 'SETTINGS',
        action: 'UPDATED',
        resource: 'ClientContext',
        resourceId: found.id,
        newValue: `Switched context to ${found.name}`,
        ipAddress: '103.21.144.92 (Mumbai, IN)'
      });
    }
  };

  const addAuditLog = (log: Omit<AuditLogItem, 'id' | 'timestamp' | 'recordHash'>) => {
    const newLog: AuditLogItem = {
      ...log,
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recordHash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const updateTaskStatus = (taskId: string, newStatus: ProfessionalTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined } : t))
    );
    showToast('Task Updated', `Task status changed to ${newStatus.replace('_', ' ')}`, 'success');
  };

  const createTask = (newTask: Partial<ProfessionalTask>) => {
    const item: ProfessionalTask = {
      id: `tsk_${Date.now()}`,
      title: newTask.title || 'New Task',
      description: newTask.description || '',
      clientId: currentClient.id,
      clientName: currentClient.name,
      type: newTask.type || 'MIS_REPORT',
      priority: newTask.priority || 'MEDIUM',
      dueDate: newTask.dueDate || '2026-11-01',
      slaHoursRemaining: 72,
      assignedTo: currentUser.id,
      assignedToName: currentUser.name,
      assignedRole: currentUser.role,
      status: 'UPCOMING',
      createdAt: new Date().toISOString(),
      commentsCount: 0,
      attachmentsCount: 0
    };
    setTasks((prev) => [item, ...prev]);
    showToast('Task Created', `Task "${item.title}" has been assigned.`, 'success');
  };

  const submitJournalEntry = (entry: Partial<JournalEntry>) => {
    const jv: JournalEntry = {
      id: `jv_${Date.now()}`,
      voucherNumber: `JV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientId: currentClient.id,
      date: new Date().toISOString().split('T')[0],
      narration: entry.narration || '',
      totalDebit: entry.totalDebit || 0,
      totalCredit: entry.totalCredit || 0,
      status: 'SUBMITTED',
      makerName: currentUser.name,
      makerRole: currentUser.role,
      submittedAt: new Date().toISOString(),
      tags: ['Manual Voucher', 'Review Pending'],
      lines: entry.lines || []
    };
    setJournalEntries((prev) => [jv, ...prev]);
    showToast('Journal Voucher Submitted', `${jv.voucherNumber} sent for Maker-Checker review.`, 'success');
    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      clientId: currentClient.id,
      clientName: currentClient.name,
      module: 'ACCOUNTING',
      action: 'CREATED',
      resource: 'JournalVoucher',
      resourceId: jv.voucherNumber,
      newValue: `Created voucher for ₹${jv.totalDebit.toLocaleString('en-IN')}`,
      ipAddress: '103.21.144.92 (Mumbai, IN)'
    });
  };

  const approveJournalEntry = (id: string) => {
    setJournalEntries((prev) =>
      prev.map((jv) =>
        jv.id === id
          ? {
              ...jv,
              status: 'APPROVED',
              checkerName: currentUser.name,
              checkerRole: currentUser.role,
              approvedAt: new Date().toISOString(),
              postedAt: new Date().toISOString()
            }
          : jv
      )
    );
    showToast('Journal Voucher Approved', 'Voucher posted to General Ledger.', 'success');
  };

  const createInvoice = (invoice: Partial<Invoice>) => {
    const inv: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: currentClient.id,
      clientName: currentClient.name,
      partyType: invoice.partyType || 'CUSTOMER',
      partyName: invoice.partyName || 'Customer Ltd',
      partyGstin: invoice.partyGstin || '27AAACA1234F1Z5',
      partyPan: invoice.partyPan || 'AAACA1234F',
      date: new Date().toISOString().split('T')[0],
      dueDate: invoice.dueDate || '2026-11-15',
      type: 'TAX_INVOICE',
      status: 'ISSUED',
      subtotal: invoice.subtotal || 100000,
      totalTax: invoice.totalTax || 18000,
      cgstTotal: (invoice.totalTax || 18000) / 2,
      sgstTotal: (invoice.totalTax || 18000) / 2,
      igstTotal: 0,
      grandTotal: (invoice.subtotal || 100000) + (invoice.totalTax || 18000),
      amountPaid: 0,
      amountDue: (invoice.subtotal || 100000) + (invoice.totalTax || 18000),
      qrCodeGenerated: true,
      eInvoiceStatus: 'GENERATED',
      reconciliationStatus: 'UNMATCHED',
      items: invoice.items || []
    };
    setInvoices((prev) => [inv, ...prev]);
    showToast('Invoice Issued', `Invoice ${inv.invoiceNumber} generated with IRN & QR.`, 'success');
  };

  const reconcileTransaction = (transactionId: string) => {
    setBankTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'MATCHED', matchConfidence: 100 } : t))
    );
    showToast('Reconciliation Complete', 'Transaction matched and posted against ledger.', 'success');
  };

  const uploadDocument = (doc: Partial<DocumentItem>) => {
    const item: DocumentItem = {
      id: `doc_${Date.now()}`,
      title: doc.title || 'Uploaded Document',
      clientId: currentClient.id,
      category: doc.category || 'OTHER',
      fileName: doc.fileName || 'file.pdf',
      fileSize: '2.4 MB',
      fileType: 'application/pdf',
      uploadedBy: currentUser.name,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      version: 1,
      ocrExtracted: true,
      ocrConfidence: 97.5,
      status: 'VERIFIED',
      tags: ['OCR Verified', 'Uploaded']
    };
    setDocuments((prev) => [item, ...prev]);
    showToast('Document Uploaded & OCR Processed', `Indexed ${item.title} with 97.5% OCR confidence.`, 'success');
  };

  const updateNoticeStatus = (noticeId: string, status: StatutoryNotice['status']) => {
    setStatutoryNotices((prev) => prev.map((n) => (n.id === noticeId ? { ...n, status } : n)));
    showToast('Statutory Notice Updated', `Notice status changed to ${status}`, 'success');
  };

  const resolveRiskException = (exceptionId: string) => {
    setRiskExceptions((prev) => prev.map((e) => (e.id === exceptionId ? { ...e, status: 'RESOLVED' } : e)));
    showToast('Exception Resolved', 'Corrective action verified and logged in audit lineage.', 'success');
  };

  const approveItem = (approvalId: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === approvalId ? { ...a, status: 'APPROVED' } : a)));
    showToast('Maker-Checker Approved', 'Authorization signed and released.', 'success');
  };

  const rejectItem = (approvalId: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === approvalId ? { ...a, status: 'REJECTED' } : a)));
    showToast('Item Rejected', 'Returned to maker with revision remarks.', 'warning');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentClient,
        clients,
        switchClient,
        financialPeriod,
        setFinancialPeriod,
        activeView,
        setActiveView,
        theme,
        toggleTheme,
        tasks,
        updateTaskStatus,
        createTask,
        accounts,
        journalEntries,
        submitJournalEntry,
        approveJournalEntry,
        invoices,
        createInvoice,
        gstRecords,
        tdsRecords,
        bankAccounts,
        bankTransactions,
        reconcileTransaction,
        documents,
        uploadDocument,
        statutoryNotices,
        updateNoticeStatus,
        riskExceptions,
        resolveRiskException,
        approvals,
        approveItem,
        rejectItem,
        auditLogs,
        addAuditLog,
        bhsReport,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isAiDrawerOpen,
        setIsAiDrawerOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
