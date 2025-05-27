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
        # Ya no se crea la tabla recommendations

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
            pd.DataFrame: Columnas: users_id, articles_id, interaction (siempre 1 por visita)
        """
        query = """
        SELECT 
            HEX(users_id) as user_id,
            articles_id as article_id,
            1 as interaction
        FROM interactions
        """
        return pd.read_sql(query, self.engine)

    def get_user_visited_articles(self, user_id: str) -> list:
        """
        Devuelve una lista de IDs de artículos que el usuario ha visitado según la tabla 'interactions'.
        Args:
            user_id (str): ID del usuario (UUID string).
        Returns:
            list: IDs de artículos visitados por el usuario.
        """
        query = '''
        SELECT articles_id FROM interactions WHERE users_id = :user_id
        '''
        user_id_bytes = uuid.UUID(user_id).bytes
        result = self.session.execute(text(query), {'user_id': user_id_bytes})
        return [row.articles_id for row in result]

    def close(self):
        """Cierra la conexión a la base de datos"""
        self.session.close() 