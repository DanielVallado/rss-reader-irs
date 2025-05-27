"""
content_recommendation.py

Módulo para recomendaciones basadas en contenido textual de artículos.
Utiliza TF-IDF y reducción de dimensionalidad para calcular similitud entre artículos y generar recomendaciones personalizadas.

Supone que el DataFrame de entrada tiene las columnas: 'titulo', 'descripcion', 'autores'.
"""
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import numpy as np

class ContentRecommendation:
    """
    Motor de recomendación basado en el contenido textual de los artículos.
    Permite generar recomendaciones para usuarios nuevos, por similitud de artículos,
    o personalizadas según el historial de artículos visitados por el usuario.
    """
    def preprocess_articles(self, df):
        """
        Preprocesa los artículos combinando título, descripción y autores, y genera la matriz TF-IDF.
        Args:
            df (pd.DataFrame): DataFrame con columnas 'titulo', 'descripcion', 'autores'.
        Returns:
            tuple: (DataFrame con columna 'combined', matriz TF-IDF)
        """
        df['combined'] = df['titulo'] + ' ' + df['descripcion'] + ' ' + df['autores']
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(df['combined'])
        return df.reset_index(drop=True), tfidf_matrix

    def reduce_dimensions(self, tfidf_matrix, n_components=100):
        """
        Reduce la dimensionalidad de la matriz TF-IDF usando SVD.
        Args:
            tfidf_matrix: Matriz TF-IDF.
            n_components (int): Número de componentes para SVD.
        Returns:
            np.ndarray: Matriz reducida.
        """
        svd = TruncatedSVD(n_components=n_components, random_state=42)
        return svd.fit_transform(tfidf_matrix)

    def recommend_for_new_user(self, tfidf_matrix, top_n=5):
        """
        Recomienda artículos para un usuario nuevo (sin historial),
        seleccionando los más representativos del conjunto.
        Args:
            tfidf_matrix: Matriz TF-IDF de todos los artículos.
            top_n (int): Número de recomendaciones.
        Returns:
            list: Lista de tuplas (índice de artículo, porcentaje de similitud).
        """
        avg_vector = tfidf_matrix.mean(axis=0)
        scores = cosine_similarity(avg_vector, tfidf_matrix).flatten()
        ranked_indices = np.argsort(scores)[::-1][:top_n]
        recommendations = [(int(idx), float(round(scores[idx]*100, 1))) for idx in ranked_indices]
        return recommendations

    def recommend_by_similarity(self, article_index, tfidf_matrix, top_n=5):
        """
        Recomienda artículos similares a un artículo dado.
        Args:
            article_index (int): Índice del artículo de referencia.
            tfidf_matrix: Matriz TF-IDF de todos los artículos.
            top_n (int): Número de recomendaciones.
        Returns:
            list: Lista de tuplas (índice de artículo, porcentaje de similitud).
        """
        sim_scores = cosine_similarity(tfidf_matrix[article_index], tfidf_matrix).flatten()
        ranked_indices = np.argsort(sim_scores)[::-1]
        similar_indices = [i for i in ranked_indices if i != article_index][:top_n]
        recommendations = [(int(idx), float(round(sim_scores[idx]*100, 1))) for idx in similar_indices]
        return recommendations

    def recommend_for_user(self, user_article_indices, tfidf_matrix, top_n=5):
        """
        Recomienda artículos similares a los que el usuario ya ha visitado.
        Args:
            user_article_indices (list): Índices de artículos visitados por el usuario.
            tfidf_matrix: Matriz TF-IDF de todos los artículos.
            top_n (int): Número de recomendaciones.
        Returns:
            list: Lista de tuplas (índice de artículo, porcentaje de similitud).
        """
        if not user_article_indices:
            return []
        user_profile = tfidf_matrix[user_article_indices].mean(axis=0)
        similarities = cosine_similarity(user_profile, tfidf_matrix)
        similarities[0, user_article_indices] = -np.inf
        top_indices = np.argsort(similarities[0])[::-1][:top_n]
        recommendations = [(int(idx), float(round(similarities[0, idx]*100, 1))) for idx in top_indices]
        return recommendations

    def recommend_by_popularity(self, interactions_df, articles_df, top_n=5):
        """
        Recomienda los artículos más populares según el número de interacciones (visitas).
        Args:
            interactions_df (pd.DataFrame): DataFrame con columnas 'article_id'.
            articles_df (pd.DataFrame): DataFrame de artículos (debe tener columna 'id').
            top_n (int): Número de recomendaciones.
        Returns:
            list: Índices de los artículos más populares en articles_df.
        """
        # Contar visitas por artículo
        popularity = interactions_df['article_id'].value_counts()
        # Seleccionar los IDs más populares
        top_article_ids = popularity.head(top_n).index.tolist()
        # Mapear IDs a índices en articles_df
        id_to_index = {id_: idx for idx, id_ in enumerate(articles_df['id'])}
        top_indices = [id_to_index[aid] for aid in top_article_ids if aid in id_to_index]
        return top_indices