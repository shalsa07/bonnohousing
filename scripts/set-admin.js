import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const targetEmail = 'joshseane@gmail.com';

if (!uri) {
  console.error('❌ MONGODB_URI is not defined in environment');
  process.exit(1);
}

const client = new MongoClient(uri, { tls: true });

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected');

    const db = client.db();
    const headers = await db.collection('users').updateOne(
        { email: targetEmail },
        { $set: { role: 'admin' } }
    );

    if (headers.matchedCount === 0) {
        console.log(`⚠️ User ${targetEmail} not found. They will be admin upon first login/signup due to code changes.`);
    } else if (headers.modifiedCount > 0) {
        console.log(`✅ Successfully updated ${targetEmail} to admin role.`);
    } else {
        console.log(`ℹ️ User ${targetEmail} is already an admin.`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

run();
