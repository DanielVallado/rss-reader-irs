-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rss_id` int NOT NULL,
	`title` varchar(500) NOT NULL,
	`link` text NOT NULL,
	`published_at` timestamp,
	`description` text,
	`image_url` text,
	`author` varchar(255),
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `link_UNIQUE` UNIQUE(`link`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `name_UNIQUE` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `categories_articles` (
	`category_id` int NOT NULL,
	`article_id` int NOT NULL,
	CONSTRAINT `categories_articles_category_id_article_id` PRIMARY KEY(`category_id`,`article_id`)
);
--> statement-breakpoint
CREATE TABLE `keys` (
	`id` binary(16) NOT NULL,
	`user_id` binary(16) NOT NULL,
	`provider` varchar(50) NOT NULL,
	`provider_id` varchar(255) NOT NULL,
	`password` varchar(255),
	CONSTRAINT `keys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rss` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` text NOT NULL,
	`created_at` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `rss_id` PRIMARY KEY(`id`),
	CONSTRAINT `url_UNIQUE` UNIQUE(`url`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` binary(16) NOT NULL,
	`user_id` binary(16) NOT NULL,
	`ip_address` varchar(45) NOT NULL,
	`device_info` varchar(255) NOT NULL,
	`user_agent` text NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`expires_at` timestamp,
	`revoked_at` timestamp,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` binary(16) NOT NULL,
	`username` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
	`image_url` text,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users_rss` (
	`user_id` binary(16) NOT NULL,
	`rss_id` int NOT NULL,
	CONSTRAINT `users_rss_user_id_rss_id` PRIMARY KEY(`user_id`,`rss_id`)
);
--> statement-breakpoint
ALTER TABLE `articles` ADD CONSTRAINT `fk_rss_article_user_rss_feed1` FOREIGN KEY (`rss_id`) REFERENCES `rss`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories_articles` ADD CONSTRAINT `fk_category_has_article_article1` FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories_articles` ADD CONSTRAINT `fk_category_has_article_category1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `keys` ADD CONSTRAINT `fk_keys_users1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `fk_sessions_users` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_rss` ADD CONSTRAINT `fk_user_has_rss_rss1` FOREIGN KEY (`rss_id`) REFERENCES `rss`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users_rss` ADD CONSTRAINT `fk_user_has_rss_user1` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `fk_rss_article_user_rss_feed1_idx` ON `articles` (`rss_id`);--> statement-breakpoint
CREATE INDEX `fk_category_has_article_article1_idx` ON `categories_articles` (`article_id`);--> statement-breakpoint
CREATE INDEX `fk_category_has_article_category1_idx` ON `categories_articles` (`category_id`);--> statement-breakpoint
CREATE INDEX `fk_keys_users1_idx` ON `keys` (`user_id`);--> statement-breakpoint
CREATE INDEX `fk_sessions_users_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `fk_user_has_rss_rss1_idx` ON `users_rss` (`rss_id`);--> statement-breakpoint
CREATE INDEX `fk_user_has_rss_user1_idx` ON `users_rss` (`user_id`);
*/