import { mysqlTable, int, timestamp, binary } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { users, articles } from './index';

// Table definition
export const interactions = mysqlTable('interactions', {
    id: int('id').primaryKey().autoincrement(),
    usersId: binary('users_id', { length: 16 }).notNull().references(() => users.id),
    articlesId: int('articles_id').notNull().references(() => articles.id),
    clickedAt: timestamp('clicked_at', { mode: 'string' }).notNull().defaultNow(),
});

// Relations
export const interactionsRelations = relations(interactions, ({ one }) => ({
    user: one(users, {
        fields: [interactions.usersId],
        references: [users.id]
    }),
    article: one(articles, {
        fields: [interactions.articlesId],
        references: [articles.id]
    })
}));

export type Interactions = typeof interactions.$inferSelect; 