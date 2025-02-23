import { mysqlTable, binary, varchar, index } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { users } from './index';

// Table definition
export const keys = mysqlTable('keys', {
	id: binary('id', { length: 16 }).primaryKey(),
	userId: binary('user_id', { length: 16 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
	provider: varchar('provider', { length: 50 }).notNull(),
	providerId: varchar('provider_id', { length: 255 }).notNull(),
	password: varchar('password', { length: 255 })
},
(table) => [
	index('fk_keys_users1_idx').on(table.userId),
]);

// Relations
export const keysRelations = relations(keys, ({ one }) => ({
	user: one(users, {
		fields: [keys.userId],
		references: [users.id]
	})
}));

export type Keys = typeof keys.$inferSelect;
