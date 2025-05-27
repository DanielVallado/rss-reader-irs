# recommender_service.py

from .content_recommendation import ContentRecommendation
from .collaborative_recommendation import CollaborativeRecommender
from .hybrid_recommendation import HybridRecommender
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

    def recommend_content_based(self, user_id: str, top_n: int = 5) -> list:
        """
        Recomendaciones personalizadas basadas en contenido para un usuario según sus artículos visitados.
        Args:
            user_id (str): ID del usuario (UUID string).
            top_n (int): Número de recomendaciones.
        Returns:
            list: IDs de artículos recomendados.
        """
        visited_article_ids = self.db.get_user_visited_articles(user_id)
        if not visited_article_ids:
            return []  # O podrías hacer un fallback a cold start si lo deseas
        id_to_index = {id_: idx for idx, id_ in enumerate(self.articles_df['id'])}
        user_article_indices = [id_to_index[aid] for aid in visited_article_ids if aid in id_to_index]
        indices = self.content_engine.recommend_for_user(user_article_indices, self.tfidf_matrix, top_n=top_n)
        recommended_ids = self.articles_df.iloc[[idx for idx, _ in indices]]['id'].tolist() if indices else []
        self.db.save_recommendations(user_id, recommended_ids)
        return recommended_ids

    def recommend_collaborative(self, user_id: str, top_k: int = 5, top_n: int = 5) -> list:
        """
        Recomendaciones basadas en usuarios similares.
        Args:
            user_id (str): ID del usuario (UUID string).
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
            self.db.save_recommendations(user_id, recommended_ids)
        return recommended_ids

    def recommend_hybrid(self, user_id: str, top_n: int = 5, top_k: int = 5) -> list:
        """
        Recomendaciones híbridas combinando contenido y colaborativo.
        Args:
            user_id (str): ID del usuario (UUID string).
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
            self.db.save_recommendations(user_id, recommended_ids)
        return recommended_ids

    def __del__(self):
        """Asegura que se cierre la conexión a la base de datos"""
        if hasattr(self, 'db'):
            self.db.close()
