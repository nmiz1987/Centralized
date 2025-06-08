import { NextResponse } from 'next/server';
import { db } from '@/db';
import { getCurrentUser } from '@/lib/dal';
import { links } from '@/db/schema';
import { LinkData } from '@/lib/schemas';

export async function GET() {
  try {
    const allLinks = await db.query.links.findMany();
    return NextResponse.json(allLinks);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data: Pick<LinkData, 'category' | 'icon' | 'name' | 'description' | 'url'> = await request.json();

    const user = await getCurrentUser();

    if (!user || !user.id) {
      return NextResponse.json({ error: 'User is not authenticated' }, { status: 401 });
    }

    // Validate required fields
    if (!data.category || !data.icon || !data.name || !data.url || !data.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create the link
    const newLink = await db
      .insert(links)
      .values({
        ...data,
        userId: user.id,
      })
      .returning();

    return NextResponse.json({ message: 'Link created successfully', link: newLink[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
