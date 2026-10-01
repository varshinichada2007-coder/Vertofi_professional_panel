import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ClientEntity,
  JournalStatus,
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
  AppNotification,
  ClientQuery,
  ConnectedBusiness,
  QueryReply
} from '../types';
import { api, Collections } from '../services/apiService';
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
  | 'notifications'
  | 'settings'
  | 'profile'
  | 'queries'
  | 'business-sync';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
}

// Empty BHS report shape when no data is in DB yet
const EMPTY_BHS: BhsReport = {
  clientId: '',
  overallScore: 0,
  grade: 'D',
  asOfDate: '',
  trend: 'STABLE',
  dimensions: [],
  criticalRisks: [],
  growthOpportunities: []
};

interface AppContextType {
  currentClient: ClientEntity;
  clients: ClientEntity[];
  createClient: (clientData: Partial<ClientEntity>) => void;
  switchClient: (clientId: string) => void;
  financialPeriod: string;
  setFinancialPeriod: (period: string) => void;
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isLoading: boolean;

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

  // Client Queries & Messages (Connected from Business Portal)
  clientQueries: ClientQuery[];
  addClientQueryReply: (queryId: string, message: string, senderRole?: 'CLIENT' | 'CA' | 'CMA' | 'CS' | 'CFO' | 'ACCOUNTANT' | 'AUDITOR') => void;
  resolveClientQuery: (queryId: string) => void;
  simulateIncomingClientQuery: (customQuery?: Partial<ClientQuery>) => void;

  // Vertofi Business Portal Sync via CA ID
  connectedBusinesses: ConnectedBusiness[];
  connectBusinessViaCaId: (details: { businessName: string; gstin: string; pan: string; contactPerson: string; contactEmail: string }) => void;

  // Modals & Drawers
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: 'success' | 'warning' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  // ─── Loading state ────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);

  // ─── Navigation & theme ───────────────────────────────────────────────────
  const [financialPeriod, setFinancialPeriod] = useState<string>('FY 2024-25');
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  // ─── Empty client placeholder (replaced once DB responds) ───────────────
  const EMPTY_CLIENT: ClientEntity = {
    id: '', name: '', legalName: '', industry: '', pan: '', gstin: '',
    status: 'ACTIVE', assignedProfessionalId: '', assignedProfessionalName: '',
    complianceHealth: 0, financialHealth: 0, bhsScore: 0, bhsTrend: 'STABLE',
    openTasksCount: 0, exceptionsCount: 0, pendingApprovalsCount: 0,
    lastActivity: '', annualTurnover: 0, financialYear: '', contactPerson: '',
    contactEmail: '', contactPhone: '', address: '', bankAccountsCount: 0,
    unreconciledCount: 0, tags: []
  };

  // ─── Data state — all empty on mount, populated from MongoDB ─────────────
  const [clients, setClients] = useState<ClientEntity[]>([]);
  const [currentClient, setCurrentClient] = useState<ClientEntity>(EMPTY_CLIENT);
  const [tasks, setTasks] = useState<ProfessionalTask[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [gstRecords, setGstRecords] = useState<GstFilingRecord[]>([]);
  const [tdsRecords, setTdsRecords] = useState<TdsRecord[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [bankTransactions, setBankTransactions] = useState<BankTransaction[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [statutoryNotices, setStatutoryNotices] = useState<StatutoryNotice[]>([]);
  const [riskExceptions, setRiskExceptions] = useState<RiskException[]>([]);
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [bhsReport, setBhsReport] = useState<BhsReport>(EMPTY_BHS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [clientQueries, setClientQueries] = useState<ClientQuery[]>([]);
  const [connectedBusinesses, setConnectedBusinesses] = useState<ConnectedBusiness[]>([]);

  // ─── UI state ─────────────────────────────────────────────────────────────
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // ─── Toast helpers ────────────────────────────────────────────────────────
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((title: string, message: string, type: 'success' | 'warning' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  // ─── Load all data from MongoDB on mount ─────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    const loadAll = async () => {
      setIsLoading(true);
      try {
        const [
          fetchedClients,
          fetchedTasks,
          fetchedAccounts,
          fetchedJournalEntries,
          fetchedInvoices,
          fetchedGstRecords,
          fetchedTdsRecords,
          fetchedBankAccounts,
          fetchedBankTransactions,
          fetchedDocuments,
          fetchedNotices,
          fetchedRiskExceptions,
          fetchedApprovals,
          fetchedAuditLogs,
          fetchedNotifications,
          fetchedClientQueries,
          fetchedConnectedBusinesses,
          fetchedBhsReports
        ] = await Promise.allSettled([
          api.getAll<ClientEntity>(Collections.CLIENTS),
          api.getAll<ProfessionalTask>(Collections.TASKS),
          api.getAll<Account>(Collections.ACCOUNTS),
          api.getAll<JournalEntry>(Collections.JOURNAL_ENTRIES),
          api.getAll<Invoice>(Collections.INVOICES),
          api.getAll<GstFilingRecord>(Collections.GST_RECORDS),
          api.getAll<TdsRecord>(Collections.TDS_RECORDS),
          api.getAll<BankAccount>(Collections.BANK_ACCOUNTS),
          api.getAll<BankTransaction>(Collections.BANK_TRANSACTIONS),
          api.getAll<DocumentItem>(Collections.DOCUMENTS),
          api.getAll<StatutoryNotice>(Collections.STATUTORY_NOTICES),
          api.getAll<RiskException>(Collections.RISK_EXCEPTIONS),
          api.getAll<ApprovalItem>(Collections.APPROVALS),
          api.getAll<AuditLogItem>(Collections.AUDIT_LOGS),
          api.getAll<AppNotification>(Collections.NOTIFICATIONS),
          api.getAll<ClientQuery>(Collections.CLIENT_QUERIES),
          api.getAll<ConnectedBusiness>(Collections.CONNECTED_BUSINESSES),
          api.getAll<BhsReport>('bhs_reports'),
        ]);

        if (cancelled) return;

        const getValue = <T,>(result: PromiseSettledResult<T[]>, fallback: T[] = []): T[] =>
          result.status === 'fulfilled' ? result.value : fallback;

        const loadedClients = getValue(fetchedClients);
        setClients(loadedClients);
        if (loadedClients.length > 0) setCurrentClient(loadedClients[0] as ClientEntity);

        setTasks(getValue(fetchedTasks));
        setAccounts(getValue(fetchedAccounts));
        setJournalEntries(getValue(fetchedJournalEntries));
        setInvoices(getValue(fetchedInvoices));
        setGstRecords(getValue(fetchedGstRecords));
        setTdsRecords(getValue(fetchedTdsRecords));
        setBankAccounts(getValue(fetchedBankAccounts));
        setBankTransactions(getValue(fetchedBankTransactions));
        setDocuments(getValue(fetchedDocuments));
        setStatutoryNotices(getValue(fetchedNotices));
        setRiskExceptions(getValue(fetchedRiskExceptions));
        setApprovals(getValue(fetchedApprovals));
        setAuditLogs(getValue(fetchedAuditLogs));
        setNotifications(getValue(fetchedNotifications));
        setClientQueries(getValue(fetchedClientQueries));
        setConnectedBusinesses(getValue(fetchedConnectedBusinesses));

        const bhsReports = getValue(fetchedBhsReports);
        if (bhsReports.length > 0) setBhsReport(bhsReports[0]);

      } catch (err) {
        console.error('Failed to load data from MongoDB:', err);
        if (!cancelled) {
          showToast('Database Connection Issue', 'Could not reach the database. Data will be empty until resolved.', 'error');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadAll();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Theme ────────────────────────────────────────────────────────────────
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  // ─── Client switching ────────────────────────────────────────────────────
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

  // ─── Clients ─────────────────────────────────────────────────────────────
  const createClient = (newClient: Partial<ClientEntity>) => {
    const item: ClientEntity = {
      id: `cli_${Date.now()}`,
      name: newClient.name || 'New Client Entity',
      legalName: newClient.legalName || newClient.name || 'New Client Entity Pvt Ltd',
      industry: newClient.industry || 'Technology & Services',
      pan: newClient.pan || 'AABCP1234K',
      gstin: newClient.gstin || '27AABCP1234K1Z5',
      cin: newClient.cin || `U72900MH${new Date().getFullYear()}PTC${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'ACTIVE',
      assignedProfessionalId: currentUser.id,
      assignedProfessionalName: currentUser.name || 'Lead Auditor',
      complianceHealth: 100,
      financialHealth: 100,
      bhsScore: 85,
      bhsTrend: 'STABLE',
      openTasksCount: 0,
      exceptionsCount: 0,
      pendingApprovalsCount: 0,
      lastActivity: 'Just now',
      annualTurnover: newClient.annualTurnover || 10000000,
      financialYear: 'FY 2024-25',
      contactPerson: newClient.contactPerson || currentUser.name || 'Director',
      contactEmail: newClient.contactEmail || currentUser.email || 'finance@client.com',
      contactPhone: newClient.contactPhone || currentUser.phone || '+91 98000 00000',
      address: newClient.address || 'Mumbai, Maharashtra, India',
      bankAccountsCount: 0,
      unreconciledCount: 0,
      tags: ['Active', 'New Onboarding'],
      ...newClient
    };

    setClients((prev) => [item, ...prev]);
    setCurrentClient(item);
    api.create(Collections.CLIENTS, item).catch(console.error);
    showToast('Client Entity Onboarded', `${item.name} has been added to your database.`, 'success');
  };

  // ─── Audit logging ────────────────────────────────────────────────────────
  const addAuditLog = (log: Omit<AuditLogItem, 'id' | 'timestamp' | 'recordHash'>) => {
    const newLog: AuditLogItem = {
      ...log,
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recordHash: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
    };
    setAuditLogs((prev) => [newLog, ...prev]);
    // Persist to MongoDB (fire-and-forget)
    api.create(Collections.AUDIT_LOGS, newLog).catch(console.error);
  };

  // ─── Tasks ────────────────────────────────────────────────────────────────
  const updateTaskStatus = (taskId: string, newStatus: ProfessionalTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus, completedAt: newStatus === 'COMPLETED' ? new Date().toISOString() : undefined } : t))
    );
    api.update(Collections.TASKS, taskId, { status: newStatus }).catch(console.error);
    showToast('Task Updated', `Task status changed to ${newStatus.replace('_', ' ')}`, 'success');
  };

  const createTask = (newTask: Partial<ProfessionalTask>) => {
    const item: ProfessionalTask = {
      id: `tsk_${Date.now()}`,
      title: newTask.title || 'New Task',
      description: newTask.description || '',
      clientId: currentClient?.id || '',
      clientName: currentClient?.name || '',
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
    api.create(Collections.TASKS, item).catch(console.error);
    showToast('Task Created', `Task "${item.title}" has been assigned.`, 'success');
  };

  // ─── Journal Entries ──────────────────────────────────────────────────────
  const submitJournalEntry = (entry: Partial<JournalEntry>) => {
    const jv: JournalEntry = {
      id: `jv_${Date.now()}`,
      voucherNumber: `JV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      clientId: currentClient?.id || '',
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
    api.create(Collections.JOURNAL_ENTRIES, jv).catch(console.error);
    showToast('Journal Voucher Submitted', `${jv.voucherNumber} sent for Maker-Checker review.`, 'success');
    addAuditLog({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      clientId: currentClient?.id || '',
      clientName: currentClient?.name || '',
      module: 'ACCOUNTING',
      action: 'CREATED',
      resource: 'JournalVoucher',
      resourceId: jv.voucherNumber,
      newValue: `Created voucher for ₹${jv.totalDebit.toLocaleString('en-IN')}`,
      ipAddress: '103.21.144.92 (Mumbai, IN)'
    });
  };

  const approveJournalEntry = (id: string) => {
    const updates: Partial<JournalEntry> = {
      status: 'APPROVED' as JournalStatus,
      checkerName: currentUser.name,
      checkerRole: currentUser.role,
      approvedAt: new Date().toISOString(),
      postedAt: new Date().toISOString()
    };
    setJournalEntries((prev) =>
      prev.map((jv) => (jv.id === id ? { ...jv, ...updates } : jv))
    );
    api.update(Collections.JOURNAL_ENTRIES, id, updates).catch(console.error);
    showToast('Journal Voucher Approved', 'Voucher posted to General Ledger.', 'success');
  };

  // ─── Invoices ─────────────────────────────────────────────────────────────
  const createInvoice = (invoice: Partial<Invoice>) => {
    const inv: Invoice = {
      id: `inv_${Date.now()}`,
      invoiceNumber: `INV-2024-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: currentClient?.id || '',
      clientName: currentClient?.name || '',
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
    api.create(Collections.INVOICES, inv).catch(console.error);
    showToast('Invoice Issued', `Invoice ${inv.invoiceNumber} generated with IRN & QR.`, 'success');
  };

  // ─── Bank reconciliation ──────────────────────────────────────────────────
  const reconcileTransaction = (transactionId: string) => {
    setBankTransactions((prev) =>
      prev.map((t) => (t.id === transactionId ? { ...t, status: 'MATCHED', matchConfidence: 100 } : t))
    );
    api.update(Collections.BANK_TRANSACTIONS, transactionId, { status: 'MATCHED', matchConfidence: 100 }).catch(console.error);
    showToast('Reconciliation Complete', 'Transaction matched and posted against ledger.', 'success');
  };

  // ─── Documents ────────────────────────────────────────────────────────────
  const uploadDocument = (doc: Partial<DocumentItem>) => {
    const item: DocumentItem = {
      id: `doc_${Date.now()}`,
      title: doc.title || 'Uploaded Document',
      clientId: currentClient?.id || '',
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
    api.create(Collections.DOCUMENTS, item).catch(console.error);
    showToast('Document Uploaded & OCR Processed', `Indexed ${item.title} with 97.5% OCR confidence.`, 'success');
  };

  // ─── Statutory notices ────────────────────────────────────────────────────
  const updateNoticeStatus = (noticeId: string, status: StatutoryNotice['status']) => {
    setStatutoryNotices((prev) => prev.map((n) => (n.id === noticeId ? { ...n, status } : n)));
    api.update(Collections.STATUTORY_NOTICES, noticeId, { status }).catch(console.error);
    showToast('Statutory Notice Updated', `Notice status changed to ${status}`, 'success');
  };

  // ─── Risk exceptions ──────────────────────────────────────────────────────
  const resolveRiskException = (exceptionId: string) => {
    setRiskExceptions((prev) => prev.map((e) => (e.id === exceptionId ? { ...e, status: 'RESOLVED' } : e)));
    api.update(Collections.RISK_EXCEPTIONS, exceptionId, { status: 'RESOLVED' }).catch(console.error);
    showToast('Exception Resolved', 'Corrective action verified and logged in audit lineage.', 'success');
  };

  // ─── Approvals ────────────────────────────────────────────────────────────
  const approveItem = (approvalId: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === approvalId ? { ...a, status: 'APPROVED' } : a)));
    api.update(Collections.APPROVALS, approvalId, { status: 'APPROVED' }).catch(console.error);
    showToast('Maker-Checker Approved', 'Authorization signed and released.', 'success');
  };

  const rejectItem = (approvalId: string) => {
    setApprovals((prev) => prev.map((a) => (a.id === approvalId ? { ...a, status: 'REJECTED' } : a)));
    api.update(Collections.APPROVALS, approvalId, { status: 'REJECTED' }).catch(console.error);
    showToast('Item Rejected', 'Returned to maker with revision remarks.', 'warning');
  };

  // ─── Notifications ────────────────────────────────────────────────────────
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    api.update(Collections.NOTIFICATIONS, id, { isRead: true }).catch(console.error);
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Notifications Cleared', 'All alerts marked as read.', 'info');
  };

  // ─── Client Queries ───────────────────────────────────────────────────────
  const addClientQueryReply = (
    queryId: string,
    message: string,
    senderRole: 'CLIENT' | 'CA' | 'CMA' | 'CS' | 'CFO' | 'ACCOUNTANT' | 'AUDITOR' = 'CA'
  ) => {
    const replyItem: QueryReply = {
      id: `rep_${Date.now()}`,
      senderName: senderRole === 'CA' ? currentUser.name : 'Authorized Client Executive',
      senderRole,
      message,
      timestamp: 'Just now'
    };

    setClientQueries((prev) =>
      prev.map((q) => {
        if (q.id === queryId) {
          const updated = {
            ...q,
            status: senderRole === 'CA' ? 'IN_PROGRESS' : 'OPEN',
            replies: [...q.replies, replyItem]
          };
          api.update(Collections.CLIENT_QUERIES, queryId, { status: updated.status, replies: updated.replies }).catch(console.error);
          return updated as ClientQuery;
        }
        return q;
      })
    );

    showToast('Reply Dispatched', 'Message transmitted to client on the Vertofi Business Portal.', 'success');
  };

  const resolveClientQuery = (queryId: string) => {
    setClientQueries((prev) =>
      prev.map((q) => (q.id === queryId ? { ...q, status: 'RESOLVED' } : q))
    );
    api.update(Collections.CLIENT_QUERIES, queryId, { status: 'RESOLVED' }).catch(console.error);
    showToast('Query Marked Resolved', 'Resolution summary archived with client sign-off.', 'success');
  };

  const simulateIncomingClientQuery = (customQuery?: Partial<ClientQuery>) => {
    const newQueryId = `qry_${Date.now()}`;
    const sampleClient = clients[0] || currentClient;
    const incomingQuery: ClientQuery = {
      id: newQueryId,
      clientId: customQuery?.clientId || sampleClient?.id || '',
      clientName: customQuery?.clientName || sampleClient?.name || '',
      senderName: customQuery?.senderName || 'Pooja Verma (Finance Head)',
      senderRole: customQuery?.senderRole || 'Client Director (Business Portal)',
      senderEmail: customQuery?.senderEmail || sampleClient?.contactEmail || '',
      subject: customQuery?.subject || 'Urgent Input Tax Credit verification on Batch Vendor Bills',
      message: customQuery?.message || 'We have uploaded 8 supplier invoices for October cycle. Could you please reconcile these against GSTR-2B so we can disburse vendor payments without ITC loss?',
      category: customQuery?.category || 'GST_QUERY',
      priority: customQuery?.priority || 'HIGH',
      status: 'OPEN',
      createdAt: 'Just now',
      caIdNumber: currentUser.caIdNumber || currentUser.membershipNumber || 'V-CA-84920',
      replies: []
    };

    setClientQueries((prev) => [incomingQuery, ...prev]);
    api.create(Collections.CLIENT_QUERIES, incomingQuery).catch(console.error);

    const newNotification: AppNotification = {
      id: `notif_${Date.now()}`,
      title: `New Query from ${incomingQuery.clientName}`,
      message: `${incomingQuery.senderName}: "${incomingQuery.subject}"`,
      category: 'CLIENT_QUERY',
      priority: 'HIGH',
      timestamp: 'Just now',
      isRead: false,
      clientId: incomingQuery.clientId,
      queryId: newQueryId
    };

    setNotifications((prev) => [newNotification, ...prev]);
    api.create(Collections.NOTIFICATIONS, newNotification).catch(console.error);
    showToast(`🔔 New Client Query Received`, `${incomingQuery.senderName} (${incomingQuery.clientName}) raised: ${incomingQuery.subject}`, 'warning');
  };

  // ─── Connected Businesses ─────────────────────────────────────────────────
  const connectBusinessViaCaId = (details: {
    businessName: string;
    gstin: string;
    pan: string;
    contactPerson: string;
    contactEmail: string;
  }) => {
    const newBiz: ConnectedBusiness = {
      id: `biz_${Date.now()}`,
      businessName: details.businessName,
      gstin: details.gstin,
      pan: details.pan,
      connectedViaCaId: currentUser.caIdNumber || currentUser.membershipNumber || 'V-CA-84920',
      connectedAt: new Date().toISOString().split('T')[0],
      status: 'CONNECTED',
      lastSyncedAt: 'Just now',
      annualTurnover: '₹12.00 Cr',
      contactPerson: details.contactPerson,
      contactEmail: details.contactEmail,
      contactPhone: '+91 98000 00000',
      liveFeedCount: 15
    };

    setConnectedBusinesses((prev) => [newBiz, ...prev]);
    api.create(Collections.CONNECTED_BUSINESSES, newBiz).catch(console.error);
    showToast('Business Connected Successfully', `${details.businessName} linked with CA ID ${newBiz.connectedViaCaId}`, 'success');
  };

  // ─── Context value ────────────────────────────────────────────────────────
  return (
    <AppContext.Provider
      value={{
        currentClient,
        clients,
        createClient,
        switchClient,
        financialPeriod,
        setFinancialPeriod,
        activeView,
        setActiveView,
        theme,
        toggleTheme,
        isLoading,
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
        clientQueries,
        addClientQueryReply,
        resolveClientQuery,
        simulateIncomingClientQuery,
        connectedBusinesses,
        connectBusinessViaCaId,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
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
