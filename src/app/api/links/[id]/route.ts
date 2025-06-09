import { NextResponse } from 'next/server';
import { PgColumn } from 'drizzle-orm/pg-core';
import { deleteLink } from '@/actions/links';
import { getSession } from '@/lib/auth';
import { getLink } from '@/lib/dal';

export async function GET(request: Request, { params }: { params: { id: PgColumn } }) {
  try {
    const session = await getSession();
    if (!session || !session.isActiveSession) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const id = params.id;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ success: false, error: 'No link id provided' }, { status: 400 });
    }

    const link = await getLink(Number(id));

    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    return NextResponse.json(link);
  } catch (error) {
    console.error('Error fetching link:', error);
    return NextResponse.json({ error: 'Failed to fetch link' }, { status: 500 });
  }
}

// Delete link
export async function DELETE(request: Request, { params }: { params: { id: PgColumn } }) {
  try {
    if (!params.id || isNaN(Number(params.id))) {
      return NextResponse.json({ success: false, error: 'No link id provided' }, { status: 400 });
    }
    const result = await deleteLink(Number(params.id));
    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error deleting link:', error);
    return NextResponse.json({ error, message: 'Failed to delete link' }, { status: 500 });
  }
}
