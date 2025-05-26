# recommender_service.py

from content_recommendation import ContentRecommendation
from collaborative_recommendation import CollaborativeRecommender
from hybrid_recommendation import HybridRecommender
from models.database import DatabaseManager

import pandas as pd
import numpy as np

class RecommenderService:
    """
    Servicio orquestador de los motores de recomendación y acceso a datos.
    """
    def __init__(self):
        """
        Inicializa los motores de recomendación y carga datos de la base de datos.
        Lanza excepción si la base de datos está vacía o hay error de conexión.
        """
        self.db = DatabaseManager()
        articles_df = self.db.get_articles_dataframe()
        interactions_df = self.db.get_user_interactions_dataframe()
        if articles_df.empty:
            raise RuntimeError("No hay artículos en la base de datos.")
        # Motor basado en contenido
        self.content_engine = ContentRecommendation()
        self.articles_df, self.tfidf_matrix = self.content_engine.preprocess_articles(articles_df)
        self.reduced_features = self.content_engine.reduce_dimensions(self.tfidf_matrix)
        # Motor colaborativo
        self.collaborative_engine = CollaborativeRecommender(interactions_df)
        self.collaborative_engine.build_matrix()
        self.collaborative_engine.compute_similarity()
        # Motor híbrido
        self.hybrid_engine = HybridRecommender(
            content_engine=self.content_engine,
            collaborative_engine=self.collaborative_engine,
            alpha=0.5
        )

    def recommend_content_based(self, top_n: int = 5, user_id: str = None) -> list:
        """
        Recomendaciones para usuario nuevo (cold start), basado solo en contenido.
        Args:
            top_n (int): Número de recomendaciones.
            user_id (str, opcional): Si se provee, guarda recomendaciones en la base de datos.
        Returns:
            list: IDs de artículos recomendados.
        """
        indices = self.content_engine.recommend_for_new_user(self.tfidf_matrix, top_n=top_n)
        recommended_ids = self.articles_df.iloc[indices]['id'].tolist()
        if user_id is not None:
            self.db.save_recommendations(user_id, recommended_ids, 'content')
        return recommended_ids

    def recommend_collaborative(self, user_id: str, top_k: int = 5, top_n: int = 5) -> list:
        """
        Recomendaciones basadas en usuarios similares.
        Args:
            user_id (str): ID del usuario.
            top_k (int): Número de vecinos similares.
            top_n (int): Número de recomendaciones.
        Returns:
            list: IDs de artículos recomendados.
        Raises:
            ValueError: Si user_id no es válido.
        """
        if not user_id:
            raise ValueError("user_id es obligatorio para recomendaciones colaborativas.")
        recommended_ids = self.collaborative_engine.recommend_for_user(user_id, top_k=top_k, top_n=top_n)
        if recommended_ids:
            self.db.save_recommendations(user_id, recommended_ids, 'collaborative')
        return recommended_ids

    def recommend_hybrid(self, user_id: str, top_n: int = 5, top_k: int = 5) -> list:
        """
        Recomendaciones híbridas combinando contenido y colaborativo.
        Args:
            user_id (str): ID del usuario.
            top_n (int): Número de recomendaciones.
            top_k (int): Número de vecinos similares.
        Returns:
            list: IDs de artículos recomendados.
        Raises:
            ValueError: Si user_id no es válido.
        """
        if not user_id:
            raise ValueError("user_id es obligatorio para recomendaciones híbridas.")
        article_ids = self.articles_df['id'].tolist()
        user_features = self.reduced_features
        recommended_ids = self.hybrid_engine.recommend(
            user_id=user_id,
            article_ids=article_ids,
            user_features=user_features,
            top_n=top_n,
            top_k=top_k
        )
        if recommended_ids:
            self.db.save_recommendations(user_id, recommended_ids, 'hybrid')
        return recommended_ids

    def __del__(self):
        """Asegura que se cierre la conexión a la base de datos"""
        if hasattr(self, 'db'):
            self.db.close()
