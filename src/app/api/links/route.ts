import { NextResponse } from 'next/server';
import { getLinks } from '@/lib/dal';
import { LinkData } from '@/lib/schemas';
import { createLink } from '@/actions/links';

// Get all links
export async function GET(request: Request) {
  try {
    const params = new URL(request.url);
    const category = params.searchParams.get('category') ?? undefined;
    const search = params.searchParams.get('search') ?? undefined;
    const allLinks = await getLinks(category, search);
    return NextResponse.json(allLinks);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}

// Post new link
export async function POST(request: Request) {
  try {
    const data: LinkData = await request.json();

    const result = await createLink(data);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({ error: 'Failed to create link' }, { status: 500 });
  }
}
