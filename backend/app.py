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
        stocks = stock_service.fetch_all_stocks()
        return jsonify({
            "data": stocks,
            "count": len(stocks),
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
        criteria = request.get_json()
        # Initial validation will happen in the service or here if complex
        filtered_stocks = stock_service.screen_stocks(criteria)
        return jsonify({
            "data": filtered_stocks,
            "count": len(filtered_stocks),
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
