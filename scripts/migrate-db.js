import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
// Source DB is ppsbluyari - we need to assume it's on the same cluster/connection or allow specifying a different URI if needed.
// Based on user request "copy from ppsbluyari to bonnohousing cluster", assuming same connection string access but different DB names.

if (!uri) {
  console.error('❌ MONGODB_URI is not defined');
  process.exit(1);
}

const client = new MongoClient(uri, { tls: true });

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected');

    const sourceDbName = 'ppsbluyari';
    const targetDbName = 'bonnohousing';
    
    const sourceDb = client.db(sourceDbName);
    const targetDb = client.db(targetDbName);

    console.log(`🚀 Starting migration from ${sourceDbName} to ${targetDbName}...`);

    // Get list of collections
    const collections = await sourceDb.listCollections().toArray();
    
    if (collections.length === 0) {
        console.warn(`⚠️  No collections found in source database: ${sourceDbName}`);
        return;
    }

    for (const colInfo of collections) {
      const colName = colInfo.name;
      if (colName === 'system.profile') continue; // Skip system collections

      console.log(`\n📦 Migrating collection: ${colName}`);
      
      const sourceCol = sourceDb.collection(colName);
      const targetCol = targetDb.collection(colName);

      const docs = await sourceCol.find({}).toArray();
      
      if (docs.length === 0) {
        console.log(`   - Skipping (no documents)`);
        continue;
      }

      console.log(`   - Found ${docs.length} documents`);
      
      try {
          // Use insertMany with ordered: false to continue if some duplicates exist
          const result = await targetCol.insertMany(docs, { ordered: false });
          console.log(`   - ✅ Inserted ${result.insertedCount} documents`);
      } catch (e) {
          if (e.code === 11000) {
              console.log(`   - ⚠️  Some documents already existed (duplicates skipped)`);
              // If insertMany fails (partial), result is in e.result usually, or we just trust existing data
          } else {
              console.error(`   - ❌ Error inserting documents: ${e.message}`);
          }
      }
    }

    console.log('\n✨ Migration completed!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await client.close();
  }
}

run();
