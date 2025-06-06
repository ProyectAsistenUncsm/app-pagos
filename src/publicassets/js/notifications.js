// Importar socket desde websocket.js
import socket from './websocket.js';

// Tipos de notificaciones
const TIPOS_NOTIFICACION = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

// Función para mostrar notificación
function mostrarNotificacion(titulo, mensaje, tipo = TIPOS_NOTIFICACION.INFO) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    // Agregar icono según el tipo
    const icono = obtenerIconoPorTipo(tipo);
    
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <div class="notificacion-icono">${icono}</div>
            <div class="notificacion-texto">
                <h4>${titulo}</h4>
                <p>${mensaje}</p>
            </div>
        </div>
        <button class="cerrar-notificacion">&times;</button>
    `;

    // Agregar al contenedor de notificaciones
    const contenedor = document.getElementById('notificaciones') || crearContenedorNotificaciones();
    contenedor.appendChild(notificacion);

    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        notificacion.classList.add('cerrando');
        setTimeout(() => notificacion.remove(), 300);
    }, 5000);

    // Botón de cerrar
    notificacion.querySelector('.cerrar-notificacion').onclick = () => {
        notificacion.classList.add('cerrando');
        setTimeout(() => notificacion.remove(), 300);
    };
}

// Obtener icono según el tipo de notificación
function obtenerIconoPorTipo(tipo) {
    const iconos = {
        [TIPOS_NOTIFICACION.SUCCESS]: '<iconify-icon icon="mdi:check-circle" class="text-success"></iconify-icon>',
        [TIPOS_NOTIFICACION.ERROR]: '<iconify-icon icon="mdi:alert-circle" class="text-danger"></iconify-icon>',
        [TIPOS_NOTIFICACION.INFO]: '<iconify-icon icon="mdi:information" class="text-info"></iconify-icon>',
        [TIPOS_NOTIFICACION.WARNING]: '<iconify-icon icon="mdi:alert" class="text-warning"></iconify-icon>'
    };
    return iconos[tipo] || iconos[TIPOS_NOTIFICACION.INFO];
}

// Crear contenedor de notificaciones si no existe
function crearContenedorNotificaciones() {
    const contenedor = document.createElement('div');
    contenedor.id = 'notificaciones';
    contenedor.className = 'notificaciones-contenedor';
    document.body.appendChild(contenedor);
    return contenedor;
}

// Escuchar eventos de pago
socket.on('pagoRealizado', (data) => {
    mostrarNotificacion(
        'Pago Exitoso',
        `Se ha procesado tu pago de $${data.monto} para el servicio ${data.servicio_nombre}`,
        TIPOS_NOTIFICACION.SUCCESS
    );
});

socket.on('pagoFallido', (data) => {
    mostrarNotificacion(
        'Error en el Pago',
        `No se pudo procesar tu pago: ${data.mensaje}`,
        TIPOS_NOTIFICACION.ERROR
    );
});

// Escuchar eventos de servicio
socket.on('servicioActualizado', (data) => {
    mostrarNotificacion(
        'Estado de Servicio Actualizado',
        `El servicio ${data.servicio_nombre} ha cambiado a ${data.estado}`,
        TIPOS_NOTIFICACION.INFO
    );
});

socket.on('servicioVinculado', (data) => {
    mostrarNotificacion(
        'Servicio Vinculado',
        `Has vinculado exitosamente el servicio ${data.servicio_nombre}`,
        TIPOS_NOTIFICACION.SUCCESS
    );
});

socket.on('servicioDesvinculado', (data) => {
    mostrarNotificacion(
        'Servicio Desvinculado',
        `Has desvinculado el servicio ${data.servicio_nombre}`,
        TIPOS_NOTIFICACION.WARNING
    );
});

// Exportar funciones para uso en otros archivos
export { mostrarNotificacion, TIPOS_NOTIFICACION };
