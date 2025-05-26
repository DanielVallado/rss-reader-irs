import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.metrics.pairwise import cosine_similarity

class CollaborativeRecommender:
    """
    Motor de recomendación basado en filtrado colaborativo de usuarios.
    """
    def __init__(self, interaction_df: pd.DataFrame):
        """
        Inicializa el motor colaborativo.
        Args:
            interaction_df (pd.DataFrame): Debe tener columnas 'user_id', 'article_id', 'interaction'.
        Raises:
            ValueError: Si faltan columnas requeridas.
        """
        required_cols = {'user_id', 'article_id', 'interaction'}
        if not required_cols.issubset(interaction_df.columns):
            raise ValueError(f"El DataFrame debe tener las columnas: {required_cols}")
        self.interaction_df = interaction_df
        self.user_map = {}
        self.article_map = {}
        self.interaction_matrix = None
        self.user_similarity = None

    def build_matrix(self) -> None:
        """
        Construye la matriz de interacciones usuario-artículo.
        """
        users = self.interaction_df['user_id'].unique()
        articles = self.interaction_df['article_id'].unique()
        if len(users) == 0 or len(articles) == 0:
            self.interaction_matrix = None
            return
        self.user_map = {u: i for i, u in enumerate(users)}
        self.article_map = {a: i for i, a in enumerate(articles)}
        row = self.interaction_df['user_id'].map(self.user_map).values
        col = self.interaction_df['article_id'].map(self.article_map).values
        data = self.interaction_df['interaction'].values
        self.interaction_matrix = csr_matrix((data, (row, col)),
                                             shape=(len(users), len(articles)))

    def compute_similarity(self) -> None:
        """
        Calcula la matriz de similitud entre usuarios usando similitud de coseno.
        """
        if self.interaction_matrix is None:
            self.build_matrix()
        if self.interaction_matrix is not None:
            self.user_similarity = cosine_similarity(self.interaction_matrix)
        else:
            self.user_similarity = None

    def recommend_for_user(self, user_id, top_k: int = 5, top_n: int = 5) -> list:
        """
        Genera recomendaciones para un usuario basado en usuarios similares.
        Args:
            user_id: ID del usuario.
            top_k (int): Número de vecinos similares a considerar.
            top_n (int): Número de recomendaciones a retornar.
        Returns:
            list: IDs de artículos recomendados.
        """
        if self.user_similarity is None:
            self.compute_similarity()
        if self.user_similarity is None or user_id not in self.user_map:
            return []

        user_idx = self.user_map[user_id]
        sim_scores = self.user_similarity[user_idx].copy()
        sim_scores[user_idx] = 0  # No se compara consigo mismo

        similar_users = np.argsort(sim_scores)[::-1][:top_k]
        similar_users_matrix = self.interaction_matrix[similar_users]
        summed_scores = np.asarray(similar_users_matrix.sum(axis=0)).flatten()

        # Eliminar artículos ya vistos
        seen = self.interaction_matrix[user_idx].toarray().flatten()
        summed_scores = summed_scores * (1 - seen)

        top_articles_idx = np.argsort(summed_scores)[::-1][:top_n]

        # Mapear índices a IDs reales
        reverse_article_map = {i: a for a, i in self.article_map.items()}
        return [reverse_article_map[i] for i in top_articles_idx if i in reverse_article_map]
