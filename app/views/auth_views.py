from flask import Blueprint, render_template, request, jsonify
from app.controllers.auth_controller import AuthController

bp = Blueprint('auth', __name__)

@bp.route('/')
def home():
    return render_template('donation-platform-html.html')

@bp.route('/register')
def register():
    return render_template('register.html')

@bp.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    response, status_code = AuthController.register_user(data)
    return jsonify(response), status_code
