import { relations } from 'drizzle-orm';
import { mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core';

import { userKey, userSession } from './index';

// Table definition
export const user = mysqlTable('auth_user', {
	id: varchar('id', { length: 15 }).primaryKey(),
	username: varchar('username', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// !Relations
export const userRelations = relations(user, ({many}) => ({
	keys: many(userKey),
	sessions: many(userSession),
}));

export type User = typeof user.$inferSelect;
