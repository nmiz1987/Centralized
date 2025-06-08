import { InferSelectModel, relations } from 'drizzle-orm';
import { pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core';

// Links table
export const links = pgTable('links', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  url: text('url').notNull(),
  icon: text('icon'),
  isRecommended: boolean('is_recommended').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  userId: text('user_id').notNull(),
});

// Users table
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  lastVisitedAt: timestamp('last_visited_at').defaultNow().notNull(),
});

// Relations between tables
export const linksRelations = relations(links, ({ one }) => ({
  user: one(users, {
    fields: [links.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  links: many(links),
}));

// Types
export type Link = InferSelectModel<typeof links>;
export type User = InferSelectModel<typeof users>;
