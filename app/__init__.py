from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config

db = SQLAlchemy()
login_manager = LoginManager()
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Por favor inicia sesión para acceder a esta página'

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    login_manager.init_app(app)

    from app.models.user import User
    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    from app.views import auth_views
    app.register_blueprint(auth_views.bp)

    with app.app_context():
        db.create_all()

    return app
