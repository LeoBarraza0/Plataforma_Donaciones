from flask import flash, redirect, url_for, request
from flask_login import login_user, logout_user, current_user
from app.models.user import User
from app import db

class AuthController:
    @staticmethod
    def login(email, password, remember=False):
        user = User.query.filter_by(email=email).first()
        
        if user and user.check_password(password):
            if user.activo:
                login_user(user, remember=remember)
                return True, 'Login exitoso'
            return False, 'Tu cuenta está desactivada'
        return False, 'Email o contraseña incorrectos'

    @staticmethod
    def logout():
        logout_user()
        return True, 'Sesión cerrada exitosamente'

    @staticmethod
    def check_if_authenticated():
        return current_user.is_authenticated

    @staticmethod
    def send_reset_password_link(email):
        user = User.query.filter_by(email=email).first()
        if user:
            # Aquí iría la lógica para enviar el correo
            # Por ahora solo retornamos un mensaje de éxito
            return True, 'Se han enviado las instrucciones a tu correo electrónico'
        return False, 'No existe una cuenta con ese correo electrónico'
