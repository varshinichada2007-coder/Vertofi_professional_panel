/**
 * VERTOFI MongoDB Client Storage & Sync Service
 * Bridges UI Context with MongoDB Database collections
 */

import {
  User,
  ClientEntity,
  ProfessionalTask,
  Account,
  JournalEntry,
  Invoice,
  StatutoryNotice,
  RiskException,
  ApprovalItem,
  AuditLogItem,
  ClientQuery,
  ConnectedBusiness
} from '../types';

const STORAGE_KEYS = {
  USERS: 'vertofi_db_users',
  CLIENTS: 'vertofi_db_clients',
  TASKS: 'vertofi_db_tasks',
  ACCOUNTS: 'vertofi_db_accounts',
  JOURNAL_ENTRIES: 'vertofi_db_journal_entries',
  INVOICES: 'vertofi_db_invoices',
  STATUTORY_NOTICES: 'vertofi_db_statutory_notices',
  RISK_EXCEPTIONS: 'vertofi_db_risk_exceptions',
  APPROVALS: 'vertofi_db_approvals',
  CLIENT_QUERIES: 'vertofi_db_client_queries',
  CONNECTED_BUSINESSES: 'vertofi_db_connected_businesses',
  AUDIT_LOGS: 'vertofi_db_audit_logs'
};

export class MongoSyncService {
  private static memoryStore = new Map<string, unknown>();

  private static getStored<T>(key: string, defaultData: T[]): T[] {
    const val = this.memoryStore.get(key);
    return (val as T[]) || defaultData;
  }

  private static setStored<T>(key: string, data: T[]): void {
    this.memoryStore.set(key, data);
  }

  // Users Collection
  static getUsers(fallback: User[]): User[] {
    return this.getStored(STORAGE_KEYS.USERS, fallback);
  }
  static saveUsers(users: User[]): void {
    this.setStored(STORAGE_KEYS.USERS, users);
  }

  // Clients Collection
  static getClients(fallback: ClientEntity[]): ClientEntity[] {
    return this.getStored(STORAGE_KEYS.CLIENTS, fallback);
  }
  static saveClients(clients: ClientEntity[]): void {
    this.setStored(STORAGE_KEYS.CLIENTS, clients);
  }

  // Tasks Collection
  static getTasks(fallback: ProfessionalTask[]): ProfessionalTask[] {
    return this.getStored(STORAGE_KEYS.TASKS, fallback);
  }
  static saveTasks(tasks: ProfessionalTask[]): void {
    this.setStored(STORAGE_KEYS.TASKS, tasks);
  }

  // Client Queries Collection
  static getClientQueries(fallback: ClientQuery[]): ClientQuery[] {
    return this.getStored(STORAGE_KEYS.CLIENT_QUERIES, fallback);
  }
  static saveClientQueries(queries: ClientQuery[]): void {
    this.setStored(STORAGE_KEYS.CLIENT_QUERIES, queries);
  }

  // Connected Businesses Collection
  static getConnectedBusinesses(fallback: ConnectedBusiness[]): ConnectedBusiness[] {
    return this.getStored(STORAGE_KEYS.CONNECTED_BUSINESSES, fallback);
  }
  static saveConnectedBusinesses(businesses: ConnectedBusiness[]): void {
    this.setStored(STORAGE_KEYS.CONNECTED_BUSINESSES, businesses);
  }

  // Journal Entries Collection
  static getJournalEntries(fallback: JournalEntry[]): JournalEntry[] {
    return this.getStored(STORAGE_KEYS.JOURNAL_ENTRIES, fallback);
  }
  static saveJournalEntries(entries: JournalEntry[]): void {
    this.setStored(STORAGE_KEYS.JOURNAL_ENTRIES, entries);
  }

  // Invoices Collection
  static getInvoices(fallback: Invoice[]): Invoice[] {
    return this.getStored(STORAGE_KEYS.INVOICES, fallback);
  }
  static saveInvoices(invoices: Invoice[]): void {
    this.setStored(STORAGE_KEYS.INVOICES, invoices);
  }
}
