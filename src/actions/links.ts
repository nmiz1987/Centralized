'use server';

import { db } from '@/db';
import { Link, links } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/dal';
import { revalidateTag } from 'next/cache';
import { CACHE_TAGS } from '@/lib/constants';
import { LinkData, LinkSchema } from '@/lib/schemas';

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  values?: Link | LinkData; // Link - new link from server, LinkData - link's data from client (for failed validation)
};

export async function createLink(data: LinkData, returnDataInResponse: boolean): Promise<ActionResponse> {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized access',
        errors: { error: ['Unauthorized'] },
      };
    }

    const trimmedData: LinkData = {
      ...data,
      category: data.category.trim(),
      name: data.name.trim(),
      description: data.description.trim(),
      url: data.url.trim(),
      icon: data.icon?.trim(),
    };

    // Validate with Zod
    const validationResult = LinkSchema.safeParse(trimmedData);
    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
        ...(returnDataInResponse && { values: trimmedData as LinkData }),
      };
    }

    // Create link with validated data
    const validatedData = validationResult.data;
    const newLink = await db
      .insert(links)
      .values({
        name: validatedData.name,
        description: validatedData.description,
        url: validatedData.url,
        category: validatedData.category,
        isRecommended: validatedData.isRecommended,
        icon: validatedData.icon,
        userId: user.id,
      })
      .returning();

    revalidateTag(CACHE_TAGS.allLinks);
    revalidateTag(CACHE_TAGS.allCategories);

    return { success: true, message: 'Link created successfully', values: newLink[0] as Link };
  } catch (error) {
    console.error('Error creating link:', error);
    return {
      success: false,
      message: 'An error occurred while creating the link',
      errors: { error: ['Failed to create link'] },
    };
  }
}

export async function updateLink(id: number, data: LinkData, returnDataInResponse: boolean): Promise<ActionResponse> {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'Unauthorized access',
        errors: { error: ['Unauthorized'] },
      };
    }

    // check if the link exists
    const link = await db
      .select()
      .from(links)
      .where(and(eq(links.id, id), eq(links.userId, user.id)));
    if (!link || link.length === 0) {
      return {
        success: false,
        message: 'Link not found',
        ...(returnDataInResponse && { values: data as LinkData }),
      };
    }

    const trimmedData: LinkData = {
      ...data,
      category: data.category.trim(),
      name: data.name.trim(),
      description: data.description.trim(),
      url: data.url.trim(),
      icon: data.icon?.trim(),
    };

    // Validate with Zod
    const validationResult = LinkSchema.safeParse(trimmedData);

    if (!validationResult.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: validationResult.error.flatten().fieldErrors,
        ...(returnDataInResponse && { values: trimmedData as LinkData }),
      };
    }

    // Type safe update object with validated data
    const validatedData = validationResult.data;
    const updateData: Record<string, unknown> = {};

    updateData.category = validatedData.category || 'General';
    if (validatedData.icon !== undefined) updateData.icon = validatedData.icon;
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.url !== undefined) updateData.url = validatedData.url;
    if (validatedData.isRecommended !== undefined) updateData.isRecommended = validatedData.isRecommended;

    // Update link
    const updatedLink = await db
      .update(links)
      .set(updateData)
      .where(and(eq(links.id, id), eq(links.userId, user.id)))
      .returning();

    revalidateTag(CACHE_TAGS.allLinks);
    revalidateTag(CACHE_TAGS.allCategories);

    return { success: true, message: 'Link updated successfully', values: updatedLink[0] };
  } catch (error) {
    console.error('Error updating link:', error);
    return {
      success: false,
      message: 'An error occurred while updating the link',
      errors: { error: ['Failed to update link'] },
    };
  }
}

export async function deleteLink(id: number) {
  try {
    // Security check - ensure user is authenticated
    const user = await getCurrentUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    // check if the link exists
    const link = await db
      .select()
      .from(links)
      .where(and(eq(links.id, id), eq(links.userId, user.id)));
    if (!link || link.length === 0) {
      return {
        success: false,
        message: 'Link not found',
      };
    }

    // Delete link
    await db.delete(links).where(and(eq(links.id, id), eq(links.userId, user.id)));

    revalidateTag(CACHE_TAGS.allLinks);
    revalidateTag(CACHE_TAGS.allCategories);

    return { success: true, message: 'Link deleted successfully' };
  } catch (error) {
    console.error('Error deleting link:', error);
    return {
      success: false,
      message: 'An error occurred while deleting the link',
      error: 'Failed to delete link',
    };
  }
}
