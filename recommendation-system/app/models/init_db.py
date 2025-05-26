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
    
    # SQL para crear la tabla de recomendaciones
    create_recommendations_table = """
    CREATE TABLE IF NOT EXISTS `recommendations` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `user_id` BINARY(16) NOT NULL,
        `article_id` INT NOT NULL,
        `source` ENUM('content', 'collaborative', 'hybrid') NOT NULL,
        `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        INDEX `fk_recommendations_users_idx` (`user_id` ASC) VISIBLE,
        INDEX `fk_recommendations_articles_idx` (`article_id` ASC) VISIBLE,
        CONSTRAINT `fk_recommendations_users`
            FOREIGN KEY (`user_id`)
            REFERENCES `users` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION,
        CONSTRAINT `fk_recommendations_articles`
            FOREIGN KEY (`article_id`)
            REFERENCES `articles` (`id`)
            ON DELETE CASCADE
            ON UPDATE NO ACTION
    ) ENGINE = InnoDB;
    """
    
    try:
        with engine.connect() as conn:
            conn.execute(text(create_recommendations_table))
            conn.commit()
            print("Tabla de recomendaciones creada/verificada exitosamente")
    except Exception as e:
        print(f"Error al crear la tabla de recomendaciones: {str(e)}")

if __name__ == "__main__":
    init_db() 