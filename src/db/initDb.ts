import { MongoClient } from 'mongodb';
import fs from 'fs';
import dns from 'dns';
import { MongoCollections } from './schemas';

// Configure standard DNS resolvers for Windows/Node SRV lookups
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if already set
}
import {
  mockUsers,
  mockClients,
  mockTasks,
  mockAccounts,
  mockJournalEntries,
  mockInvoices,
  mockStatutoryNotices,
  mockRiskExceptions,
  mockApprovals,
  mockAuditLogs,
  mockClientQueries,
  mockConnectedBusinesses
} from '../data/mockData';

// Parse .env.local
function getMongoConfig() {
  let uri = process.env.MONGODB_URI || '';
  let dbName = process.env.MONGODB_DB_NAME || 'vertofi_panel';

  if (!uri && fs.existsSync('.env.local')) {
    const envContent = fs.readFileSync('.env.local', 'utf-8');
    const uriMatch = envContent.match(/MONGODB_URI=["']?([^"'\r\n]+)["']?/);
    const dbMatch = envContent.match(/MONGODB_DB_NAME=["']?([^"'\r\n]+)["']?/);
    if (uriMatch) uri = uriMatch[1];
    if (dbMatch) dbName = dbMatch[1];
  }

  return { uri, dbName };
}

export async function initializeDatabase() {
  const { uri, dbName } = getMongoConfig();

  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return false;
  }

  console.log(`🔌 Connecting to MongoDB Database: ${dbName}...`);
  console.log(`📍 Cluster: cluster0.lhyu1xv.mongodb.net`);
  
  let client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000
  });

  let db;

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    db = client.db(dbName);
  } catch (err: any) {
    console.log('⚠️ Primary SRV connection attempt failed. Trying direct cluster fallback...');
    const fallbackUri = `mongodb://vertofi_app:Vertofi%40Fintech12@ac-mgeezxz-shard-00-00.lhyu1xv.mongodb.net:27017,ac-mgeezxz-shard-00-01.lhyu1xv.mongodb.net:27017,ac-mgeezxz-shard-00-02.lhyu1xv.mongodb.net:27017/${dbName}?ssl=true&authSource=admin&retryWrites=true&w=majority`;
    client = new MongoClient(fallbackUri, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 8000
    });
    try {
      await client.connect();
      console.log('✅ Connected to MongoDB Atlas via cluster fallback!');
      db = client.db(dbName);
    } catch (fallbackErr: any) {
      console.error('\n❌ MongoDB Atlas Connection Blocked:');
      console.error('Atlas firewall is currently rejecting incoming connections from this IP address.\n');
      console.error('👉 TO FIX IN 30 SECONDS:');
      console.error('1. Go to https://cloud.mongodb.com/');
      console.error('2. Under "Security" in the left menu, click "Network Access"');
      console.error('3. Click "+ Add IP Address" and select "Allow Access from Anywhere" (0.0.0.0/0)');
      console.error('4. Click "Confirm" and wait ~15 seconds until status is Active.');
      console.error('5. Re-run: npm run db:init\n');
      return false;
    }
  }

  try {

    const existingCollections = (await db.listCollections().toArray()).map((c) => c.name);

    // 1. Users
    if (!existingCollections.includes(MongoCollections.USERS)) {
      console.log(`Creating collection: ${MongoCollections.USERS}...`);
      await db.createCollection(MongoCollections.USERS);
      await db.collection(MongoCollections.USERS).createIndex({ email: 1 }, { unique: true });
      await db.collection(MongoCollections.USERS).createIndex({ caIdNumber: 1 });
      await db.collection(MongoCollections.USERS).insertMany(mockUsers as any[]);
      console.log(`✓ Seeded ${mockUsers.length} users into ${MongoCollections.USERS}`);
    }

    // 2. Clients
    if (!existingCollections.includes(MongoCollections.CLIENTS)) {
      console.log(`Creating collection: ${MongoCollections.CLIENTS}...`);
      await db.createCollection(MongoCollections.CLIENTS);
      await db.collection(MongoCollections.CLIENTS).createIndex({ pan: 1 }, { unique: true });
      await db.collection(MongoCollections.CLIENTS).createIndex({ gstin: 1 }, { unique: true });
      await db.collection(MongoCollections.CLIENTS).insertMany(mockClients as any[]);
      console.log(`✓ Seeded ${mockClients.length} clients into ${MongoCollections.CLIENTS}`);
    }

    // 3. Tasks
    if (!existingCollections.includes(MongoCollections.TASKS)) {
      console.log(`Creating collection: ${MongoCollections.TASKS}...`);
      await db.createCollection(MongoCollections.TASKS);
      await db.collection(MongoCollections.TASKS).createIndex({ id: 1 }, { unique: true });
      await db.collection(MongoCollections.TASKS).createIndex({ clientId: 1, status: 1 });
      await db.collection(MongoCollections.TASKS).insertMany(mockTasks as any[]);
      console.log(`✓ Seeded ${mockTasks.length} tasks into ${MongoCollections.TASKS}`);
    }

    // 4. Accounts (Chart of Accounts)
    if (!existingCollections.includes(MongoCollections.ACCOUNTS)) {
      console.log(`Creating collection: ${MongoCollections.ACCOUNTS}...`);
      await db.createCollection(MongoCollections.ACCOUNTS);
      await db.collection(MongoCollections.ACCOUNTS).createIndex({ code: 1 }, { unique: true });
      await db.collection(MongoCollections.ACCOUNTS).insertMany(mockAccounts as any[]);
      console.log(`✓ Seeded ${mockAccounts.length} accounts into ${MongoCollections.ACCOUNTS}`);
    }

    // 5. Journal Entries
    if (!existingCollections.includes(MongoCollections.JOURNAL_ENTRIES)) {
      console.log(`Creating collection: ${MongoCollections.JOURNAL_ENTRIES}...`);
      await db.createCollection(MongoCollections.JOURNAL_ENTRIES);
      await db.collection(MongoCollections.JOURNAL_ENTRIES).createIndex({ voucherNumber: 1 }, { unique: true });
      await db.collection(MongoCollections.JOURNAL_ENTRIES).insertMany(mockJournalEntries as any[]);
      console.log(`✓ Seeded ${mockJournalEntries.length} journal entries into ${MongoCollections.JOURNAL_ENTRIES}`);
    }

    // 6. Invoices
    if (!existingCollections.includes(MongoCollections.INVOICES)) {
      console.log(`Creating collection: ${MongoCollections.INVOICES}...`);
      await db.createCollection(MongoCollections.INVOICES);
      await db.collection(MongoCollections.INVOICES).createIndex({ invoiceNumber: 1 }, { unique: true });
      await db.collection(MongoCollections.INVOICES).insertMany(mockInvoices as any[]);
      console.log(`✓ Seeded ${mockInvoices.length} invoices into ${MongoCollections.INVOICES}`);
    }

    // 7. Statutory Notices
    if (!existingCollections.includes(MongoCollections.STATUTORY_NOTICES)) {
      console.log(`Creating collection: ${MongoCollections.STATUTORY_NOTICES}...`);
      await db.createCollection(MongoCollections.STATUTORY_NOTICES);
      await db.collection(MongoCollections.STATUTORY_NOTICES).createIndex({ noticeId: 1 }, { unique: true });
      await db.collection(MongoCollections.STATUTORY_NOTICES).insertMany(mockStatutoryNotices as any[]);
      console.log(`✓ Seeded ${mockStatutoryNotices.length} notices into ${MongoCollections.STATUTORY_NOTICES}`);
    }

    // 8. Risk & Exceptions
    if (!existingCollections.includes(MongoCollections.RISK_EXCEPTIONS)) {
      console.log(`Creating collection: ${MongoCollections.RISK_EXCEPTIONS}...`);
      await db.createCollection(MongoCollections.RISK_EXCEPTIONS);
      await db.collection(MongoCollections.RISK_EXCEPTIONS).createIndex({ id: 1 }, { unique: true });
      await db.collection(MongoCollections.RISK_EXCEPTIONS).insertMany(mockRiskExceptions as any[]);
      console.log(`✓ Seeded ${mockRiskExceptions.length} risk exceptions into ${MongoCollections.RISK_EXCEPTIONS}`);
    }

    // 9. Approvals (Maker-Checker)
    if (!existingCollections.includes(MongoCollections.APPROVALS)) {
      console.log(`Creating collection: ${MongoCollections.APPROVALS}...`);
      await db.createCollection(MongoCollections.APPROVALS);
      await db.collection(MongoCollections.APPROVALS).createIndex({ id: 1 }, { unique: true });
      await db.collection(MongoCollections.APPROVALS).insertMany(mockApprovals as any[]);
      console.log(`✓ Seeded ${mockApprovals.length} approvals into ${MongoCollections.APPROVALS}`);
    }

    // 10. Client Queries (Business Portal Bridge)
    if (!existingCollections.includes(MongoCollections.CLIENT_QUERIES)) {
      console.log(`Creating collection: ${MongoCollections.CLIENT_QUERIES}...`);
      await db.createCollection(MongoCollections.CLIENT_QUERIES);
      await db.collection(MongoCollections.CLIENT_QUERIES).createIndex({ id: 1 }, { unique: true });
      await db.collection(MongoCollections.CLIENT_QUERIES).createIndex({ caIdNumber: 1 });
      await db.collection(MongoCollections.CLIENT_QUERIES).insertMany(mockClientQueries as any[]);
      console.log(`✓ Seeded ${mockClientQueries.length} client queries into ${MongoCollections.CLIENT_QUERIES}`);
    }

    // 11. Connected Businesses (CA ID Link)
    if (!existingCollections.includes(MongoCollections.CONNECTED_BUSINESSES)) {
      console.log(`Creating collection: ${MongoCollections.CONNECTED_BUSINESSES}...`);
      await db.createCollection(MongoCollections.CONNECTED_BUSINESSES);
      await db.collection(MongoCollections.CONNECTED_BUSINESSES).createIndex({ gstin: 1 }, { unique: true });
      await db.collection(MongoCollections.CONNECTED_BUSINESSES).createIndex({ connectedViaCaId: 1 });
      await db.collection(MongoCollections.CONNECTED_BUSINESSES).insertMany(mockConnectedBusinesses as any[]);
      console.log(`✓ Seeded ${mockConnectedBusinesses.length} connected businesses into ${MongoCollections.CONNECTED_BUSINESSES}`);
    }

    // 12. Audit Logs
    if (!existingCollections.includes(MongoCollections.AUDIT_LOGS)) {
      console.log(`Creating collection: ${MongoCollections.AUDIT_LOGS}...`);
      await db.createCollection(MongoCollections.AUDIT_LOGS);
      await db.collection(MongoCollections.AUDIT_LOGS).createIndex({ id: 1 }, { unique: true });
      await db.collection(MongoCollections.AUDIT_LOGS).createIndex({ timestamp: -1 });
      await db.collection(MongoCollections.AUDIT_LOGS).insertMany(mockAuditLogs as any[]);
      console.log(`✓ Seeded ${mockAuditLogs.length} audit logs into ${MongoCollections.AUDIT_LOGS}`);
    }

    console.log('🎉 MongoDB schema creation & database initialization complete!');
    return true;
  } catch (err: any) {
    console.error('❌ Database initialization error:', err.message);
    return false;
  } finally {
    await client.close();
  }
}

if (process.argv[1]?.includes('initDb')) {
  initializeDatabase();
}
