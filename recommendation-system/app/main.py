from flask import Flask
from flask_cors import CORS
from api.routes import routes
import os
from dotenv import load_dotenv
from recommender.recommender_service import RecommenderService

# Cargar variables de entorno
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configurar CORS
    CORS(app)
    
    # Inicializar el servicio de recomendaciones
    recommender_service = RecommenderService()
    
    # Guardar la instancia en la configuración para acceso global
    app.config['RECOMMENDER_SERVICE'] = recommender_service
    
    # Registrar blueprints
    app.register_blueprint(routes, url_prefix='/api')
    
    return app

if __name__ == '__main__':
    app = create_app()
    # Obtener el puerto del archivo .env, por defecto 5000
    port = int(os.getenv('PORT', 5000))
    # Obtener modo debug del archivo .env, por defecto True
    debug = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    app.run(host='127.0.0.1', port=5050, debug=debug)
