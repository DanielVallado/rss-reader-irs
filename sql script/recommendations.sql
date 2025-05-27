-- -----------------------------------------------------
-- Table `rss-reader`.`recommendations`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `rss-reader`.`recommendations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` BINARY(16) NOT NULL,
  `article_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_recommendations_users_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_recommendations_articles_idx` (`article_id` ASC) VISIBLE,
  CONSTRAINT `fk_recommendations_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `rss-reader`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_recommendations_articles`
    FOREIGN KEY (`article_id`)
    REFERENCES `rss-reader`.`articles` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB; 