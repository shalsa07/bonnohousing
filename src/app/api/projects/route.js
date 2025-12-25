
import clientPromise from '@/libs/db';
import { NextResponse } from 'next/server';

// Prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function POST(request) {
  try {
    const client = await clientPromise;
    const db = client.db("bonnohousing");

    const project = await request.json();

    const result = await db.collection('projects').insertOne(project);

    return NextResponse.json(result, {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to create project' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bonnohousing");

    const projects = await db.collection('projects').find({}).toArray();

    return NextResponse.json(projects, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch projects' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
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
