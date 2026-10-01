/**
 * VERTOFI API Service
 * Centralized HTTP client for all MongoDB operations via Netlify Functions.
 * Used by AppContext to replace static mockData imports.
 */

// In dev (Vite), the Netlify function is proxied via netlify dev.
// In production, the path resolves correctly via Netlify hosting.
const BASE = '/.netlify/functions/api';

async function request<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Generic collection helpers ────────────────────────────────────────────────

export const api = {
  /** Fetch all documents from a collection, with optional clientId filter */
  getAll: <T>(collection: string, clientId?: string): Promise<T[]> => {
    const qs = clientId ? `?clientId=${encodeURIComponent(clientId)}` : '';
    return request<T[]>('GET', `/${collection}${qs}`);
  },

  /** Fetch a single document by ID */
  getOne: <T>(collection: string, id: string): Promise<T> =>
    request<T>('GET', `/${collection}/${id}`),

  /** Insert a new document */
  create: <T>(collection: string, data: Partial<T>): Promise<{ insertedId: string }> =>
    request('POST', `/${collection}`, data),

  /** Update a document by ID */
  update: (collection: string, id: string, data: unknown): Promise<{ matchedCount: number }> =>
    request('PUT', `/${collection}/${id}`, data),

  /** Delete a document by ID */
  remove: (collection: string, id: string): Promise<{ deletedCount: number }> =>
    request('DELETE', `/${collection}/${id}`)
};

// ─── Named collection helpers ───────────────────────────────────────────────

export const Collections = {
  USERS:                'users',
  CLIENTS:              'clients',
  TASKS:                'tasks',
  ACCOUNTS:             'accounts',
  JOURNAL_ENTRIES:      'journal_entries',
  INVOICES:             'invoices',
  GST_RECORDS:          'gst_records',
  TDS_RECORDS:          'tds_records',
  BANK_ACCOUNTS:        'bank_accounts',
  BANK_TRANSACTIONS:    'bank_transactions',
  DOCUMENTS:            'documents',
  STATUTORY_NOTICES:    'statutory_notices',
  RISK_EXCEPTIONS:      'risk_exceptions',
  APPROVALS:            'approvals',
  AUDIT_LOGS:           'audit_logs',
  NOTIFICATIONS:        'notifications',
  CLIENT_QUERIES:       'client_queries',
  CONNECTED_BUSINESSES: 'connected_businesses',
} as const;

export type CollectionName = typeof Collections[keyof typeof Collections];
