import { mysqlTable, serial, timestamp, text } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { rssArticle } from './index';

// Table definition
export const rss = mysqlTable('rss', {
    id: serial('id').primaryKey(),
    url: text('url').notNull(),
    created_at: timestamp('created_at').defaultNow()
});

// !Relations
export const rssRelations = relations(rss, ({  many }) => ({
	
	articles: many(rssArticle)
}));

export type Rss = typeof rss.$inferSelect;