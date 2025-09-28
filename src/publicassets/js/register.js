document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                nombre: document.getElementById('name').value,
                correo: document.getElementById('correo').value,
                telefono: document.getElementById('telefono').value,
                cedula: document.getElementById('cedula').value,
                contrasena: document.getElementById('password').value,
                rol_id: 2 // Rol Usuario por defecto
            };

            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registro exitoso');
                    window.location.href = '/auth/login';
                } else {
                    alert(data.mensaje || 'Error en el registro');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }
});
