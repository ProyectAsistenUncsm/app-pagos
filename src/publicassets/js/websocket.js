// Importar Socket.IO desde CDN
const socket = io();

// Manejar eventos de conexión
socket.on('connect', () => {
    console.log('Conectado al servidor WebSocket');
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor WebSocket');
});

// Manejar errores de conexión
socket.on('connect_error', (error) => {
    console.error('Error de conexión WebSocket:', error);
});

// Escuchar mensajes
socket.on('mensaje', function(data) {
    console.log('Mensaje recibido:', data);
    // Aquí podrías actualizar el DOM
});

// Enviar mensaje
socket.emit('mensaje', '¡Hola desde el cliente!');

socket.on('nuevoUsuario', (data) => {
    alert(`Nuevo usuario registrado: ${data.nombre}`);
});

socket.on('estadoServicioActualizado', (data) => {
    console.log('Estado actualizado:', data);
    // Actualizá visualmente si querés
    // location.reload() o modificá el DOM
});

// Escuchar evento del servidor
socket.on('servicioActualizado', (data) => {
    const usuarioLogueadoId = parseInt(document.getElementById('correo').value);

    if (data.usuario_id === usuarioLogueadoId) {
        alert(`Tu servicio ha cambiado de estado a: ${data.estado}`);
        // O actualizar DOM:
        // document.querySelector('#estado-servicio').innerText = data.estado;
    }
});

// Hacer el socket disponible globalmente
window.socket = socket;