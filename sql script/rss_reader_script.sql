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
-- Table `rss-reader`.`auth_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`auth_user` (
  `id` VARCHAR(15) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`user_session`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`user_session` (
  `id` VARCHAR(127) NOT NULL,
  `user_id` VARCHAR(15) NOT NULL,
  `active_expires` BIGINT NOT NULL,
  `idle_expires` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_sessions_users_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_sessions_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `rss-reader`.`auth_user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`user_key`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`user_key` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` VARCHAR(15) NOT NULL,
  `provider_id` VARCHAR(50) NOT NULL,
  `provider_user_id` VARCHAR(255) NOT NULL,
  `hashed_password` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_keys_users1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_keys_users1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rss-reader`.`auth_user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`user_rss_feed`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`user_rss_feed` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(15) NOT NULL,
  `url` TEXT NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_user_rss_feed_auth_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_rss_feed_auth_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `rss-reader`.`auth_user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`rss_article`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`rss_article` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `rss_id` INT NOT NULL,
  `title` VARCHAR(500) NOT NULL,
  `link` TEXT NOT NULL,
  `published_at` TIMESTAMP NULL,
  `description` TEXT NULL,
  `image_url` VARCHAR(255) NULL,
  `author` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_rss_article_user_rss_feed1_idx` (`rss_id` ASC) VISIBLE,
  CONSTRAINT `fk_rss_article_user_rss_feed1`
    FOREIGN KEY (`rss_id`)
    REFERENCES `rss-reader`.`user_rss_feed` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `rss-reader`.`article_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`article_category` (
  `category_id` INT NOT NULL,
  `rss_article_id` INT NOT NULL,
  PRIMARY KEY (`category_id`, `rss_article_id`),
  INDEX `fk_category_has_rss_article_rss_article1_idx` (`rss_article_id` ASC) VISIBLE,
  INDEX `fk_category_has_rss_article_category1_idx` (`category_id` ASC) VISIBLE,
  CONSTRAINT `fk_article_category_category_idx`
    FOREIGN KEY (`category_id`)
    REFERENCES `rss-reader`.`category` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_article_category_rss_article_idx`
    FOREIGN KEY (`rss_article_id`)
    REFERENCES `rss-reader`.`rss_article` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
