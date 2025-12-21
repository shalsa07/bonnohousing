import clientPromise from '@/libs/db';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  let buildings = [];

  try {
    const client = await clientPromise;
    const db = client.db("bonnohousing");
    
    // Fetch all buildings
    const rawBuildings = await db.collection('buildings').find({}).sort({ createdAt: -1 }).toArray();
    
    // Serialize for client component (ObjectId -> string, Date -> string)
    buildings = JSON.parse(JSON.stringify(rawBuildings));
  } catch (error) {
    console.error('Error fetching buildings:', error);
    // Even if fetch fails, we render the client component with empty array or handle error there if we passed error prop
    // For now, empty array is safe to prevent crash
  }

  return <ProjectsClient initialBuildings={buildings} />;
}
