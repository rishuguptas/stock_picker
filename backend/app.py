from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os
from services.stock_service import stock_service

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static', static_url_path='/')
CORS(app)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    """Serve React frontend and handle SPA routing."""
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/stocks/all', methods=['GET'])
def get_all_stocks():
    """Fetch all stocks from the daily discovery engine."""
    try:
        # Get sorting parameters from query string
        sort_by = request.args.get('sort_by', None)
        sort_order = request.args.get('sort_order', 'asc')
        
        # Fetch stocks with limit, get total count from cache
        all_stocks = stock_service.fetch_all_stocks(sort_by=sort_by, sort_order=sort_order, limit=50)
        total_count = stock_service.get_total_count()
        
        print(f"DEBUG: all_stocks length = {len(all_stocks)}, total_count = {total_count}")
        
        return jsonify({
            "data": all_stocks,
            "count": len(all_stocks),
            "total_available": total_count,
            "error": None
        }), 200
    except Exception as e:
        return jsonify({
            "data": [],
            "error": {
                "code": "FETCH_ERROR",
                "message": str(e)
            }
        }), 500

@app.route('/api/stocks/screen', methods=['POST'])
def screen_stocks():
    """Screen stocks based on user criteria."""
    try:
        request_data = request.get_json() or {}
        criteria = {k: v for k, v in request_data.items() if k not in ['sort_by', 'sort_order']}
        
        # Get sorting parameters from request body
        sort_by = request_data.get('sort_by', None)
        sort_order = request_data.get('sort_order', 'asc')
        
        # Screen stocks with limit
        filtered_stocks = stock_service.screen_stocks(criteria, sort_by=sort_by, sort_order=sort_order, limit=50)
        # Get total filtered count (without limit)
        total_filtered = stock_service.get_filtered_count(criteria)
        
        return jsonify({
            "data": filtered_stocks,
            "count": len(filtered_stocks),
            "total_available": total_filtered,
            "error": None
        }), 200
    except Exception as e:
        return jsonify({
            "data": [],
            "error": {
                "code": "SCREENING_ERROR",
                "message": str(e)
            }
        }), 400

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
