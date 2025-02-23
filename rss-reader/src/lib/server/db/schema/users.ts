import { relations } from 'drizzle-orm';
import { binary, mysqlTable, varchar, timestamp, text } from 'drizzle-orm/mysql-core';

import { keys, sessions, usersRss } from './index';

// Table definition
export const users = mysqlTable('users', {
	id: binary('id', { length: 16 }).primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	imageUrl: text('image_url'),
});

// Relations
export const usersRelations = relations(users, ({many}) => ({
	keys: many(keys),
	sessions: many(sessions),
	userToRss: many(usersRss),
}));

export type Users = typeof users.$inferSelect;
