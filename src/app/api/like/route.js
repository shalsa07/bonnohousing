import { NextResponse } from 'next/server';
import clientPromise from '@/libs/db';
import { ObjectId } from 'mongodb';

// Prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/**
 * Like API Route
 * Handles toggling likes for buildings using browser fingerprinting
 * Uses raw MongoDB (consistent with existing codebase)
 */

// GET - Check if visitor has liked a building and get like count
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buildingId = searchParams.get('buildingId');
    const visitorId = searchParams.get('visitorId');

    if (!buildingId) {
      return NextResponse.json(
        { error: 'Building ID is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('bonnohousing');

    const building = await db.collection('buildings').findOne(
      { _id: new ObjectId(buildingId) },
      { projection: { likes: 1, likeCount: 1 } }
    );

    if (!building) {
      return NextResponse.json(
        { error: 'Building not found' },
        { status: 404 }
      );
    }

    // Initialize likes array if it doesn't exist
    const likes = building.likes || [];
    const hasLiked = visitorId ? likes.includes(visitorId) : false;

    return NextResponse.json({
      hasLiked,
      likeCount: building.likeCount || likes.length,
    });

  } catch (error) {
    console.error('Error checking like status:', error);
    return NextResponse.json(
      { error: 'Failed to check like status', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Toggle like for a building
export async function POST(request) {
  try {
    const body = await request.json();
    const { buildingId, visitorId } = body;

    // Validate required fields
    if (!buildingId || !visitorId) {
      return NextResponse.json(
        { error: 'Building ID and Visitor ID are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('bonnohousing');

    // Find the building first
    const building = await db.collection('buildings').findOne(
      { _id: new ObjectId(buildingId) },
      { projection: { likes: 1 } }
    );

    if (!building) {
      return NextResponse.json(
        { error: 'Building not found' },
        { status: 404 }
      );
    }

    // Initialize likes array if it doesn't exist
    const likes = building.likes || [];
    const hasLiked = likes.includes(visitorId);

    let result;
    let liked;

    if (hasLiked) {
      // Unlike: Remove visitorId from likes array
      result = await db.collection('buildings').findOneAndUpdate(
        { _id: new ObjectId(buildingId) },
        {
          $pull: { likes: visitorId },
          $inc: { likeCount: -1 },
          $set: { updatedAt: new Date() }
        },
        { returnDocument: 'after' }
      );
      liked = false;
      console.log(`✓ Building ${buildingId} unliked by visitor ${visitorId.substring(0, 8)}...`);
    } else {
      // Like: Add visitorId to likes array (atomic operation prevents duplicates)
      result = await db.collection('buildings').findOneAndUpdate(
        { _id: new ObjectId(buildingId) },
        {
          $addToSet: { likes: visitorId },
          $inc: { likeCount: 1 },
          $set: { updatedAt: new Date() }
        },
        { returnDocument: 'after' }
      );
      liked = true;
      console.log(`✓ Building ${buildingId} liked by visitor ${visitorId.substring(0, 8)}...`);
    }

    return NextResponse.json({
      success: true,
      liked,
      likeCount: result.value?.likeCount || (liked ? 1 : 0),
      message: liked ? 'Building liked successfully' : 'Building unliked successfully'
    });

  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like', details: error.message },
      { status: 500 }
    );
  }
}
