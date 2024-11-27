document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registerForm');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm-password');
    const passwordStrength = document.querySelector('.password-strength');

    // Validación de contraseña en tiempo real
    password.addEventListener('input', function() {
        const value = this.value;
        let strength = 0;
        
        // Longitud mínima
        if(value.length >= 8) strength += 1;
        
        // Contiene números y letras
        if(/(?=.*[a-z])(?=.*[0-9])/.test(value)) strength += 1;
        
        // Contiene mayúsculas y caracteres especiales
        if(/(?=.*[A-Z])(?=.*[^A-Za-z0-9])/.test(value)) strength += 1;

        passwordStrength.className = 'password-strength';
        if(strength === 1) passwordStrength.classList.add('weak');
        else if(strength === 2) passwordStrength.classList.add('medium');
        else if(strength === 3) passwordStrength.classList.add('strong');
    });

    // Validación del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Validar que las contraseñas coincidan
        if(password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Las contraseñas no coinciden');
            return;
        }

        // Aquí iría la lógica para enviar el formulario al servidor
        const formData = new FormData(form);
        fetch('/api/register', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                window.location.href = '/login';
            } else {
                showError(null, data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showError(null, 'Ocurrió un error al registrar el usuario');
        });
    });

    function showError(element, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'var(--error-color)';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.5rem';

        if(element) {
            element.parentNode.appendChild(errorDiv);
            setTimeout(() => errorDiv.remove(), 3000);
        } else {
            form.insertBefore(errorDiv, form.firstChild);
            setTimeout(() => errorDiv.remove(), 3000);
        }
    }
}); 