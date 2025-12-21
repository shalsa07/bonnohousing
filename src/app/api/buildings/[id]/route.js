import clientPromise from '@/libs/db';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Common CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Validation function for building updates
function validateBuildingUpdate(updates) {
  const errors = [];

  if (updates.projectTitle !== undefined && (typeof updates.projectTitle !== 'string' || !updates.projectTitle.trim())) {
    errors.push('Project title must be a non-empty string');
  }

  if (updates.buildingTitle !== undefined && (typeof updates.buildingTitle !== 'string' || !updates.buildingTitle.trim())) {
    errors.push('Building title must be a non-empty string');
  }

  if (updates.buildingType !== undefined && (typeof updates.buildingType !== 'string' || !updates.buildingType.trim())) {
    errors.push('Building type must be a non-empty string');
  }

  return errors;
}

// Validation function for complete building replacement (PUT)
function validateCompleteBuilding(building) {
  const errors = [];

  if (!building.projectTitle || typeof building.projectTitle !== 'string' || !building.projectTitle.trim()) {
    errors.push('Project title is required and must be a non-empty string');
  }

  if (!building.buildingTitle || typeof building.buildingTitle !== 'string' || !building.buildingTitle.trim()) {
    errors.push('Building title is required and must be a non-empty string');
  }

  if (!building.buildingType || typeof building.buildingType !== 'string' || !building.buildingType.trim()) {
    errors.push('Building type is required and must be a non-empty string');
  }

  return errors;
}

// Helper function to validate ObjectId
function isValidObjectId(id) {
  return ObjectId.isValid(id) && (String(new ObjectId(id)) === id);
}

export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("ppsbluyari");
    const { id } = await params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid building ID format' },
        { status: 400, headers: corsHeaders }
      );
    }

    const building = await db.collection('buildings').findOne({ _id: new ObjectId(id) });

    if (!building) {
      return NextResponse.json(
        { error: 'Building not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(building, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    console.error('Error fetching building:', e);
    return NextResponse.json(
      { error: 'Unable to fetch building', details: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PUT - Complete replacement of the building
export async function PUT(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("ppsbluyari");
    const { id } = await params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid building ID format' },
        { status: 400, headers: corsHeaders }
      );
    }

    const buildingData = await request.json();

    // Validate required fields for complete replacement
    const validationErrors = validateCompleteBuilding(buildingData);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if building exists
    const existingBuilding = await db.collection('buildings').findOne({ _id: new ObjectId(id) });
    if (!existingBuilding) {
      return NextResponse.json(
        { error: 'Building not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Complete replacement (preserve createdAt, update updatedAt)
    const updatedBuilding = {
      ...buildingData,
      _id: new ObjectId(id),
      createdAt: existingBuilding.createdAt,
      updatedAt: new Date(),
    };

    const result = await db.collection('buildings').replaceOne(
      { _id: new ObjectId(id) },
      updatedBuilding
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Building not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(updatedBuilding, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    console.error('Error updating building:', e);
    return NextResponse.json(
      { error: 'Unable to update building', details: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH - Partial update of the building
export async function PATCH(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("ppsbluyari");
    const { id } = await params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid building ID format' },
        { status: 400, headers: corsHeaders }
      );
    }

    const updates = await request.json();

    // Validate partial updates
    const validationErrors = validateBuildingUpdate(updates);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400, headers: corsHeaders }
      );
    }

    // Add updatedAt timestamp
    const updatesWithTimestamp = {
      ...updates,
      updatedAt: new Date(),
    };

    const result = await db.collection('buildings').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatesWithTimestamp }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Building not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Return the updated building
    const updatedBuilding = await db.collection('buildings').findOne({ _id: new ObjectId(id) });

    return NextResponse.json(updatedBuilding, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    console.error('Error updating building:', e);
    return NextResponse.json(
      { error: 'Unable to update building', details: e.message },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("ppsbluyari");
    const { id } = await params;

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        { error: 'Invalid building ID format' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if building exists before deletion
    const existingBuilding = await db.collection('buildings').findOne({ _id: new ObjectId(id) });
    if (!existingBuilding) {
      return NextResponse.json(
        { error: 'Building not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    const result = await db.collection('buildings').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Building not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        message: 'Building deleted successfully',
        deletedBuilding: {
          _id: existingBuilding._id,
          buildingTitle: existingBuilding.buildingTitle,
          projectTitle: existingBuilding.projectTitle,
        }
      },
      { status: 200, headers: corsHeaders }
    );
  } catch (e) {
    console.error('Error deleting building:', e);
    return NextResponse.json(
      { error: 'Unable to delete building', details: e.message },
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