import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { user } from './index';

// Table definition
export const userKey = mysqlTable('user_key', {
	id: varchar('id', { length: 255 }).primaryKey(),
	userId: varchar('user_id', { length: 15 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
	providerId: varchar('provider_id', { length: 50 }).notNull(),
	providerUserId: varchar('provider_user_id', { length: 255 }).notNull(),
	hashedPassword: varchar('hashed_password', { length: 255 })
});

// Relations
export const userKeyRelations = relations(userKey, ({ one }) => ({
	user: one(user, {
		fields: [userKey.userId],
		references: [user.id]
	})
}));

export type UserKey = typeof userKey.$inferSelect;
