# Sistema de Recomendaciones RSS

API de recomendaciones para el lector RSS. Este sistema proporciona recomendaciones personalizadas de feeds RSS basadas en las preferencias y el historial de lectura del usuario.

## Estructura del Proyecto

```
recommender-api/
├── app/
│   ├── api/                # Endpoints de la API
│   │   └── routes.py
│   ├── recommender/        # Lógica de recomendaciones
│   │   └── engine.py
│   ├── models/            # Modelos de datos
│   └── main.py           # Punto de entrada
├── requirements.txt
└── README.md
```

## Configuración del Entorno

1. Crear un entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

## Ejecutar la API

```bash
python app/main.py
```

La API estará disponible en `http://localhost:5000`

## Endpoints Principales

- `GET /recommendations/{user_id}`: Obtiene recomendaciones para un usuario específico
- `POST /feedback`: Recibe retroalimentación sobre las recomendaciones
- `GET /health`: Verificación del estado de la API

## Tecnologías Utilizadas

- Python 3.8+
- Flask
- SQLAlchemy (para la persistencia de datos)
- Pandas (para el procesamiento de datos)
- scikit-learn (para algoritmos de recomendación) 