from flask import Blueprint, render_template, request, jsonify, redirect, url_for, flash
from flask_login import login_required, logout_user
from app.controllers.auth_controller import AuthController

bp = Blueprint('auth', __name__)



@bp.route('/register')
def register():
    return render_template('register.html')

@bp.route('/api/register', methods=['POST'])
def api_register():
    data = request.get_json()
    response, status_code = AuthController.register_user(data)
    return jsonify(response), status_code

@bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        remember = bool(request.form.get('remember'))

        success, message = AuthController.login(email, password, remember)
        
        if success:
            next_page = request.args.get('next')
            return redirect(next_page or url_for('index'))
        
        flash(message)
    return render_template('login.html')

@bp.route('/logout')
@login_required
def logout():
    AuthController.logout()
    return redirect(url_for('auth.login'))

@bp.route('/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    if request.method == 'POST':
        email = request.form.get('email')
        success, message = AuthController.send_reset_password_link(email)
        flash(message)
        if success:
            return redirect(url_for('auth.login'))
    return render_template('forgot_password.html')
@login_required
@bp.route('/')
def landing():
    return render_template('landing.html')