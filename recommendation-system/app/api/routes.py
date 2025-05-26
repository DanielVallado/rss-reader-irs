from flask import Blueprint, request, jsonify

routes = Blueprint('routes', __name__)

@routes.route('/recommendations/content', methods=['GET'])
def recommend_content():
    """
    Recomendaciones basadas en contenido para usuario nuevo o sin historial.
    No requiere user_id.
    """
    top_n = request.args.get('top_n', default=5, type=int)
    try:
        recommendations = recommender_service.recommend_content_based(top_n=top_n)
        return jsonify({
            'type': 'content_based',
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes.route('/recommendations/collaborative', methods=['GET'])
def recommend_collaborative():
    """
    Recomendaciones colaborativas para usuario existente.
    Requiere parámetro user_id en query string.
    """
    user_id = request.args.get('user_id', type=int)
    if user_id is None:
        return jsonify({'error': 'Missing user_id parameter'}), 400

    top_n = request.args.get('top_n', default=5, type=int)
    top_k = request.args.get('top_k', default=5, type=int)

    try:
        recommendations = recommender_service.recommend_collaborative(
            user_id=user_id, top_k=top_k, top_n=top_n)
        return jsonify({
            'type': 'collaborative',
            'user_id': user_id,
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@routes.route('/recommendations/hybrid', methods=['GET'])
def recommend_hybrid():
    """
    Recomendaciones híbridas combinando contenido y colaborativo.
    Requiere parámetro user_id en query string.
    """
    user_id = request.args.get('user_id', type=int)
    if user_id is None:
        return jsonify({'error': 'Missing user_id parameter'}), 400

    top_n = request.args.get('top_n', default=5, type=int)
    top_k = request.args.get('top_k', default=5, type=int)

    try:
        recommendations = recommender_service.recommend_hybrid(
            user_id=user_id, top_n=top_n, top_k=top_k)
        return jsonify({
            'type': 'hybrid',
            'user_id': user_id,
            'recommendations': recommendations
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
