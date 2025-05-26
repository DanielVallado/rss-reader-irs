# hybrid_recommendation.py

import numpy as np

class HybridRecommender:
    def __init__(self, content_engine, collaborative_engine, alpha=0.5):
        """
        content_engine: instancia de ContentRecommendation (basado en contenido)
        collaborative_engine: instancia de CollaborativeRecommender (colaborativo)
        alpha: peso de la recomendación colaborativa [0,1]
        """
        self.content_engine = content_engine
        self.collaborative_engine = collaborative_engine
        self.alpha = alpha  # 0 = solo contenido, 1 = solo colaborativo

    def recommend(self, user_id, article_ids, user_features=None, top_n=5, top_k=5):
        """
        Genera recomendaciones híbridas para un usuario.
        - user_id: ID del usuario
        - article_ids: lista de IDs de artículos disponibles
        - user_features: matriz de features de artículos (opcional, para contenido)
        - top_n: número de recomendaciones finales
        - top_k: número de vecinos similares a considerar en colaborativo
        """
        # Recomendaciones colaborativas (scores)
        collab_scores = np.zeros(len(article_ids))
        if user_id in self.collaborative_engine.user_map:
            if self.collaborative_engine.user_similarity is None:
                self.collaborative_engine.compute_similarity()
            user_idx = self.collaborative_engine.user_map[user_id]
            sim_scores = self.collaborative_engine.user_similarity[user_idx].copy()
            sim_scores[user_idx] = 0
            similar_users = np.argsort(sim_scores)[::-1][:top_k]
            similar_users_matrix = self.collaborative_engine.interaction_matrix[similar_users]
            collab_scores = np.asarray(similar_users_matrix.sum(axis=0)).flatten()
            # Eliminar artículos ya vistos
            seen = self.collaborative_engine.interaction_matrix[user_idx].toarray().flatten()
            collab_scores = collab_scores * (1 - seen)

        # Recomendaciones de contenido (scores)
        content_scores = np.zeros(len(article_ids))
        if user_features is not None:
            content_scores = self.content_engine.predict_scores(user_features)

        # Normalización simple
        if collab_scores.max() > 0:
            collab_scores = collab_scores / collab_scores.max()
        if content_scores.max() > 0:
            content_scores = content_scores / content_scores.max()

        # Combinación lineal
        hybrid_scores = self.alpha * collab_scores + (1 - self.alpha) * content_scores

        # Selección de los mejores
        top_indices = hybrid_scores.argsort()[::-1][:top_n]
        return [article_ids[i] for i in top_indices]
