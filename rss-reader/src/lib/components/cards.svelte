<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Página con tarjetas interactivas">
    <meta name="keywords" content="tarjetas, diseño, interactivo">
    <meta name="author" content="Tu Nombre">
    <title>Tarjetas Interactivas</title>
    <style>
        .container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            max-width: 1200px;
            padding: 20px;
            margin: auto;
        }
        .card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease-in-out;
            cursor: pointer;
        }
        .card:hover {
            transform: scale(1.05);
        }
        .card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }
        .card-content {
            padding: 15px;
        }
        .card-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .card-text {
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <header>
        <h1>Tarjetas Interactivas</h1>
        <p>Explora nuestras tarjetas con información relevante.</p>
    </header>

    <main>
        <section class="container">
            <article class="card" onclick="window.location.href='#';">
                <img src="https://via.placeholder.com/300" alt="Imagen de Título 1">
                <div class="card-content">
                    <h2 class="card-title">Título 1</h2>
                    <p class="card-text">Descripción breve de la información.</p>
                </div>
            </article>
            <article class="card" onclick="window.location.href='#';">
                <img src="https://via.placeholder.com/300" alt="Imagen de Título 2">
                <div class="card-content">
                    <h2 class="card-title">Título 2</h2>
                    <p class="card-text">Otra descripción relevante.</p>
                </div>
            </article>
        
        </section>
    </main>

    <footer>
        <p>&copy; 2025 Daniel Vallado y Juan Trivellari. Todos los derechos reservados.</p>
    </footer>

    <script>
        let cardsData = [
            {
                title: "Título 1",
                text: "Descripción breve de la información.",
                image: "https://via.placeholder.com/300",
                link: "#"
            },
            {
                title: "Título 2",
                text: "Otra descripción relevante.",
                image: "https://via.placeholder.com/300",
                link: "#"
            }
        ];
    </script>
</body>
</html>