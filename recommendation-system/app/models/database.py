from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

class DatabaseManager:
    def __init__(self):
        """Inicializa la conexión a la base de datos usando variables de entorno"""
        db_user = os.getenv('DB_USER', 'root')
        db_password = os.getenv('DB_PASSWORD', '')
        db_host = os.getenv('DB_HOST', 'localhost')
        db_name = os.getenv('DB_NAME', 'rss-reader')
        
        self.engine = create_engine(
            f'mysql+pymysql://{db_user}:{db_password}@{db_host}/{db_name}'
        )
        Session = sessionmaker(bind=self.engine)
        self.session = Session()

    def get_articles_dataframe(self) -> pd.DataFrame:
        """
        Obtiene los artículos y sus categorías de la base de datos.
        
        Returns:
            DataFrame con columnas: id, rss_id, title, description, link, 
            published_at, image_url, author, categories
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
        Obtiene las interacciones de usuarios con artículos.
        Por ahora, consideraremos las suscripciones a RSS como interacciones positivas.
        
        Returns:
            DataFrame con columnas: user_id, article_id, interaction
        """
        query = """
        SELECT 
            DISTINCT ur.user_id,
            a.id as article_id,
            1 as interaction
        FROM users_rss ur
        JOIN articles a ON ur.rss_id = a.rss_id
        """
        return pd.read_sql(query, self.engine)

    def save_recommendations(self, user_id: str, article_ids: list, source: str):
        """
        Guarda las recomendaciones generadas en la base de datos.
        
        Args:
            user_id: ID del usuario
            article_ids: Lista de IDs de artículos recomendados
            source: Fuente de la recomendación ('content', 'collaborative', 'hybrid')
        """
        # TODO: Crear tabla recommendations si no existe
        query = """
        INSERT INTO recommendations 
        (user_id, article_id, source, created_at) 
        VALUES (:user_id, :article_id, :source, NOW())
        """
        
        for article_id in article_ids:
            self.session.execute(text(query), {
                'user_id': user_id,
                'article_id': article_id,
                'source': source
            })
        
        self.session.commit()

    def close(self):
        """Cierra la conexión a la base de datos"""
        self.session.close() 