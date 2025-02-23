import { mysqlTable, binary, int, index, primaryKey } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { users, rss } from './index';

// Table definition
export const usersRss = mysqlTable('user_rss', {
    userId: binary('id', { length: 16 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
    rssId: int('rss_id').notNull().references(() => rss.id, { onDelete: 'cascade' }),
},
(table) => [
	index('fk_user_has_rss_rss1_idx').on(table.rssId),
	index('fk_user_has_rss_user1_idx').on(table.userId),
	primaryKey({ columns: [table.userId, table.rssId], name: 'users_rss_user_id_rss_id'}),
]);

// Relations
export const usersRssRelations = relations(usersRss, ({ one }) => ({
	rss: one(rss, {
		fields: [usersRss.rssId],
		references: [rss.id]
	}),
	user: one(users, {
		fields: [usersRss.userId],
		references: [users.id]
	})
}));

export type UsersRss = typeof usersRss.$inferSelect;