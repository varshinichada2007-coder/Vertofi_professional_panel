export type UserRole =
  | 'CA'
  | 'CMA'
  | 'CS'
  | 'ACCOUNTANT'
  | 'CFO'
  | 'AUDITOR'
  | 'INTERNAL_ADMIN'
  | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  avatar: string;
  firmName: string;
  membershipNumber?: string;
  copNumber?: string; // Certificate of Practice
  specialization: string[];
  mfaEnabled: boolean;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  gstin?: string;
  pan?: string;
  type: 'PRACTICE_FIRM' | 'CORPORATE_FINANCE' | 'ADVISORY_GROUP';
  plan: 'Starter' | 'Professional' | 'Business' | 'Enterprise';
  logo?: string;
  memberCount: number;
  clientCount: number;
}

export interface ClientEntity {
  id: string;
  name: string;
  legalName: string;
  industry: string;
  pan: string;
  gstin: string;
  cin?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'HIGH_RISK' | 'ONBOARDING';
  assignedProfessionalId: string;
  assignedProfessionalName: string;
  complianceHealth: number; // 0-100
  financialHealth: number; // 0-100
  bhsScore: number; // 0-100
  bhsTrend: 'UP' | 'DOWN' | 'STABLE';
  openTasksCount: number;
  exceptionsCount: number;
  pendingApprovalsCount: number;
  lastActivity: string;
  annualTurnover: number;
  financialYear: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  bankAccountsCount: number;
  unreconciledCount: number;
  tags: string[];
}

export type TaskStatus =
  | 'DUE_TODAY'
  | 'UPCOMING'
  | 'OVERDUE'
  | 'PENDING_REVIEW'
  | 'PENDING_CLIENT_DOCS'
  | 'PENDING_APPROVAL'
  | 'EXCEPTIONS'
  | 'COMPLETED';

export type TaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface ProfessionalTask {
  id: string;
  title: string;
  description: string;
  clientId: string;
  clientName: string;
  type: 'GST_FILING' | 'TDS_RETURN' | 'RECONCILIATION' | 'AUDIT_REVIEW' | 'JOURNAL_APPROVAL' | 'NOTICE_RESPONSE' | 'PERIOD_CLOSE' | 'MIS_REPORT';
  priority: TaskPriority;
  dueDate: string;
  slaHoursRemaining: number;
  assignedTo: string;
  assignedToName: string;
  assignedRole: UserRole;
  status: TaskStatus;
  createdAt: string;
  completedAt?: string;
  commentsCount: number;
  attachmentsCount: number;
  aiSuggestedAction?: string;
}

// Accounting
export type AccountCategory = 'ASSETS' | 'LIABILITIES' | 'EQUITY' | 'INCOME' | 'EXPENSES';

export interface Account {
  id: string;
  code: string;
  name: string;
  category: AccountCategory;
  subCategory: string;
  balance: number;
  type: 'DEBIT' | 'CREDIT';
  currency: string;
  isReconciled: boolean;
  parentAccountId?: string;
}

export type JournalStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'POSTED';

export interface JournalLine {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  description: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  voucherNumber: string;
  clientId: string;
  date: string;
  narration: string;
  referenceDoc?: string;
  lines: JournalLine[];
  totalDebit: number;
  totalCredit: number;
  status: JournalStatus;
  makerName: string;
  makerRole: UserRole;
  checkerName?: string;
  checkerRole?: UserRole;
  submittedAt: string;
  approvedAt?: string;
  postedAt?: string;
  tags: string[];
  isAdjustment?: boolean;
}

// Invoices & Receivables / Payables
export interface InvoiceItem {
  id: string;
  description: string;
  hsnSac: string;
  quantity: number;
  unit: string;
  rate: number;
  taxableAmount: number;
  gstRate: number; // 5, 12, 18, 28
  cgst: number;
  sgst: number;
  igst: number;
  discount: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  partyType: 'CUSTOMER' | 'VENDOR';
  partyName: string;
  partyGstin: string;
  partyPan: string;
  date: string;
  dueDate: string;
  type: 'TAX_INVOICE' | 'CREDIT_NOTE' | 'DEBIT_NOTE' | 'BILL_OF_SUPPLY';
  status: 'DRAFT' | 'ISSUED' | 'PAID' | 'PARTIALLY_PAID' | 'OVERDUE' | 'CANCELLED';
  items: InvoiceItem[];
  subtotal: number;
  totalTax: number;
  cgstTotal: number;
  sgstTotal: number;
  igstTotal: number;
  grandTotal: number;
  amountPaid: number;
  amountDue: number;
  irn?: string;
  qrCodeGenerated?: boolean;
  eInvoiceStatus?: 'GENERATED' | 'FAILED' | 'NOT_APPLICABLE';
  reconciliationStatus: 'RECONCILED' | 'UNMATCHED' | 'MISMATCH';
}

// Tax & Compliance
export interface GstFilingRecord {
  id: string;
  period: string; // e.g. "Q3 FY 24-25" / "Dec 2024"
  returnType: 'GSTR-1' | 'GSTR-3B' | 'GSTR-9' | 'GSTR-9C' | 'GSTR-2B_RECON';
  dueDate: string;
  liabilityCalculated: number;
  itcAvailable: number;
  itcMismatchAmount: number;
  cashPaid: number;
  status: 'DRAFT' | 'READY_FOR_REVIEW' | 'APPROVED' | 'FILED' | 'ACKNOWLEDGED' | 'OVERDUE';
  arn?: string;
  filedDate?: string;
  filedBy?: string;
  mismatchCount: number;
}

export interface TdsRecord {
  id: string;
  section: '194C' | '194J' | '194I' | '194Q' | '194H' | '206C';
  description: string;
  vendorName: string;
  vendorPan: string;
  grossAmount: number;
  ratePercent: number;
  tdsAmount: number;
  deductionDate: string;
  depositDueDate: string;
  challanNumber?: string;
  bsrCode?: string;
  status: 'DEDUCTED' | 'CHALLAN_GENERATED' | 'DEPOSITED' | 'FORM_26Q_READY' | 'OVERDUE';
}

// Bank & Reconciliation
export interface BankAccount {
  id: string;
  bankName: string;
  accountNumberMasked: string;
  ifsc: string;
  branch: string;
  ledgerBalance: number;
  bankFeedBalance: number;
  unreconciledDifference: number;
  reconciliationRate: number; // 0-100 %
  lastSynced: string;
}

export interface BankTransaction {
  id: string;
  bankAccountId: string;
  date: string;
  description: string;
  referenceNumber: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  matchedRecordId?: string;
  matchedRecordType?: 'INVOICE' | 'PAYMENT' | 'JOURNAL';
  matchConfidence: number; // 0-100%
  status: 'MATCHED' | 'UNMATCHED' | 'EXCEPTION' | 'SPLIT' | 'MANUALLY_RECONCILED';
  aiExplanation?: string;
}

// Documents
export interface DocumentItem {
  id: string;
  title: string;
  clientId: string;
  category: 'GST' | 'INCOME_TAX' | 'MCA' | 'INVOICES' | 'BANK' | 'PAYROLL' | 'LEGAL' | 'FINANCIAL_STATEMENTS' | 'OTHER';
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  version: number;
  ocrExtracted: boolean;
  ocrConfidence?: number;
  status: 'VERIFIED' | 'PENDING_REVIEW' | 'REJECTED' | 'EXPIRED';
  tags: string[];
}

// Statutory Notices
export interface StatutoryNotice {
  id: string;
  noticeId: string;
  referenceNumber: string;
  clientId: string;
  clientName: string;
  authority: 'GST' | 'INCOME_TAX' | 'MCA' | 'CUSTOMS' | 'OTHER';
  section: string;
  title: string;
  description: string;
  issueDate: string;
  responseDeadline: string;
  daysRemaining: number;
  assignedTo: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'AWAITING_INFO' | 'READY_FOR_SUBMISSION' | 'SUBMITTED' | 'RESOLVED' | 'CLOSED';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  claimedAmount?: number;
  responseDraft?: string;
  acknowledgmentReceipt?: string;
}

// Risk & Exceptions
export interface RiskException {
  id: string;
  code: string;
  clientId: string;
  clientName: string;
  type:
    | 'DUPLICATE_TRANSACTION'
    | 'DUPLICATE_PAYMENT'
    | 'GST_ITC_MISMATCH'
    | 'TDS_RATE_MISMATCH'
    | 'UNRECONCILED_BANK_DEBIT'
    | 'MISSING_INVOICE_DOC'
    | 'INCORRECT_TAX_CALC'
    | 'SUSPICIOUS_VENDOR_ACTIVITY';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  whatHappened: string;
  whyDetected: string;
  sourceEvidence: string;
  confidenceScore: number;
  recommendedAction: string;
  amountInvolved?: number;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'OVERRIDDEN';
  assignedTo: string;
  createdAt: string;
}

// Approvals
export interface ApprovalItem {
  id: string;
  type: 'JOURNAL_VOUCHER' | 'VENDOR_PAYMENT' | 'CREDIT_NOTE' | 'TAX_ADJUSTMENT' | 'REFUND' | 'HIGH_VALUE_TXN' | 'RECON_OVERRIDE';
  clientId: string;
  clientName: string;
  title: string;
  amount: number;
  requestedBy: string;
  requestedByRole: UserRole;
  reviewer: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'POSTED';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  date: string;
  details: string;
  diffSummary?: { field: string; before: string; after: string }[];
}

// Audit Trail
export interface AuditLogItem {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  clientId: string;
  clientName: string;
  module: 'ACCOUNTING' | 'TAX' | 'AR' | 'AP' | 'BANK_RECON' | 'DOCUMENTS' | 'NOTICES' | 'APPROVALS' | 'SETTINGS';
  action: 'CREATED' | 'UPDATED' | 'DELETED' | 'APPROVED' | 'REJECTED' | 'POSTED' | 'FILED' | 'RECONCILED' | 'OVERRIDDEN';
  resource: string;
  resourceId: string;
  previousValue?: string;
  newValue?: string;
  ipAddress: string;
  recordHash: string;
}

// Business Health Score
export interface BhsDimension {
  name: string;
  score: number; // 0-100
  weight: number;
  status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'ATTENTION_REQUIRED';
  explanation: string;
  keyMetric: string;
}

export interface BhsReport {
  clientId: string;
  overallScore: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  asOfDate: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  dimensions: BhsDimension[];
  criticalRisks: string[];
  growthOpportunities: string[];
}

// Notifications
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: 'COMPLIANCE_DEADLINE' | 'APPROVAL_REQUEST' | 'CLIENT_DOC_REQUEST' | 'EXCEPTION' | 'NOTICE_DEADLINE' | 'PAYMENT' | 'RECONCILIATION' | 'FILING_UPDATE' | 'SYSTEM_SECURITY';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  timestamp: string;
  isRead: boolean;
  actionLink?: string;
  clientId?: string;
}
