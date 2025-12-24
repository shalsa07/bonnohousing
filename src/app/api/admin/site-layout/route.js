import clientPromise from '@/libs/db';
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { siteLauyout } from '@/libs/settings';

// Prevent build-time execution
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db("bonnohousing");

        // Fetch site layout from database
        const siteLayout = await db.collection('siteLayout').findOne({});

        // If no site layout exists in database, return defaults from settings.js
        const data = siteLayout || siteLauyout;

        return NextResponse.json(data, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (e) {
        console.error('Error fetching site layout:', e);
        return NextResponse.json({ error: 'Unable to fetch site layout' }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    }
}

export async function POST(request) {
    try {
        // Check authentication
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // TODO: Add admin role check here if needed
        // if (session.user.role !== 'admin') {
        //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        // }

        const client = await clientPromise;
        const db = client.db("bonnohousing");

        const siteLayoutData = await request.json();

        // Add metadata
        const dataToSave = {
            ...siteLayoutData,
            updatedAt: new Date(),
            updatedBy: session.user.email || session.user.name
        };

        // Check if site layout already exists
        const existing = await db.collection('siteLayout').findOne({});

        let result;
        if (existing) {
            // Update existing site layout
            result = await db.collection('siteLayout').updateOne(
                { _id: existing._id },
                { $set: dataToSave }
            );
        } else {
            // Create new site layout
            dataToSave.createdAt = new Date();
            result = await db.collection('siteLayout').insertOne(dataToSave);
        }

        return NextResponse.json({
            success: true,
            message: 'Site layout saved successfully',
            result
        }, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            },
        });
    } catch (e) {
        console.error('Error saving site layout:', e);
        return NextResponse.json({ error: 'Unable to save site layout' }, {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
