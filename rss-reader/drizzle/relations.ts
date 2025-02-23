import { relations } from "drizzle-orm/relations";
import { rss, articles, categoriesArticles, categories, users, keys, sessions, usersRss } from "./schema";

export const articlesRelations = relations(articles, ({one, many}) => ({
	rss: one(rss, {
		fields: [articles.rssId],
		references: [rss.id]
	}),
	categoriesArticles: many(categoriesArticles),
}));

export const rssRelations = relations(rss, ({many}) => ({
	articles: many(articles),
	usersRsses: many(usersRss),
}));

export const categoriesArticlesRelations = relations(categoriesArticles, ({one}) => ({
	article: one(articles, {
		fields: [categoriesArticles.articleId],
		references: [articles.id]
	}),
	category: one(categories, {
		fields: [categoriesArticles.categoryId],
		references: [categories.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	categoriesArticles: many(categoriesArticles),
}));

export const keysRelations = relations(keys, ({one}) => ({
	user: one(users, {
		fields: [keys.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	keys: many(keys),
	sessions: many(sessions),
	usersRsses: many(usersRss),
}));

export const sessionsRelations = relations(sessions, ({one}) => ({
	user: one(users, {
		fields: [sessions.userId],
		references: [users.id]
	}),
}));

export const usersRssRelations = relations(usersRss, ({one}) => ({
	rss: one(rss, {
		fields: [usersRss.rssId],
		references: [rss.id]
	}),
	user: one(users, {
		fields: [usersRss.userId],
		references: [users.id]
	}),
}));