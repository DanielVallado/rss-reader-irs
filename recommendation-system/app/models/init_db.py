from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

def init_db():
    """Inicializa la base de datos creando las tablas necesarias si no existen"""
    load_dotenv()
    
    # Configuración de la base de datos
    db_user = os.getenv('DB_USER', 'root')
    db_password = os.getenv('DB_PASSWORD', '')
    db_host = os.getenv('DB_HOST', 'localhost')
    db_name = os.getenv('DB_NAME', 'rss-reader')
    
    # Crear conexión
    engine = create_engine(
        f'mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}'
    )
    
    # SQL para crear la tabla de recomendaciones (IDs como INT)
    create_recommendations_table = """
    CREATE TABLE IF NOT EXISTS `recommendations` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `user_id` INT NOT NULL,
        `article_id` INT NOT NULL,
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        INDEX `fk_recommendations_users_idx` (`user_id` ASC) VISIBLE,
        INDEX `fk_recommendations_articles_idx` (`article_id` ASC) VISIBLE
    ) ENGINE = InnoDB;
    """

    # SQL para crear la tabla de interacciones (IDs como INT)
    create_interactions_table = """
    CREATE TABLE IF NOT EXISTS `interactions` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `user_id` INT NOT NULL,
        `article_id` INT NOT NULL,
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        INDEX `fk_interactions_users_idx` (`user_id` ASC) VISIBLE,
        INDEX `fk_interactions_articles_idx` (`article_id` ASC) VISIBLE,
        CONSTRAINT `fk_interactions_users`
            FOREIGN KEY (`user_id`)
            REFERENCES `users` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION,
        CONSTRAINT `fk_interactions_articles`
            FOREIGN KEY (`article_id`)
            REFERENCES `articles` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
    ) ENGINE = InnoDB;
    """
    
    try:
        with engine.connect() as conn:
            conn.execute(text(create_recommendations_table))
            conn.execute(text(create_interactions_table))
            conn.commit()
            print("Tablas de recomendaciones e interacciones creadas/verificadas exitosamente")
    except Exception as e:
        print(f"Error al crear las tablas: {str(e)}")

if __name__ == "__main__":
    init_db() 