document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const telefono = document.getElementById('telefono').value;
    const cedula = document.getElementById('cedula').value;
    const contrasena = document.getElementById('password').value;

    try {
        const response = await fetch('/api/usuarios/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                nombre, 
                email, 
                telefono, 
                cedula,
                contrasena 
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registro exitoso');
            window.location.href = '/login';
        } else {
            alert(data.mensaje || 'Error al registrar usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar usuario');
    }
});
