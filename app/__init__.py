from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import Config

db = SQLAlchemy()

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    from app.views import auth_views
    app.register_blueprint(auth_views.bp)
    app.add_url_rule('/', endpoint='index')
    with app.app_context():
        db.create_all()
    return app
