import { MongoClient } from 'mongodb';
import fs from 'fs';
import dns from 'dns';
import { MongoCollections } from './schemas';

// Configure standard DNS resolvers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore
}

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

export async function clearAllDemoData() {
  const { uri, dbName } = getMongoConfig();

  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    return false;
  }

  console.log(`🔌 Connecting to MongoDB Database: ${dbName}...`);
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas successfully!');
    const db = client.db(dbName);

    // Fetch all collections currently in the database to ensure 100% complete wipe
    const existingCollections = await db.listCollections().toArray();
    const collectionNames = existingCollections.map((c) => c.name);

    for (const colName of collectionNames) {
      try {
        const result = await db.collection(colName).deleteMany({});
        console.log(`🧹 Cleaned collection: ${colName} (Removed ${result.deletedCount} records)`);
      } catch (e: any) {
        console.warn(`Could not clear ${colName}:`, e.message);
      }
    }

    console.log('✨ All demo data successfully removed from MongoDB Atlas! The database is 100% clean and ready for real-time production.');
    return true;
  } catch (err: any) {
    console.error('❌ Error clearing database:', err.message);
    return false;
  } finally {
    await client.close();
  }
}

if (process.argv[1]?.includes('cleanDb')) {
  clearAllDemoData();
}
