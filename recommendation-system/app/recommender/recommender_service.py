# recommender_service.py

from content_recommendation import ContentRecommendation
from collaborative_recommendation import CollaborativeRecommender
from hybrid_recommendation import HybridRecommender

import pandas as pd
import numpy as np

class RecommenderService:
    def __init__(self, articles_df, interactions_df):
        """
        Inicializa los motores de recomendación y prepara datos.

        :param articles_df: pd.DataFrame con columnas ['id', 'descripcion', ...]
        :param interactions_df: pd.DataFrame con columnas ['user_id', 'article_id', 'interaction']
        """
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
            alpha=0.5  # Puedes ajustar este parámetro dinámicamente
        )

    def recommend_content_based(self, top_n=5):
        """
        Recomendaciones para usuario nuevo (cold start), basado solo en contenido.
        """
        indices = self.content_engine.recommend_for_new_user(self.tfidf_matrix, top_n=top_n)
        return self.articles_df.iloc[indices]['id'].tolist()

    def recommend_collaborative(self, user_id, top_k=5, top_n=5):
        """
        Recomendaciones basadas en usuarios similares.
        """
        return self.collaborative_engine.recommend_for_user(user_id, top_k=top_k, top_n=top_n)

    def recommend_hybrid(self, user_id, top_n=5, top_k=5):
        """
        Recomendaciones híbridas combinando contenido y colaborativo.
        """
        # Obtener features de los artículos para predecir con contenido
        article_ids = self.articles_df['id'].tolist()
        # Aquí usamos la matriz reducida de características para los artículos
        user_features = self.reduced_features

        return self.hybrid_engine.recommend(
            user_id=user_id,
            article_ids=article_ids,
            user_features=user_features,
            top_n=top_n,
            top_k=top_k
        )
