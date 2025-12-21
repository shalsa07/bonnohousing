import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) { console.error('No MONGODB_URI'); process.exit(1); }

const client = new MongoClient(uri, { tls: true });

async function run() {
  try {
    await client.connect();
    const db = client.db('bonnohousing');
    
    // Check 'buildings' collection (or whichever has images)
    const buildings = await db.collection('buildings').find({}).limit(1).toArray();
    console.log('--- Building Sample ---');
    if (buildings.length) {
        // Log keys that might contain images
        console.log(JSON.stringify(buildings[0], null, 2));
    } else {
        console.log('No buildings found.');
    }

    // Check 'projects' if it exists (schema might vary)
    const projects = await db.collection('projects').find({}).limit(1).toArray();
    console.log('\n--- Project Sample ---');
    if (projects.length) {
        console.log(JSON.stringify(projects[0], null, 2));
    } else {
        console.log('No projects found.');
    }

  } finally {
    await client.close();
  }
}

run();
