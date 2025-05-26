# Sistema de Recomendaciones RSS

API de recomendaciones para el lector RSS. Este sistema proporciona recomendaciones personalizadas de feeds RSS basadas en las preferencias y el historial de lectura del usuario.

## Requisitos Previos

- Python 3.8+
- MySQL 8.0+
- Base de datos `rss-reader` creada y configurada
- Pip (gestor de paquetes de Python)

## Estructura del Proyecto

```
recommender-api/
├── app/
│   ├── api/                # Endpoints de la API
│   │   └── routes.py
│   ├── recommender/        # Lógica de recomendaciones
│   │   ├── content_recommendation.py
│   │   ├── collaborative_recommendation.py
│   │   └── hybrid_recommendation.py
│   ├── models/            # Modelos y acceso a datos
│   │   ├── database.py
│   │   └── init_db.py
│   └── main.py           # Punto de entrada
├── requirements.txt
└── README.md
```

## Configuración del Entorno

1. Crear y activar un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Descargar modelos de lenguaje necesarios:
```bash
python -m spacy download es_core_news_sm
python -m nltk.downloader punkt stopwords
```

4. Crear archivo `.env` en la raíz del proyecto:
```
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_HOST=localhost
DB_NAME=rss-reader
PORT=5000
FLASK_DEBUG=True
```

5. Inicializar la base de datos:
```bash
python app/models/init_db.py
```

## Ejecutar la API

```bash
python app/main.py
```

La API estará disponible en `http://localhost:5000`

## Endpoints Principales

- `GET /api/recommendations/{user_id}`: Obtiene recomendaciones para un usuario específico
  - Parámetros query opcionales:
    - `type`: Tipo de recomendación ('content', 'collaborative', 'hybrid')
    - `count`: Número de recomendaciones (default: 5)

- `POST /api/feedback`: Recibe retroalimentación sobre las recomendaciones
  - Body:
    ```json
    {
      "user_id": "uuid",
      "article_id": 123,
      "rating": 1
    }
    ```

- `GET /api/health`: Verificación del estado de la API

## Tecnologías Utilizadas

- Python 3.8+
- Flask (API REST)
- SQLAlchemy (ORM)
- Pandas (Procesamiento de datos)
- scikit-learn (Algoritmos de recomendación)
- spaCy (Procesamiento de lenguaje natural)
- MySQL (Base de datos)

## Notas de Desarrollo

- El sistema utiliza un enfoque híbrido que combina recomendaciones basadas en contenido y filtrado colaborativo
- Las recomendaciones se basan en:
  - Contenido de los artículos (título, descripción)
  - Categorías de los artículos
  - Historial de suscripciones de los usuarios
- Los resultados se almacenan en la tabla `recommendations` para análisis posterior 