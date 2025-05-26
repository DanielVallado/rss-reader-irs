# hybrid_recommendation.py

import numpy as np

class HybridRecommender:
    """
    Motor híbrido que combina recomendaciones de contenido y colaborativas.
    """
    def __init__(self, content_engine, collaborative_engine, alpha: float = 0.5):
        """
        Inicializa el motor híbrido.
        Args:
            content_engine: Instancia de ContentRecommendation.
            collaborative_engine: Instancia de CollaborativeRecommender.
            alpha (float): Peso de la recomendación colaborativa [0,1].
        """
        self.content_engine = content_engine
        self.collaborative_engine = collaborative_engine
        self.alpha = alpha  # 0 = solo contenido, 1 = solo colaborativo

    def recommend(self, user_id, article_ids: list, user_features=None, top_n: int = 5, top_k: int = 5) -> list:
        """
        Genera recomendaciones híbridas para un usuario.
        Args:
            user_id: ID del usuario.
            article_ids (list): Lista de IDs de artículos disponibles.
            user_features (np.ndarray): Matriz de features de artículos (opcional, para contenido).
            top_n (int): Número de recomendaciones finales.
            top_k (int): Número de vecinos similares a considerar en colaborativo.
        Returns:
            list: IDs de artículos recomendados.
        """
        n_articles = len(article_ids)
        collab_scores = np.zeros(n_articles)
        # Score colaborativo solo si el usuario existe
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
        # Si el usuario no existe, collab_scores queda en cero

        # Score de contenido
        content_scores = np.zeros(n_articles)
        if user_features is not None:
            if len(user_features) != n_articles:
                raise ValueError("user_features y article_ids deben tener la misma longitud.")
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
