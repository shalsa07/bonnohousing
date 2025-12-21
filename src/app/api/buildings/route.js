import clientPromise from '@/libs/db';
import { NextResponse } from 'next/server';

// Common CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Validation function for building data
function validateBuildingData(building) {
  const errors = [];

  if (!building.projectTitle || typeof building.projectTitle !== 'string') {
    errors.push('Project title is required and must be a string');
  }

  if (!building.buildingTitle || typeof building.buildingTitle !== 'string') {
    errors.push('Building title is required and must be a string');
  }

  if (!building.buildingType || typeof building.buildingType !== 'string') {
    errors.push('Building type is required and must be a string');
  }

  return errors;
}

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("ppsbluyari");

    const building = await request.json();

    // Validate input data
    const validationErrors = validateBuildingData(building);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Add timestamps
    const buildingWithTimestamps = {
      ...building,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('buildings').insertOne(buildingWithTimestamps);

    // Return the created building with its ID
    const createdBuilding = {
      _id: result.insertedId,
      ...buildingWithTimestamps,
    };

    return NextResponse.json(createdBuilding, {
      status: 201,
      headers: corsHeaders,
    });
  } catch (e) {
    console.error('Error creating building:', e);
    return NextResponse.json(
      { error: 'Unable to create building', details: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db("ppsbluyari");

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;
    const skip = (page - 1) * limit;

    // Optional filtering by building type
    const buildingType = searchParams.get('type');
    const filter = buildingType ? { buildingType } : {};

    const buildings = await db.collection('buildings')
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    // Get total count for pagination
    const total = await db.collection('buildings').countDocuments(filter);

    return NextResponse.json({
      buildings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    console.error('Error fetching buildings:', e);
    return NextResponse.json(
      { error: 'Unable to fetch buildings', details: e.message },
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
