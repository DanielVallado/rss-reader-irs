import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import pandas as pd

from recommender_service import RecommenderService
from api.routes import routes as api_bp

# Carga variables de entorno desde archivo .env
load_dotenv()

def create_app():
    app = Flask(__name__)

    # Configura modo debug desde variable de entorno (por defecto True)
    app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True') == 'True'

    # Configura CORS para permitir peticiones desde cualquier origen
    CORS(app)

    # Carga datos de artículos e interacciones (ajusta rutas según tu proyecto)
    articles_path = os.getenv('ARTICLES_CSV_PATH', 'data/articles.csv')
    interactions_path = os.getenv('INTERACTIONS_CSV_PATH', 'data/interactions.csv')

    articles_df = pd.read_csv(articles_path)
    interactions_df = pd.read_csv(interactions_path)

    # Inicializa el servicio de recomendación con los datos cargados
    recommender_service = RecommenderService(articles_df, interactions_df)

    # Guarda la instancia en la configuración para acceso global en rutas
    app.config['RECOMMENDER_SERVICE'] = recommender_service

    # Registra el blueprint con prefijo /api
    app.register_blueprint(api_bp, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
