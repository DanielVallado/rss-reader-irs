import { mysqlTable, int, index, primaryKey } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { articles, categories } from './index';

// Table definition
export const categoriesArticles = mysqlTable('categories_articles', {
	categoryId: int('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' } ),
	articleId: int('article_id').notNull().references(() => articles.id, { onDelete: 'cascade' } ),
},
(table) => [
	index('fk_category_has_article_article1_idx').on(table.articleId),
	index('fk_category_has_article_category1_idx').on(table.categoryId),
	primaryKey({ columns: [table.categoryId, table.articleId], name: 'categories_articles_category_id_article_id'}),
]);

// Relations
export const categoriesArticlesRelations = relations(categoriesArticles, ({ one }) => ({
	article: one(articles, {
		fields: [categoriesArticles.articleId],
		references: [articles.id]
	}),
	category: one(categories, {
		fields: [categoriesArticles.categoryId],
		references: [categories.id]
	})
}));

export type CategoriesArticles = typeof categoriesArticles.$inferSelect;