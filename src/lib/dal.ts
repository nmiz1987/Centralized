import { db } from '@/db';
import { getSession } from './auth';
import { and, eq, sql } from 'drizzle-orm';
import { cache } from 'react';
import { links, users } from '@/db/schema';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { CACHE_TAGS } from './constants';

export async function getCategoriesByUserId(userId: string) {
  'use cache';
  cacheTag(CACHE_TAGS.allCategories);
  try {
    const result = await db.query.links.findMany({
      where: eq(links.userId, userId),
      columns: {
        category: true,
      },
    });

    return [...new Set(result.map(item => item.category))];
  } catch (error) {
    console.error('Error fetching categories by user ID:', error);
    throw new Error('Failed to fetch categories by user ID');
  }
}

export async function getCategories() {
  try {
    const session = await getSession();
    if (!session || !session.isActiveSession) return null;

    const results = await getCategoriesByUserId(session.userId);
    return results;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Failed to fetch categories');
  }
}

// Current user
export const getCurrentUser = cache(async () => {
  try {
    const session = await getSession();
    if (!session || !session.isActiveSession) return null;

    const result = await db.query.users.findFirst({
      where: eq(users.id, session.userId),
    });

    return result || null;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
});

// Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const result = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return result || null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export async function getLinksByUserId(userId: string, category?: string, search?: string) {
  'use cache';
  cacheTag(CACHE_TAGS.allLinks);
  try {
    // Base condition for user ID
    const conditions = [eq(links.userId, userId)];

    // First apply category filter if provided
    if (category) {
      conditions.push(eq(links.category, category));
    }

    // Then apply search within the filtered results
    if (search) {
      const searchPattern = `%${search.toLowerCase()}%`;
      const searchCondition = sql`(
        lower(${links.name}) LIKE ${searchPattern} OR 
        lower(${links.description}) LIKE ${searchPattern} OR 
        lower(${links.url}) LIKE ${searchPattern}
      )`;
      conditions.push(searchCondition);
    }

    const result = await db.query.links.findMany({
      orderBy: (links, { desc }) => [desc(links.createdAt)],
      where: and(...conditions),
    });
    return result;
  } catch (error) {
    console.error('Error fetching links by user ID:', error);
    throw new Error('Failed to fetch links by user ID');
  }
}

export async function getLinks(category?: string, search?: string) {
  try {
    const session = await getSession();

    if (!session || !session.isActiveSession) return [];

    const results = await getLinksByUserId(session.userId, category, search);

    return results;
  } catch (error) {
    console.error('Error fetching links:', error);
    throw new Error('Failed to fetch links');
  }
}

export async function getLink(id: number) {
  try {
    const session = await getSession();
    if (!session || !session.isActiveSession) return null;

    const result = await db.query.links.findFirst({
      where: and(eq(links.userId, session.userId), eq(links.id, id)),
    });

    if (!result) return null;

    return result;
  } catch (error) {
    console.error('Error fetching links:', error);
    throw new Error('Failed to fetch link');
  }
}
