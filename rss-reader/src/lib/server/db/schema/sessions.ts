import { mysqlTable, binary, varchar, text, timestamp } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { users } from './index';

// Table definition
export const sessions = mysqlTable('sessions', {
	id: binary('id', { length: 16 }).primaryKey(),
	userId: binary('user_id', { length: 16 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
	ipAddress: varchar('ip_address', { length: 45 }).notNull(),
    deviceInfo: varchar('device_info', { length: 255 }).notNull(),
    userAgent: text('user_agent').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    expiresAt: timestamp('expires_at'),
    revokedAt: timestamp('revoked_at'),
});

// Relations
export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id]
    })
}));

export type Sessions = typeof sessions.$inferSelect;
