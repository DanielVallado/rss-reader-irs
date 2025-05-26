"""
content_recommendation.py

Módulo principal para el motor de recomendaciones de artículos.
Utiliza limpieza de datos, vectorización de contenido, modelos híbridos, y generación de recomendaciones.

Librerías: pandas, numpy, sklearn, scipy
"""

import pandas as pd
import numpy as np
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix

class ContentRecommendation:
    """
    Motor de recomendación basado en el contenido textual de los artículos.
    Métodos principales:
    - Limpieza y vectorización de texto
    - Reducción de dimensionalidad
    - Recomendación para usuarios nuevos (cold start)
    - Métodos auxiliares para entrenamiento y explicación del modelo
    """
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
        self.svd = TruncatedSVD(n_components=100)
        self.model = GradientBoostingClassifier()

    def clean_text(self, text: str) -> str:
        """
        Limpia un texto eliminando caracteres especiales y convirtiendo a minúsculas.
        Args:
            text (str): Texto a limpiar.
        Returns:
            str: Texto limpio.
        """
        if not isinstance(text, str):
            return ""
        text = text.lower().strip()
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        return text

    def preprocess_articles(self, df: pd.DataFrame) -> tuple:
        """
        Limpia y vectoriza las descripciones de los artículos.
        Args:
            df (pd.DataFrame): DataFrame con columna 'description'.
        Returns:
            tuple: (DataFrame limpio, matriz TF-IDF)
        Raises:
            ValueError: Si falta la columna 'description'.
        """
        if 'description' not in df.columns:
            raise ValueError("El DataFrame debe tener la columna 'description'.")
        df = df.dropna(subset=['description'])
        df['description'] = df['description'].apply(self.clean_text)
        tfidf_matrix = self.vectorizer.fit_transform(df['description'])
        return df, tfidf_matrix

    def reduce_dimensions(self, tfidf_matrix) -> np.ndarray:
        """
        Reduce la dimensionalidad de la matriz TF-IDF usando SVD.
        Args:
            tfidf_matrix (sparse matrix): Matriz TF-IDF.
        Returns:
            np.ndarray: Matriz reducida.
        """
        return self.svd.fit_transform(tfidf_matrix)

    def train_model(self, features: np.ndarray, labels: np.ndarray) -> None:
        """
        (Auxiliar) Entrena un modelo Gradient Boosting.
        Args:
            features (np.ndarray): Matriz de características.
            labels (np.ndarray): Etiquetas binarias (0/1).
        """
        self.model.fit(features, labels)

    def predict_scores(self, features: np.ndarray) -> np.ndarray:
        """
        (Auxiliar) Predice probabilidades de interés del usuario.
        Args:
            features (np.ndarray): Matriz de características.
        Returns:
            np.ndarray: Probabilidades predichas.
        """
        if hasattr(self.model, 'predict_proba'):
            return self.model.predict_proba(features)[:, 1]
        else:
            raise RuntimeError("El modelo no ha sido entrenado o no soporta predict_proba.")

    def recommend_for_new_user(self, tfidf_matrix, top_n: int = 5) -> list:
        """
        Genera recomendaciones para usuario nuevo basado en similitud de contenido.
        Args:
            tfidf_matrix (sparse matrix): Matriz TF-IDF de los artículos.
            top_n (int): Número de recomendaciones a retornar.
        Returns:
            list: Índices de artículos recomendados.
        """
        if tfidf_matrix.shape[0] == 0:
            return []
        mean_vector = tfidf_matrix.mean(axis=0)
        similarities = cosine_similarity(mean_vector, tfidf_matrix)
        top_indices = np.argsort(similarities[0])[::-1][:top_n]
        return top_indices.tolist()

    def explain_model(self, feature_names: list) -> list:
        """
        (Auxiliar) Devuelve las características más importantes del modelo.
        Args:
            feature_names (list): Nombres de las características.
        Returns:
            list: Lista de tuplas (nombre, importancia).
        """
        importances = self.model.feature_importances_
        return sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)

    def generate_recommendations(self, user_features: np.ndarray, article_ids: list, top_n: int = 5) -> list:
        """
        (Auxiliar) Genera recomendaciones personalizadas usando el modelo entrenado.
        Args:
            user_features (np.ndarray): Características de los artículos para el usuario.
            article_ids (list): IDs de los artículos.
            top_n (int): Número de recomendaciones.
        Returns:
            list: IDs recomendados.
        """
        scores = self.predict_scores(user_features)
        top_indices = np.argsort(scores)[::-1][:top_n]
        return [article_ids[i] for i in top_indices]