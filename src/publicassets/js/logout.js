async function cerrarSesion(event) {
    event.preventDefault();
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Redirigir a la página de login
            window.location.href = data.redirect;
        } else {
            console.error('Error al cerrar sesión:', data.mensaje);
            alert('Error al cerrar sesión. Por favor, intente nuevamente.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cerrar sesión. Por favor, intente nuevamente.');
    }
} 