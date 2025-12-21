import clientPromise from '@/libs/db';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("ppsbluyari");

    const development = await request.json();

    // Validate required fields
    if (!development.title || !development.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Add timestamps
    const developmentData = {
      ...development,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('developments').insertOne(developmentData);

    return NextResponse.json(
      { ...developmentData, _id: result.insertedId },
      {
        status: 201,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (e) {
    console.error('Error creating development:', e);
    return NextResponse.json(
      { error: 'Unable to create development' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ppsbluyari");

    const developments = await db.collection('developments').find({}).toArray();

    return NextResponse.json(developments, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (e) {
    console.error('Error fetching developments:', e);
    return NextResponse.json(
      { error: 'Unable to fetch developments' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

