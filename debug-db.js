import { MongoClient } from 'mongodb';
// Env vars loaded via --env-file=.env.local

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

console.log(`Checking connection to MongoDB...`);
// Mask the URI for logging safety, show only protocol and host if possible
try {
    const urlParts = new URL(uri);
    console.log(`Connecting to host: ${urlParts.host}`);
} catch (e) {
    console.log('Could not parse URI for logging (might be malformed or standard connection string).');
}

const client = new MongoClient(uri, {
  tls: true,
  serverSelectionTimeoutMS: 5000, 
});

async function run() {
  try {
    await client.connect();
    console.log("✅ Successfully connected to MongoDB!");
    
    const db = client.db();
    console.log(`Connected to database: ${db.databaseName}`);
    
    // List collections to verify read access
    const collections = await db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`);
    collections.forEach(c => console.log(` - ${c.name}`));

  } catch (error) {
    console.error("❌ Connection failed!");
    console.error("Name:", error.name);
    console.error("Message:", error.message);
    if (error.cause) {
        console.error("Cause:", error.cause);
    }
  } finally {
    await client.close();
  }
}

run();
