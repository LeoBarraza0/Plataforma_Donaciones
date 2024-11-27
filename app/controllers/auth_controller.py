from app.models.user import User
from app import db
from app.utils.validators import validar_password, validar_email, validar_telefono

class AuthController:
    @staticmethod
    def register_user(data):
        try:
            # Validación de campos requeridos
            required_fields = ['nombre', 'email', 'password', 'tipo_usuario']
            for field in required_fields:
                if not data.get(field):
                    return {'success': False, 'message': f'El campo {field} es requerido'}, 400

            # Validación de email
            if not validar_email(data['email']):
                return {'success': False, 'message': 'El correo electrónico no es válido'}, 400

            # Verificar si el email ya existe
            if User.query.filter_by(email=data['email']).first():
                return {'success': False, 'message': 'Este correo electrónico ya está registrado'}, 400

            # Validación de contraseña
            password_valid, password_message = validar_password(data['password'])
            if not password_valid:
                return {'success': False, 'message': password_message}, 400

            # Validación de tipo de usuario
            tipos_validos = ['donante', 'organizacion', 'voluntario']
            if data['tipo_usuario'] not in tipos_validos:
                return {'success': False, 'message': 'Tipo de usuario no válido'}, 400

            # Validación de teléfono (opcional)
            if data.get('telefono'):
                if not validar_telefono(data['telefono']):
                    return {'success': False, 'message': 'Formato de teléfono no válido'}, 400

            # Crear nuevo usuario
            nuevo_usuario = User(
                nombre=data['nombre'].strip(),
                email=data['email'].lower().strip(),
                telefono=data.get('telefono'),
                tipo_usuario=data['tipo_usuario']
            )
            nuevo_usuario.set_password(data['password'])

            db.session.add(nuevo_usuario)
            db.session.commit()

            return {
                'success': True,
                'message': 'Usuario registrado exitosamente',
                'user_id': nuevo_usuario.id
            }, 201

        except Exception as e:
            db.session.rollback()
            return {
                'success': False,
                'message': 'Error en el servidor',
                'error': str(e)
            }, 500
