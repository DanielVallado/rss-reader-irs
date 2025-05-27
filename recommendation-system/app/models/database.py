from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import pandas as pd
import os
from dotenv import load_dotenv
import uuid

load_dotenv()

class DatabaseManager:
    """
    Gestor de acceso a la base de datos para artículos, interacciones y recomendaciones.
    """
    def __init__(self):
        """
        Inicializa la conexión a la base de datos usando variables de entorno.
        """
        db_user = os.getenv('DB_USER', 'root')
        db_password = os.getenv('DB_PASSWORD', '')
        db_host = os.getenv('DB_HOST', 'localhost')
        db_name = os.getenv('DB_NAME', 'rss-reader')
        self.engine = create_engine(
            f'mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}'
        )
        Session = sessionmaker(bind=self.engine)
        self.session = Session()
        self._ensure_recommendations_table()

    def _ensure_recommendations_table(self):
        """
        Crea la tabla recommendations si no existe (IDs como INT).
        """
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
        with self.engine.connect() as conn:
            conn.execute(text(create_recommendations_table))
            conn.commit()

    def get_articles_dataframe(self) -> pd.DataFrame:
        """
        Obtiene los artículos y sus categorías de la base de datos.
        Returns:
            pd.DataFrame: Columnas: id, rss_id, title, description, link, published_at, image_url, author, categories
        """
        query = """
        SELECT 
            a.id,
            a.rss_id,
            a.title,
            a.description,
            a.link,
            a.published_at,
            a.image_url,
            a.author,
            GROUP_CONCAT(c.name) as categories
        FROM articles a
        LEFT JOIN categories_articles ca ON a.id = ca.article_id
        LEFT JOIN categories c ON ca.category_id = c.id
        GROUP BY a.id
        """
        return pd.read_sql(query, self.engine)

    def get_user_interactions_dataframe(self) -> pd.DataFrame:
        """
        Obtiene las interacciones de usuarios con artículos desde la tabla 'interactions'.
        Returns:
            pd.DataFrame: Columnas: user_id, article_id, interaction (siempre 1 por visita)
        """
        query = """
        SELECT 
            HEX(user_id) as user_id,
            article_id,
            1 as interaction
        FROM interactions
        """
        return pd.read_sql(query, self.engine)

    def save_recommendations(self, user_id: str, article_ids: list):
        """
        Guarda las recomendaciones generadas en la base de datos (user_id como UUID string).
        Args:
            user_id (str): ID del usuario (UUID string).
            article_ids (list): Lista de IDs de artículos recomendados.
        Raises:
            Exception: Si ocurre un error al guardar.
        """
        query = """
        INSERT INTO recommendations 
        (user_id, article_id, created_at) 
        VALUES (:user_id, :article_id, NOW())
        """
        try:
            user_id_bytes = uuid.UUID(user_id).bytes
            for article_id in article_ids:
                self.session.execute(text(query), {
                    'user_id': user_id_bytes,
                    'article_id': article_id
                })
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            raise Exception(f"Error al guardar recomendaciones: {str(e)}")

    def get_user_visited_articles(self, user_id: str) -> list:
        """
        Devuelve una lista de IDs de artículos que el usuario ha visitado según la tabla 'interactions'.
        Args:
            user_id (str): ID del usuario (UUID string).
        Returns:
            list: IDs de artículos visitados por el usuario.
        """
        query = '''
        SELECT article_id FROM interactions WHERE user_id = :user_id
        '''
        user_id_bytes = uuid.UUID(user_id).bytes
        result = self.session.execute(text(query), {'user_id': user_id_bytes})
        return [row.article_id for row in result]

    def close(self):
        """Cierra la conexión a la base de datos"""
        self.session.close() 