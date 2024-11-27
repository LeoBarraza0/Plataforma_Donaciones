document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.querySelector('.toggle-password');

    // Función para validar email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Función para mostrar errores
    function showError(element, message) {
        const existingError = element.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        element.parentElement.appendChild(errorDiv);
        element.classList.add('input-error');
    }

    // Función para remover errores
    function removeError(element) {
        const error = element.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
            element.classList.remove('input-error');
        }
    }

    // Toggle password visibility
    if (togglePasswordButton) {
        togglePasswordButton.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type');
            const icon = this.querySelector('i');
            
            if (type === 'password') {
                passwordInput.setAttribute('type', 'text');
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.setAttribute('type', 'password');
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Validación en tiempo real del email
    emailInput.addEventListener('input', function() {
        if (this.value.length > 0 && !isValidEmail(this.value)) {
            showError(this, 'Por favor, ingresa un email válido');
        } else {
            removeError(this);
        }
    });

    // Validación en tiempo real de la contraseña
    passwordInput.addEventListener('input', function() {
        if (this.value.length > 0 && this.value.length < 6) {
            showError(this, 'La contraseña debe tener al menos 6 caracteres');
        } else {
            removeError(this);
        }
    });

    // Animación de carga durante el submit
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar campos antes de enviar
        let hasErrors = false;

        if (!emailInput.value) {
            showError(emailInput, 'El email es requerido');
            hasErrors = true;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Por favor, ingresa un email válido');
            hasErrors = true;
        }

        if (!passwordInput.value) {
            showError(passwordInput, 'La contraseña es requerida');
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        // Deshabilitar el botón y mostrar estado de carga
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner"></span> Iniciando sesión...';

        try {
            // Enviar el formulario
            this.submit();
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
            
            // Mostrar mensaje de error general
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger';
            errorDiv.textContent = 'Ocurrió un error al intentar iniciar sesión. Por favor, intenta de nuevo.';
            this.insertBefore(errorDiv, this.firstChild);
            
            // Remover mensaje de error después de 5 segundos
            setTimeout(() => errorDiv.remove(), 5000);
        }
    });

    // Efecto de autofocus en el primer campo vacío
    if (!emailInput.value) {
        emailInput.focus();
    } else if (!passwordInput.value) {
        passwordInput.focus();
    }

    // Animación suave al mostrar mensajes de error
    document.querySelectorAll('.alert').forEach(alert => {
        alert.style.opacity = '0';
        alert.style.transform = 'translateY(-10px)';
        
        requestAnimationFrame(() => {
            alert.style.transition = 'all 0.3s ease';
            alert.style.opacity = '1';
            alert.style.transform = 'translateY(0)';
        });
    });
}); 