-- Script de datos de prueba para rss-reader
USE `rss-reader`;

-- Usuarios de prueba (UUIDs en formato binario)
INSERT INTO users (id, username, email) VALUES
  (UNHEX('10d41dc93ad011f096465811223c3b1f'), 'usuario1', 'usuario1@correo.com'),
  (UNHEX('10d41c4d3ad011f096465811223c3b1f'), 'usuario2', 'usuario2@correo.com'),
  (UNHEX('10d410ed3ad011f096465811223c3b1f'), 'usuario3', 'usuario3@correo.com');

-- Feeds RSS de prueba
INSERT INTO rss (url) VALUES
  ('https://ejemplo.com/rss/tecnologia'), --feed 1  
  ('https://ejemplo.com/rss/ciencia'); --feed 2

-- Artículos de prueba
INSERT INTO articles (rss_id, title, link, published_at, description, image_url, author) VALUES
  (1, 'Artículo de Tecnología 1', 'https://ejemplo.com/articulo1', NOW(), 'Descripción del artículo 1', NULL, 'Autor 1'), --articulo 1
  (1, 'Artículo de Tecnología 2', 'https://ejemplo.com/articulo2', NOW(), 'Descripción del artículo 2', NULL, 'Autor 2'), --articulo 2
  (2, 'Artículo de Ciencia 1', 'https://ejemplo.com/articulo3', NOW(), 'Descripción del artículo 3', NULL, 'Autor 3'), --articulo 3
    (2, 'Artículo de Ciencia 2', 'https://ejemplo.com/articulo4', NOW(), 'Descripción del artículo 4', NULL, 'Autor 4'); --articulo 4

-- Categorías de prueba
INSERT INTO categories (name) VALUES
  ('Tecnología'), --categoria 1 
  ('Ciencia'); --categoria 2

-- Relacionar artículos con categorías
INSERT INTO categories_articles (category_id, article_id) VALUES
  (1, 1), --articulo 1 pertenece a la categoria 1   
  (1, 2), --articulo 2 pertene  ce a la categoria 1
  (2, 3), --articulo 3 pertene  ce a la categoria 2
  (2, 4); --articulo 4 pertene  ce a la categoria 2

-- Relacionar usuarios con feeds RSS
INSERT INTO users_rss (user_id, rss_id) VALUES
  (UNHEX('10d41dc93ad011f096465811223c3b1f'), 1), --usuario 1 se suscribe al feed 1
  (UNHEX('10d41c4d3ad011f096465811223c3b1f'), 2), --usuario 2 se suscribe al feed 2 
  (UNHEX('10d410ed3ad011f096465811223c3b1f'), 1), --usuario 3 se suscribe al feed 1
  (UNHEX('10d410ed3ad011f096465811223c3b1f'), 2); --usuario 3 se suscribe al feed 2

-- Interacciones de usuarios con artículos
INSERT INTO interactions (users_id, articles_id) VALUES
  (UNHEX('10d41dc93ad011f096465811223c3b1f'), 1), --usuario 1 interactua con el articulo 1
  (UNHEX('10d41dc93ad011f096465811223c3b1f'), 2), --usuario 1 interactua con el articulo 2
  (UNHEX('10d41c4d3ad011f096465811223c3b1f'), 3), --usuario 2 interactua con el articulo 3  
  (UNHEX('10d410ed3ad011f096465811223c3b1f'), 4), --usuario 3 interactua con el articulo 4
  (UNHEX('10d410ed3ad011f096465811223c3b1f'), 1); --usuario 3 interactua con el articulo 1