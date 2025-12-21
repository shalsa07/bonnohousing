import clientPromise from '@/libs/db';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }

    const client = await clientPromise;
    const db = client.db("bonnohousing");

    // Get project statistics
    const totalProjects = await db.collection('buildings').countDocuments();
    
    // Get recent projects (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentProjects = await db.collection('buildings').countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Get projects by type
    const projectsByType = await db.collection('buildings').aggregate([
      { $group: { _id: '$buildingType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    // Get user statistics
    const totalUsers = await db.collection('users').countDocuments();
    const adminUsers = await db.collection('users').countDocuments({ role: 'admin' });

    // Get recent activity (last 5 updated projects)
    const recentActivity = await db.collection('buildings')
      .find({})
      .sort({ updatedAt: -1 })
      .limit(5)
      .project({ projectTitle: 1, buildingTitle: 1, updatedAt: 1, createdAt: 1 })
      .toArray();

    // Calculate projects with pending uploads (files uploaded but not saved)
    // This checks for files that don't have proper name/priority set
    const projectsWithFiles = await db.collection('buildings')
      .find({ 
        $or: [
          { 'renders': { $exists: true, $ne: [] } },
          { 'drawings': { $exists: true, $ne: [] } },
          { 'modelsFiles': { $exists: true, $ne: [] } }
        ]
      })
      .count();

    return NextResponse.json({
      projects: {
        total: totalProjects,
        recentlyAdded: recentProjects,
        byType: projectsByType,
        withFiles: projectsWithFiles
      },
      users: {
        total: totalUsers,
        admins: adminUsers,
        regular: totalUsers - adminUsers
      },
      recentActivity: recentActivity.map(item => ({
        id: item._id.toString(),
        title: item.projectTitle || item.buildingTitle,
        updatedAt: item.updatedAt,
        createdAt: item.createdAt,
        isNew: new Date(item.createdAt) > sevenDaysAgo
      })),
      lastUpdated: new Date()
    }, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    console.error('Error fetching admin stats:', e);
    return NextResponse.json(
      { error: 'Unable to fetch statistics', details: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

