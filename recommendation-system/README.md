# Sistema de Recomendaciones RSS

El **Sistema de Recomendaciones RSS** es un motor inteligente diseñado para mejorar la experiencia de los usuarios en lectores de feeds RSS, sugiriendo artículos relevantes y personalizados según sus intereses y comportamiento de navegación.

Este sistema analiza el contenido de los artículos, el historial de lectura de cada usuario y el comportamiento de la comunidad para ofrecer recomendaciones de alta calidad, tanto para usuarios nuevos como para usuarios recurrentes. Utiliza técnicas avanzadas de procesamiento de lenguaje natural, filtrado colaborativo y modelos híbridos para cubrir distintos escenarios de recomendación.

### ¿Qué ofrece este sistema?
- **Recomendaciones personalizadas:** Sugiere artículos que se adaptan a los intereses y hábitos de lectura de cada usuario.
- **Descubrimiento de contenido:** Ayuda a los usuarios a encontrar nuevos artículos y temas relevantes, incluso si son nuevos en la plataforma.
- **Tendencias y popularidad:** Permite descubrir los artículos más leídos y populares entre toda la comunidad.
- **Recomendaciones contextuales:** Ofrece artículos relacionados cuando el usuario está leyendo un artículo específico.
- **Explicaciones claras:** Cada recomendación viene acompañada de una explicación amigable para el usuario, facilitando la transparencia y la confianza en el sistema.

### ¿Cómo funciona?
- **Análisis de contenido:** Procesa el texto de los artículos (título, descripción, autores) para entender de qué tratan y encontrar similitudes entre ellos.
- **Historial de usuario:** Registra las interacciones de cada usuario (artículos leídos) para construir un perfil de intereses.
- **Filtrado colaborativo:** Analiza patrones de lectura de toda la comunidad para sugerir artículos que han sido populares entre usuarios con gustos similares.
- **Modelos híbridos:** Combina la información de contenido y colaborativa para ofrecer recomendaciones aún más precisas y personalizadas.

### ¿A quién está dirigido?
- A desarrolladores y empresas que quieran integrar recomendaciones inteligentes en sus lectores RSS o plataformas de noticias.
- A usuarios finales que buscan una experiencia de lectura más relevante, personalizada y dinámica.

### Integración
El sistema expone una **API REST** fácil de consumir, que puede integrarse con cualquier frontend web, móvil o de escritorio. La API permite obtener recomendaciones personalizadas, por popularidad, por similitud de artículo y más, devolviendo siempre explicaciones claras para el usuario final.

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

Nota: Se debe abrir terminal dentro de /recommender-system

1. Crear y activar un entorno virtual:
```bash
python -m venv venv
#Usar uno de los siguientes según sea el caso:
source venv/bin/activate  # En Windows: venv\Scripts\activate
source venv/Scripts/activate #En caso de usar Git Bash
venv\Scripts\activate # En caso de utilizar cmd
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

## Tecnologías Utilizadas

- Python 3.8+
- Flask (API REST)
- SQLAlchemy (ORM)
- Pandas (Procesamiento de datos)
- scikit-learn (Algoritmos de recomendación)
- spaCy (Procesamiento de lenguaje natural)
- MySQL (Base de datos)

## API de Recomendaciones

La API expone varios endpoints para obtener recomendaciones de artículos. Todos los endpoints devuelven un JSON con la lista de artículos recomendados y una explicación del criterio de recomendación.

### Parámetro común
- `top_n` (opcional): Número de artículos/recomendaciones a devolver. Si no se especifica, el valor por defecto es **4**.

---

### 1. Recomendación personalizada por historial de usuario
**Endpoint:**
```
GET /api/recommendations/content?user_id=<int>&top_n=<int>
```
- **user_id** (obligatorio): ID entero del usuario.
- **top_n** (opcional): Número de recomendaciones (por defecto 4).

**Ejemplo de uso:**
```
GET /api/recommendations/content?user_id=123&top_n=5
```

**Respuesta:**
```json
{
  "type": "content_based",
  "user_id": 123,
  "recommendations": [
    {"id": 12, "similarity": 98.2},
    {"id": 45, "similarity": 95.7},
    {"id": 33, "similarity": 93.1}
  ],
  "explanation": "Te recomendamos estos artículos porque son muy parecidos a los que ya has leído. ¡Descubre más contenido que se ajusta a tus intereses!"
}
```

---

### 2. Recomendación para usuario nuevo (cold start)
**Endpoint:**
```
GET /api/recommendations/content/coldstart?top_n=<int>
```
- **top_n** (opcional): Número de recomendaciones (por defecto 4).

**Ejemplo de uso:**
```
GET /api/recommendations/content/coldstart?top_n=3
```

**Respuesta:**
```json
{
  "type": "content_coldstart",
  "recommendations": [
    {"id": 8, "similarity": 87.5},
    {"id": 2, "similarity": 85.1},
    {"id": 15, "similarity": 82.3}
  ],
  "explanation": "Te mostramos los artículos más destacados y populares para que empieces a explorar el contenido de la plataforma."
}
```

---

### 3. Recomendación por similitud de artículo
**Endpoint:**
```
GET /api/recommendations/content/similar?article_id=<int>&top_n=<int>
```
- **article_id** (obligatorio): ID entero del artículo de referencia.
- **top_n** (opcional): Número de recomendaciones (por defecto 4).

**Ejemplo de uso:**
```
GET /api/recommendations/content/similar?article_id=10&top_n=2
```

**Respuesta:**
```json
{
  "type": "content_similar",
  "article_id": 10,
  "recommendations": [
    {"id": 5, "similarity": 91.4},
    {"id": 7, "similarity": 89.2}
  ],
  "explanation": "Como leíste el artículo 'El futuro de la IA', creemos que estos otros también te pueden interesar. ¡Sigue explorando temas relacionados!"
}
```

---

### 4. Recomendación por popularidad (ranking)
**Endpoint:**
```
GET /api/recommendations/content/popular?top_n=<int>
```
- **top_n** (opcional): Número de recomendaciones (por defecto 4).

**Ejemplo de uso:**
```
GET /api/recommendations/content/popular?top_n=6
```

**Respuesta:**
```json
{
  "type": "content_popular",
  "recommendations": [3, 8, 1, 12, 5, 9],
  "explanation": "Estos son los artículos más leídos por toda la comunidad. ¡No te pierdas lo que está siendo tendencia!"
}
```

---

### 5. Recomendación colaborativa
**Endpoint:**
```
GET /api/recommendations/collaborative?user_id=<int>&top_n=<int>&top_k=<int>
```
- **user_id** (obligatorio): ID entero del usuario.
- **top_n** (opcional): Número de recomendaciones (por defecto 4).
- **top_k** (opcional): Número de usuarios similares a considerar (por defecto 5).

**Ejemplo de uso:**
```
GET /api/recommendations/collaborative?user_id=123&top_n=4&top_k=5
```

**Respuesta:**
```json
{
  "type": "collaborative",
  "user_id": 123,
  "recommendations": [11, 14, 6, 2],
  "explanation": "Te sugerimos estos artículos porque otros usuarios con intereses similares a los tuyos también los han leído."
}
```

---

### 6. Recomendación híbrida (contenido + colaborativo)
**Endpoint:**
```
GET /api/recommendations/hybrid?user_id=<int>&top_n=<int>&top_k=<int>
```
- **user_id** (obligatorio): ID entero del usuario.
- **top_n** (opcional): Número de recomendaciones (por defecto 4).
- **top_k** (opcional): Número de usuarios similares a considerar (por defecto 5).

**Ejemplo de uso:**
```
GET /api/recommendations/hybrid?user_id=123&top_n=4&top_k=5
```

**Respuesta:**
```json
{
  "type": "hybrid",
  "user_id": 123,
  "recommendations": [9, 2, 7, 5],
  "explanation": "Estas recomendaciones combinan tus intereses y los de usuarios parecidos a ti, para que descubras contenido aún más relevante."
}
```

---

### Notas
- Todos los endpoints devuelven un campo `explanation` pensado para ser mostrado al usuario final.
- Si no se encuentra el usuario o el artículo, la API devuelve un error con un mensaje explicativo.
- Si no se especifica `top_n`, se devuelven 4 recomendaciones por defecto. 