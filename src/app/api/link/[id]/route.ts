import { NextResponse } from 'next/server';
import { db } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

export async function GET(request: Request, { params }: { params: { id: PgColumn } }) {
  try {
    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');

    // If no Authorization header is present, return a 401 Unauthorized response
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'Authorization header is required' }, { status: 401 });
    }

    const id = params.id;

    const link = await db.query.links.findFirst({
      where: eq(links.id, id),
    });

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 });
  }
}
