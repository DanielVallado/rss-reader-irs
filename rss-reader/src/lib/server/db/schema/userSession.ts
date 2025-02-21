import { mysqlTable, varchar } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { user } from './index';

// Table definition
export const userSession = mysqlTable('user_session', {
	id: varchar('id', { length: 127 }).primaryKey(),
	userId: varchar('user_id', { length: 15 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
	activeExpires: varchar('active_expires', { length: 255 }).notNull(),
	idleExpires: varchar('idle_expires', { length: 255 }).notNull()
});

// Relations
export const userSessionRelations = relations(userSession, ({ one }) => ({
    user: one(user, {
        fields: [userSession.userId],
        references: [user.id]
    })
}));

export type UserSession = typeof userSession.$inferSelect;
