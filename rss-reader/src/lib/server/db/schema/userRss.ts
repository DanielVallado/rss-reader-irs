import { mysqlTable, primaryKey, varchar, int } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';

import { user, rss } from './index';

// Table definition
export const userRss = mysqlTable('user_rss', {
    userId: varchar('user_id', { length: 15 }).notNull().references(() => user.id, { onDelete: 'cascade' }),
    rssId: int('rss_id').notNull().references(() => rss.id, { onDelete: 'cascade' }),
}, (table) => [
    primaryKey({ columns: [table.userId, table.rssId] }),
]);

// Relations
export const userRssRelations = relations(userRss, ({ one }) => ({
    user: one(user, {
        fields: [userRss.userId],
        references: [user.id],
    }),
    rss: one(rss, {
        fields: [userRss.rssId],
        references: [rss.id],
    })
}));

export type UserRss = typeof userRss.$inferSelect;