import { mysqlTable, int, varchar, unique } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { categoriesArticles } from './index';

// Table definition
export const categories = mysqlTable('categories', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar({ length: 255 }).notNull(),
},
(table) => [
	unique('name_UNIQUE').on(table.name),
]);

// Relations
export const categoriesRelations = relations(categories, ({ many }) => ({
	categoriesArticles: many(categoriesArticles)
}));

export type Categories = typeof categories.$inferSelect;