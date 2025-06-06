let imagenTemporal = null;

function cancelarCambios() {
    // Limpiar campos de contraseña
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    // Recargar la página para descartar cambios
    window.location.reload();
}

function guardarCambios() {
    const nuevaContrasena = document.getElementById('nueva-contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
    
    // Array para almacenar las promesas
    const promesas = [];

    // Si hay una imagen temporal, agregar la promesa de subirla
    if (imagenTemporal) {
        promesas.push(
            fetch('/user/actualizar-imagen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    imageData: imagenTemporal
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.mensaje) {
                    document.getElementById('imagePreview').innerHTML = `<img src="${data.image_profile}" alt="Imagen de perfil" style="width: auto; height: auto; object-fit: cover;">`;
                    imagenTemporal = null;
                }
            })
        );
    }

    // Si hay una nueva contraseña, agregar la promesa de cambiarla
    if (nuevaContrasena && confirmarContrasena) {
        promesas.push(
            fetch('/auth/cambiar-contrasena', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    nuevaContrasena,
                    confirmarContrasena
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.mensaje) {
                    // Limpiar campos de contraseña
                    document.getElementById('nueva-contrasena').value = '';
                    document.getElementById('confirmar-contrasena').value = '';
                }
            })
        );
    }

    // Ejecutar todas las promesas
    Promise.all(promesas)
        .then(() => {
            mostrarNotificacion('Cambios guardados correctamente', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarNotificacion('Error al guardar los cambios: ' + error.message, 'error');
        });
}

function mostrarNotificacion(mensaje, tipo) {
    // Implementar notificación según tu diseño
    alert(mensaje);
}

// Modificar el evento onload en uploadprofileimage.js para guardar la imagen temporalmente
document.getElementById('imageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagenTemporal = e.target.result;
            document.getElementById('imagePreview').innerHTML = `<img src="${imagenTemporal}" alt="Vista previa" style="width: 100%; height: 100%; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
    }
});