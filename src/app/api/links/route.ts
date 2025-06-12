import { NextResponse } from 'next/server';
import { getLinks } from '@/lib/dal';
import { LinkData } from '@/lib/schemas';
import { createLink, updateLink } from '@/actions/links';
import { Link } from '@/db/schema';

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
    return NextResponse.json({ error, message: 'Failed to fetch links' }, { status: 500 });
  }
}

// Post new link
export async function POST(request: Request) {
  try {
    const data: LinkData = await request.json();

    const result = await createLink(data, false);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({ error, message: 'Failed to create link' }, { status: 500 });
  }
}

// Update link
export async function PUT(request: Request) {
  try {
    const info: Link = await request.json();
    if (!info) {
      return NextResponse.json({ error: 'No data provided' }, { status: 400 });
    }

    const data: LinkData = {
      category: info.category,
      name: info.name,
      description: info.description,
      url: info.url,
      ...(info.isRecommended && { isRecommended: info.isRecommended }),
      ...(info.icon && { icon: info.icon }),
    };

    const result = await updateLink(Number(info.id), data, false);
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error updating link:', error);
    return NextResponse.json({ error, message: 'Failed to update link' }, { status: 500 });
  }
}
