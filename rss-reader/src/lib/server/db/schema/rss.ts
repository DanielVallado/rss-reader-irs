import { mysqlTable, int, timestamp, text, unique } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { articles, usersRss } from './index';

// Table definition
export const rss = mysqlTable('rss', {
	id: int('id').primaryKey().autoincrement(),
	url: text('url').notNull(),
	createdAt: timestamp('created_at', { mode: 'string' }).defaultNow()
},
(table) => [
	unique('url_UNIQUE').on(table.url),
]);

// Relations
export const rssRelations = relations(rss, ({ many }) => ({
	usersRsses: many(usersRss),
	articles: many(articles)
}));

export type Rss = typeof rss.$inferSelect;