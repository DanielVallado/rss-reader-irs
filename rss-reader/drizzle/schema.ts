import { mysqlTable, index, primaryKey, unique, int, varchar, text, timestamp, binary } from "drizzle-orm/mysql-core"


export const articles = mysqlTable("articles", {
	id: int().autoincrement().notNull(),
	rssId: int("rss_id").notNull().references(() => rss.id, { onDelete: "cascade" } ),
	title: varchar({ length: 500 }).notNull(),
	link: text().notNull(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	description: text(),
	imageUrl: text("image_url"),
	author: varchar({ length: 255 }),
},
(table) => [
	index("fk_rss_article_user_rss_feed1_idx").on(table.rssId),
	primaryKey({ columns: [table.id], name: "articles_id"}),
	unique("link_UNIQUE").on(table.link),
]);

export const categories = mysqlTable("categories", {
	id: int().autoincrement().notNull(),
	name: varchar({ length: 255 }).notNull(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "categories_id"}),
	unique("name_UNIQUE").on(table.name),
]);

export const categoriesArticles = mysqlTable("categories_articles", {
	categoryId: int("category_id").notNull().references(() => categories.id, { onDelete: "cascade" } ),
	articleId: int("article_id").notNull().references(() => articles.id, { onDelete: "cascade" } ),
},
(table) => [
	index("fk_category_has_article_article1_idx").on(table.articleId),
	index("fk_category_has_article_category1_idx").on(table.categoryId),
	primaryKey({ columns: [table.categoryId, table.articleId], name: "categories_articles_category_id_article_id"}),
]);

export const keys = mysqlTable("keys", {
	id: binary({ length: 16 }).notNull(),
	userId: binary("user_id", { length: 16 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	provider: varchar({ length: 50 }).notNull(),
	providerId: varchar("provider_id", { length: 255 }).notNull(),
	password: varchar({ length: 255 }),
},
(table) => [
	index("fk_keys_users1_idx").on(table.userId),
	primaryKey({ columns: [table.id], name: "keys_id"}),
]);

export const rss = mysqlTable("rss", {
	id: int().autoincrement().notNull(),
	url: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
},
(table) => [
	primaryKey({ columns: [table.id], name: "rss_id"}),
	unique("url_UNIQUE").on(table.url),
]);

export const sessions = mysqlTable("sessions", {
	id: binary({ length: 16 }).notNull(),
	userId: binary("user_id", { length: 16 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	ipAddress: varchar("ip_address", { length: 45 }).notNull(),
	deviceInfo: varchar("device_info", { length: 255 }).notNull(),
	userAgent: text("user_agent").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	revokedAt: timestamp("revoked_at", { mode: 'string' }),
},
(table) => [
	index("fk_sessions_users_idx").on(table.userId),
	primaryKey({ columns: [table.id], name: "sessions_id"}),
]);

export const users = mysqlTable("users", {
	id: binary({ length: 16 }).notNull(),
	username: varchar({ length: 255 }).notNull(),
	email: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	imageUrl: text("image_url"),
},
(table) => [
	primaryKey({ columns: [table.id], name: "users_id"}),
]);

export const usersRss = mysqlTable("users_rss", {
	userId: binary("user_id", { length: 16 }).notNull().references(() => users.id, { onDelete: "cascade" } ),
	rssId: int("rss_id").notNull().references(() => rss.id, { onDelete: "cascade" } ),
},
(table) => [
	index("fk_user_has_rss_rss1_idx").on(table.rssId),
	index("fk_user_has_rss_user1_idx").on(table.userId),
	primaryKey({ columns: [table.userId, table.rssId], name: "users_rss_user_id_rss_id"}),
]);
