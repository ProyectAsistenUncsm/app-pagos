let imagenTemporal = null;

function cancelarCambios() {
    console.log('Función cancelarCambios ejecutada');
    // Limpiar campos de contraseña
    document.getElementById('nueva-contrasena').value = '';
    document.getElementById('confirmar-contrasena').value = '';
    // Recargar la página para descartar cambios
    window.location.reload();
}

// Función para guardar cambios
function guardarCambios() {
    console.log('Función guardarCambios ejecutada');
    const nuevaContrasena = document.getElementById('nueva-contrasena').value;
    const confirmarContrasena = document.getElementById('confirmar-contrasena').value;
    
    console.log('Nueva contraseña:', nuevaContrasena);
    console.log('Confirmar contraseña:', confirmarContrasena);

    // Validar que las contraseñas coincidan
    if (nuevaContrasena !== confirmarContrasena) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Validar longitud mínima
    if (nuevaContrasena.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres');
        return;
    }
    
    // Array para almacenar las promesas
    const promesas = [];

    // Si hay una imagen temporal, agregar la promesa de subirla
    if (window.imagenTemporal) {
        console.log('Hay imagen temporal para subir');
        promesas.push(
            fetch('/user/actualizar-imagen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    imageData: window.imagenTemporal
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
                    console.log('Imagen actualizada correctamente');
                    // Emitir evento de actualización de perfil
                    if (window.socket) {
                        window.socket.emit('perfilActualizado', {
                            tipo: 'imagen',
                            image_profile: data.image_profile
                        });
                    }
                    window.imagenTemporal = null;
                }
            })
        );
    }

    // Si hay una nueva contraseña, agregar la promesa de cambiarla
    if (nuevaContrasena && confirmarContrasena) {
        console.log('Cambiando contraseña');
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
                    console.log('Contraseña actualizada correctamente');
                    // Emitir evento de actualización de perfil
                    if (window.socket) {
                        window.socket.emit('perfilActualizado', {
                            tipo: 'contrasena'
                        });
                    }
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
            console.log('Todas las promesas completadas');
            window.mostrarNotificacion('Cambios guardados correctamente', 'success');
            // Recargar la página después de 1 segundo
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        })
        .catch(error => {
            console.error('Error:', error);
            window.mostrarNotificacion('Error al guardar los cambios: ' + error.message, 'error');
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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, agregando event listeners');
    
    // Agregar event listeners a los botones
    const botones = document.querySelectorAll('[data-action]');
    console.log('Botones encontrados:', botones.length);
    
    botones.forEach(button => {
        console.log('Agregando listener a botón:', button.getAttribute('data-action'));
        button.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón clickeado:', this.getAttribute('data-action'));
            const action = this.getAttribute('data-action');
            if (action === 'guardar') {
                guardarCambios();
            } else if (action === 'cancelar') {
                cancelarCambios();
            }
        });
    });

    // Escuchar eventos de actualización de perfil
    if (window.socket) {
        console.log('Socket disponible, agregando listeners de eventos');
        window.socket.on('perfilActualizado', (data) => {
            console.log('Evento perfilActualizado recibido:', data);
            if (data.tipo === 'imagen' && data.image_profile) {
                // Actualizar imagen de perfil en la página
                const imagePreview = document.getElementById('imagePreview');
                if (imagePreview) {
                    imagePreview.innerHTML = `<img src="${data.image_profile}" alt="Imagen de perfil" style="width: auto; height: auto; object-fit: cover;">`;
                }
            }
        });
    } else {
        console.log('Socket no disponible');
    }
});