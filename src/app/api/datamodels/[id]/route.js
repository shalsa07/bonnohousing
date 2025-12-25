import clientPromise from '@/libs/db';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

// Prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export async function GET(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("bonnohousing");
    const { id } = params;

    const datamodels = await db.collection('datamodels').findOne({ _id: new ObjectId(id) });

    if (!datamodels) {
      return NextResponse.json({ error: 'Data model not found' }, { status: 404 });
    }

    return NextResponse.json(datamodels, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to fetch data model' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("bonnohousing");
    const { id } = params;
    const updates = await request.json();

    const result = await db.collection('datamodels').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Data model not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Data model updated successfully' }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to update data model' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function PATCH(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("bonnohousing");
    const { id } = params;
    const updates = await request.json();

    const result = await db.collection('datamodels').updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Data model not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Data model updated successfully' }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to update data model' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const client = await clientPromise;
    const db = client.db("bonnohousing");
    const { id } = params;

    const result = await db.collection('datamodels').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Data model not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Data model deleted successfully' }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Unable to delete data model' }, {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}