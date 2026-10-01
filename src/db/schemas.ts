/**
 * VERTOFI Financial Professional Workspace - MongoDB Database Schemas
 * Comprehensive collection validation & document schemas
 */

export const MongoCollections = {
  USERS: 'users',
  CLIENTS: 'clients',
  TASKS: 'tasks',
  ACCOUNTS: 'accounts',
  JOURNAL_ENTRIES: 'journal_entries',
  INVOICES: 'invoices',
  STATUTORY_NOTICES: 'statutory_notices',
  RISK_EXCEPTIONS: 'risk_exceptions',
  APPROVALS: 'approvals',
  CLIENT_QUERIES: 'client_queries',
  CONNECTED_BUSINESSES: 'connected_businesses',
  AUDIT_LOGS: 'audit_logs'
} as const;

export const UserSchemaValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['id', 'name', 'email', 'role', 'roleTitle', 'firmName'],
    properties: {
      id: { bsonType: 'string', description: 'Unique user identifier' },
      name: { bsonType: 'string', description: 'Full professional name' },
      email: { bsonType: 'string', description: 'Work email address' },
      phone: { bsonType: 'string', description: 'Contact phone number' },
      role: {
        enum: ['CA', 'CMA', 'CS', 'ACCOUNTANT', 'CFO', 'AUDITOR', 'INTERNAL_ADMIN', 'SUPER_ADMIN'],
        description: 'Professional role category'
      },
      roleTitle: { bsonType: 'string' },
      avatar: { bsonType: 'string' },
      firmName: { bsonType: 'string' },
      membershipNumber: { bsonType: 'string', description: 'ICAI / ICMAI / ICSI Registration' },
      caIdNumber: { bsonType: 'string', description: 'Vertofi Official CA Partner ID' },
      copNumber: { bsonType: 'string', description: 'Certificate of Practice No.' },
      specialization: { bsonType: 'array', items: { bsonType: 'string' } },
      mfaEnabled: { bsonType: 'bool' }
    }
  }
};

export const ClientSchemaValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['id', 'name', 'pan', 'gstin', 'status'],
    properties: {
      id: { bsonType: 'string' },
      name: { bsonType: 'string' },
      legalName: { bsonType: 'string' },
      industry: { bsonType: 'string' },
      pan: { bsonType: 'string', pattern: '^[A-Z]{5}[0-9]{4}[A-Z]{1}$' },
      gstin: { bsonType: 'string' },
      cin: { bsonType: 'string' },
      status: { enum: ['ACTIVE', 'INACTIVE', 'HIGH_RISK', 'ONBOARDING'] },
      complianceHealth: { bsonType: 'int', minimum: 0, maximum: 100 },
      financialHealth: { bsonType: 'int', minimum: 0, maximum: 100 },
      bhsScore: { bsonType: 'int', minimum: 0, maximum: 100 },
      annualTurnover: { bsonType: 'number' },
      contactEmail: { bsonType: 'string' },
      contactPhone: { bsonType: 'string' }
    }
  }
};

export const TaskSchemaValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['id', 'title', 'clientId', 'type', 'priority', 'status'],
    properties: {
      id: { bsonType: 'string' },
      title: { bsonType: 'string' },
      description: { bsonType: 'string' },
      clientId: { bsonType: 'string' },
      clientName: { bsonType: 'string' },
      type: {
        enum: [
          'GST_FILING',
          'TDS_RETURN',
          'RECONCILIATION',
          'AUDIT_REVIEW',
          'JOURNAL_APPROVAL',
          'NOTICE_RESPONSE',
          'PERIOD_CLOSE',
          'MIS_REPORT'
        ]
      },
      priority: { enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
      status: {
        enum: [
          'DUE_TODAY',
          'UPCOMING',
          'OVERDUE',
          'PENDING_REVIEW',
          'PENDING_CLIENT_DOCS',
          'PENDING_APPROVAL',
          'EXCEPTIONS',
          'IN_PROGRESS',
          'COMPLETED'
        ]
      },
      dueDate: { bsonType: 'string' },
      assignedToName: { bsonType: 'string' }
    }
  }
};

export const ClientQuerySchemaValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['id', 'clientId', 'clientName', 'senderName', 'subject', 'message', 'caIdNumber', 'status'],
    properties: {
      id: { bsonType: 'string' },
      clientId: { bsonType: 'string' },
      clientName: { bsonType: 'string' },
      senderName: { bsonType: 'string' },
      senderRole: { bsonType: 'string' },
      senderEmail: { bsonType: 'string' },
      subject: { bsonType: 'string' },
      message: { bsonType: 'string' },
      category: {
        enum: ['TAX_CLARIFICATION', 'INVOICE_DISPUTE', 'GST_QUERY', 'TDS_MISMATCH', 'DOCUMENT_SUBMISSION', 'GENERAL']
      },
      priority: { enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] },
      status: { enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'] },
      createdAt: { bsonType: 'string' },
      caIdNumber: { bsonType: 'string' },
      replies: {
        bsonType: 'array',
        items: {
          bsonType: 'object',
          required: ['id', 'senderName', 'senderRole', 'message', 'timestamp'],
          properties: {
            id: { bsonType: 'string' },
            senderName: { bsonType: 'string' },
            senderRole: { bsonType: 'string' },
            message: { bsonType: 'string' },
            timestamp: { bsonType: 'string' }
          }
        }
      }
    }
  }
};

export const ConnectedBusinessSchemaValidator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['id', 'businessName', 'gstin', 'pan', 'connectedViaCaId', 'status'],
    properties: {
      id: { bsonType: 'string' },
      businessName: { bsonType: 'string' },
      gstin: { bsonType: 'string' },
      pan: { bsonType: 'string' },
      cin: { bsonType: 'string' },
      connectedViaCaId: { bsonType: 'string' },
      connectedAt: { bsonType: 'string' },
      status: { enum: ['CONNECTED', 'PENDING_APPROVAL', 'SYNCING'] },
      lastSyncedAt: { bsonType: 'string' },
      annualTurnover: { bsonType: 'string' },
      contactPerson: { bsonType: 'string' },
      contactEmail: { bsonType: 'string' }
    }
  }
};
