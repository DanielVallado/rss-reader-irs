import { mysqlTable, serial, int, varchar, timestamp, text } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { rss } from './index';

// Table definition
export const rssArticle = mysqlTable('rss_article', {
    id: serial('id').primaryKey(),
    rssId: int('rss_id').notNull().references(() => rss.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 500 }).notNull(),
    link: text('link').notNull(),
    publishedAt: timestamp('published_at'),
    description: text('description'),
    image_url: text('image_url'),
    author: varchar('author', { length: 255 })
});

// !Relations
export const rssArticleRelations = relations(rssArticle, ({ one }) => ({
	user: one(rss, {
		fields: [rssArticle.rssId],
		references: [rss.id]
	})
}));

export type RssArticle = typeof rssArticle.$inferSelect;