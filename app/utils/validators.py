import re
import validators

def validar_password(password):
    """Valida requisitos de contraseña"""
    if len(password) < 8:
        return False, "La contraseña debe tener al menos 8 caracteres"
    
    if not re.search(r"[A-Z]", password):
        return False, "La contraseña debe contener al menos una mayúscula"
    
    if not re.search(r"[a-z]", password):
        return False, "La contraseña debe contener al menos una minúscula"
    
    if not re.search(r"\d", password):
        return False, "La contraseña debe contener al menos un número"
    
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False, "La contraseña debe contener al menos un carácter especial"
    
    return True, "Contraseña válida"

def validar_email(email):
    return validators.email(email)

def validar_telefono(telefono):
    patron = re.compile(r'^\+?1?\d{9,15}$')
    return bool(patron.match(telefono))
