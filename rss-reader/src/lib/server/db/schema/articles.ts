import { mysqlTable, int, varchar, timestamp, text } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { rss, categoriesArticles } from './index';

// Table definition
export const articles = mysqlTable('articles', {
    id: int('id').primaryKey().autoincrement(),
    rssId: int('rss_id').notNull().references(() => rss.id, { onDelete: 'cascade' } ),
	title: varchar({ length: 500 }).notNull(),
	link: text().notNull(),
	publishedAt: timestamp('published_at', { mode: 'string' }),
	description: text(),
	imageUrl: text('image_url'),
	author: varchar({ length: 255 }),
});

// Relations
export const articlesRelations = relations(articles, ({ one, many }) => ({
	rss: one(rss, {
		fields: [articles.rssId],
		references: [rss.id]
	}),
	categoriesArticles: many(categoriesArticles)
}));

export type Articles = typeof articles.$inferSelect;