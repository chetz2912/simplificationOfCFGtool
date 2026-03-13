from flask import Flask
from flask_cors import CORS
from routes.grammar_routes import grammar_bp

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)

    # Enable CORS for all routes
    CORS(app)

    # Register blueprints
    app.register_blueprint(grammar_bp, url_prefix='/api')

    # Basic health check endpoint
    @app.route('/health')
    def health():
        return {'status': 'healthy', 'service': 'grammar-simplification'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
