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
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
        self.svd = TruncatedSVD(n_components=100)
        self.model = GradientBoostingClassifier()

    def clean_text(self, text):
        """
        Limpia un texto eliminando caracteres especiales y convirtiendo a minúsculas.
        Entrada: texto (str)
        Salida: texto limpio (str)
        """
        if not isinstance(text, str):
            return ""
        text = text.lower().strip()
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        return text

    def preprocess_articles(self, df):
        """
        Limpieza y preparación de datos de artículos.
        Entrada: df (DataFrame con columnas 'id', 'descripcion')
        Salida: df limpio, matriz TF-IDF (sparse)
        """
        df = df.dropna(subset=['descripcion'])
        df['descripcion'] = df['descripcion'].apply(self.clean_text)
        tfidf_matrix = self.vectorizer.fit_transform(df['descripcion'])
        return df, tfidf_matrix

    def reduce_dimensions(self, tfidf_matrix):
        """
        Reduce la dimensionalidad de la matriz TF-IDF.
        Entrada: matriz TF-IDF (sparse matrix)
        Salida: matriz reducida (array)
        """
        return self.svd.fit_transform(tfidf_matrix)

    def train_model(self, features, labels):
        """
        Entrena un modelo Gradient Boosting.
        Entrada: features (np.array), labels (np.array de 0/1)
        Salida: None
        """
        self.model.fit(features, labels)

    def predict_scores(self, features):
        """
        Predice probabilidades de interés del usuario.
        Entrada: features (np.array)
        Salida: scores (np.array de probabilidades)
        """
        return self.model.predict_proba(features)[:, 1]

    def recommend_for_new_user(self, tfidf_matrix, top_n=5):
        """
        Genera recomendaciones para usuario nuevo basado en similitud de contenido.
        Entrada: matriz TF-IDF (sparse), top_n (int)
        Salida: índices de artículos recomendados
        """
        mean_vector = tfidf_matrix.mean(axis=0)
        similarities = cosine_similarity(mean_vector, tfidf_matrix)
        top_indices = np.argsort(similarities[0])[::-1][:top_n]
        return top_indices.tolist()

    def explain_model(self, feature_names):
        """
        Devuelve las características más importantes del modelo.
        Entrada: feature_names (list of str)
        Salida: lista de tuplas (nombre, importancia)
        """
        importances = self.model.feature_importances_
        return sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)

    def generate_recommendations(self, user_features, article_ids, top_n=5):
        """
        Genera recomendaciones personalizadas.
        Entrada:
        - user_features: np.array (features de artículos para el usuario)
        - article_ids: list (IDs correspondientes a los features)
        Salida: lista de IDs recomendados
        """
        scores = self.predict_scores(user_features)
        top_indices = np.argsort(scores)[::-1][:top_n]
        return [article_ids[i] for i in top_indices]