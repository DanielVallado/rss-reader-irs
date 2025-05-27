from flask import Blueprint, request, jsonify, current_app

routes = Blueprint('routes', __name__)

@routes.route('/recommendations/content', methods=['GET'])
def recommend_content():
    """
    Recomendaciones basadas en contenido personalizadas para un usuario.
    Requiere user_id como parámetro obligatorio (UUID string).
    Recibe el parámetro top_n para indicar la cantidad de recomendaciones (por defecto 4).
    """
    recommender_service = current_app.config['RECOMMENDER_SERVICE']
    user_id = request.args.get('user_id', type=str)
    if not user_id:
        return jsonify({'error': 'Missing user_id parameter'}), 400
    top_n = request.args.get('top_n', default=4, type=int)
    try:
        recommendations = recommender_service.recommend_content_based(user_id=user_id, top_n=top_n)
        articles_df = recommender_service.articles_df
        tfidf_matrix = recommender_service.tfidf_matrix
        visited_article_ids = recommender_service.db.get_user_visited_articles(user_id)
        id_to_index = {id_: idx for idx, id_ in enumerate(articles_df['id'])}
        user_article_indices = [id_to_index[aid] for aid in visited_article_ids if aid in id_to_index]
        recs = recommender_service.content_engine.recommend_for_user(user_article_indices, tfidf_matrix, top_n=top_n)
        response = [
            {"id": int(articles_df.iloc[idx]['id']), "similarity": sim}
            for idx, sim in recs
        ]
        return jsonify({
            'type': 'content_based',
            'user_id': user_id,
            'recommendations': response,
            'explanation': 'Te recomendamos estos artículos porque son muy parecidos a los que ya has leído. ¡Descubre más contenido que se ajusta a tus intereses!'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes.route('/recommendations/content/coldstart', methods=['GET'])
def recommend_content_coldstart():
    """
    Recomendaciones para usuario nuevo (sin historial).
    No requiere user_id. Devuelve los artículos más representativos del conjunto.
    Recibe el parámetro top_n para indicar la cantidad de recomendaciones (por defecto 4).
    """
    recommender_service = current_app.config['RECOMMENDER_SERVICE']
    top_n = request.args.get('top_n', default=4, type=int)
    try:
        tfidf_matrix = recommender_service.tfidf_matrix
        articles_df = recommender_service.articles_df
        recs = recommender_service.content_engine.recommend_for_new_user(tfidf_matrix, top_n=top_n)
        response = [
            {"id": int(articles_df.iloc[idx]['id']), "similarity": sim}
            for idx, sim in recs
        ]
        return jsonify({
            'type': 'content_coldstart',
            'recommendations': response,
            'explanation': 'Te mostramos los artículos más destacados y populares para que empieces a explorar el contenido de la plataforma.'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes.route('/recommendations/content/similar', methods=['GET'])
def recommend_content_similar():
    """
    Recomendaciones de artículos similares a uno dado.
    Requiere parámetro article_id (tipo int).
    Recibe el parámetro top_n para indicar la cantidad de recomendaciones (por defecto 4).
    """
    recommender_service = current_app.config['RECOMMENDER_SERVICE']
    article_id = request.args.get('article_id', type=int)
    if article_id is None:
        return jsonify({'error': 'Missing article_id parameter'}), 400
    top_n = request.args.get('top_n', default=4, type=int)
    try:
        articles_df = recommender_service.articles_df
        if article_id not in articles_df['id'].values:
            return jsonify({'error': 'article_id not found'}), 404
        article_index = articles_df.index[articles_df['id'] == article_id][0]
        tfidf_matrix = recommender_service.tfidf_matrix
        recs = recommender_service.content_engine.recommend_by_similarity(article_index, tfidf_matrix, top_n=top_n)
        response = [
            {"id": int(articles_df.iloc[idx]['id']), "similarity": sim}
            for idx, sim in recs
        ]
        article_title = articles_df.iloc[article_index]['titulo'] if 'titulo' in articles_df.columns else str(article_id)
        return jsonify({
            'type': 'content_similar',
            'article_id': article_id,
            'recommendations': response,
            'explanation': f"Como leíste el artículo '{article_title}', creemos que estos otros también te pueden interesar. ¡Sigue explorando temas relacionados!"
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes.route('/recommendations/content/popular', methods=['GET'])
def recommend_content_popular():
    """
    Recomendaciones de los artículos más populares según el ranking de visitas (interacciones).
    No requiere user_id.
    Recibe el parámetro top_n para indicar la cantidad de recomendaciones (por defecto 4).
    """
    recommender_service = current_app.config['RECOMMENDER_SERVICE']
    top_n = request.args.get('top_n', default=4, type=int)
    try:
        interactions_df = recommender_service.db.get_user_interactions_dataframe()
        articles_df = recommender_service.articles_df
        indices = recommender_service.content_engine.recommend_by_popularity(interactions_df, articles_df, top_n=top_n)
        recommended_ids = articles_df.iloc[indices]['id'].tolist()
        return jsonify({
            'type': 'content_popular',
            'recommendations': recommended_ids,
            'explanation': 'Estos son los artículos más leídos por toda la comunidad. ¡No te pierdas lo que está siendo tendencia!'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes.route('/recommendations/collaborative', methods=['GET'])
def recommend_collaborative():
    """
    Recomendaciones colaborativas para usuario existente.
    Requiere parámetro user_id en query string (UUID string).
    Recibe el parámetro top_n para indicar la cantidad de recomendaciones (por defecto 4).
    """
    recommender_service = current_app.config['RECOMMENDER_SERVICE']
    user_id = request.args.get('user_id', type=str)
    if not user_id:
        return jsonify({'error': 'Missing user_id parameter'}), 400

    top_n = request.args.get('top_n', default=4, type=int)
    top_k = request.args.get('top_k', default=5, type=int)

    try:
        recommendations = recommender_service.recommend_collaborative(
            user_id=user_id, top_k=top_k, top_n=top_n)
        recommendations = [int(x) for x in recommendations]
        return jsonify({
            'type': 'collaborative',
            'user_id': user_id,
            'recommendations': recommendations,
            'explanation': 'Te sugerimos estos artículos porque otros usuarios con intereses similares a los tuyos también los han leído.'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes.route('/recommendations/hybrid', methods=['GET'])
def recommend_hybrid():
    """
    Recomendaciones híbridas combinando contenido y colaborativo.
    Requiere parámetro user_id en query string (UUID string).
    Recibe el parámetro top_n para indicar la cantidad de recomendaciones (por defecto 4).
    """
    recommender_service = current_app.config['RECOMMENDER_SERVICE']
    user_id = request.args.get('user_id', type=str)
    if not user_id:
        return jsonify({'error': 'Missing user_id parameter'}), 400

    top_n = request.args.get('top_n', default=4, type=int)
    top_k = request.args.get('top_k', default=5, type=int)

    try:
        recommendations = recommender_service.recommend_hybrid(
            user_id=user_id, top_n=top_n, top_k=top_k)
        return jsonify({
            'type': 'hybrid',
            'user_id': user_id,
            'recommendations': recommendations,
            'explanation': 'Estas recomendaciones combinan tus intereses y los de usuarios parecidos a ti, para que descubras contenido aún más relevante.'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

#default 4 articulos, recibir la cantidad de articulos que se desea recibir