-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema rss-reader
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema rss-reader
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `rss-reader` DEFAULT CHARACTER SET utf8 ;
USE `rss-reader` ;

-- -----------------------------------------------------
-- Table `rss-reader`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`users` (
  `id` BINARY(16) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image_url` TEXT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`sessions` (
  `id` BINARY(16) NOT NULL,
  `user_id` BINARY(16) NOT NULL,
  `ip_address` VARCHAR(45) NOT NULL,
  `device_info` VARCHAR(255) NOT NULL,
  `user_agent` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` TIMESTAMP NULL,
  `revoked_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_sessions_users_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_sessions_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `rss-reader`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`keys`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`keys` (
  `id` BINARY(16) NOT NULL,
  `user_id` BINARY(16) NOT NULL,
  `provider` VARCHAR(50) NOT NULL,
  `provider_id` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_keys_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_keys_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rss-reader`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`rss`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`rss` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `url` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `url_UNIQUE` (`url`(255) ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`articles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`articles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rss_id` INT NOT NULL,
  `title` VARCHAR(500) CHARACTER SET 'utf8mb4' NOT NULL,
  `link` TEXT NOT NULL,
  `published_at` TIMESTAMP NULL,
  `description` TEXT CHARACTER SET 'utf8mb4' NULL,
  `image_url` TEXT NULL,
  `author` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_rss_article_user_rss_feed1_idx` (`rss_id` ASC) VISIBLE,
  UNIQUE INDEX `link_UNIQUE` (`link`(255) ASC) VISIBLE,
  CONSTRAINT `fk_rss_article_user_rss_feed1`
    FOREIGN KEY (`rss_id`)
    REFERENCES `rss-reader`.`rss` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`categories`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`categories` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`users_rss`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`users_rss` (
  `user_id` BINARY(16) NOT NULL,
  `rss_id` INT NOT NULL,
  PRIMARY KEY (`user_id`, `rss_id`),
  INDEX `fk_user_has_rss_rss1_idx` (`rss_id` ASC) VISIBLE,
  INDEX `fk_user_has_rss_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_has_rss_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rss-reader`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_has_rss_rss1`
    FOREIGN KEY (`rss_id`)
    REFERENCES `rss-reader`.`rss` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`categories_articles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`categories_articles` (
  `category_id` INT NOT NULL,
  `article_id` INT NOT NULL,
  PRIMARY KEY (`category_id`, `article_id`),
  INDEX `fk_category_has_article_article1_idx` (`article_id` ASC) VISIBLE,
  INDEX `fk_category_has_article_category1_idx` (`category_id` ASC) VISIBLE,
  CONSTRAINT `fk_category_has_article_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `rss-reader`.`categories` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_has_article_article1`
    FOREIGN KEY (`article_id`)
    REFERENCES `rss-reader`.`articles` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`interactions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`interactions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `users_id` BINARY(16) NOT NULL,
  `articles_id` INT NOT NULL,
  `clicked_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`, `users_id`, `articles_id`),
  INDEX `fk_users_has_articles_articles1_idx` (`articles_id` ASC) VISIBLE,
  INDEX `fk_users_has_articles_users1_idx` (`users_id` ASC) VISIBLE,
  CONSTRAINT `fk_users_has_articles_users1`
    FOREIGN KEY (`users_id`)
    REFERENCES `rss-reader`.`users` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_users_has_articles_articles1`
    FOREIGN KEY (`articles_id`)
    REFERENCES `rss-reader`.`articles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
