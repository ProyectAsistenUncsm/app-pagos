// Variables globales
window.contadorNotificaciones = 0;
window.facturasProcesadas = new Set(); // Para llevar un registro de las facturas ya procesadas
window.socket = null; // Variable global para el socket

// Hacer las funciones disponibles globalmente
window.mostrarNotificacion = mostrarNotificacion;
window.TIPOS_NOTIFICACION = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning'
};

// Función para obtener el nombre del servicio por ID
function obtenerNombreServicio(pay_service_id) {
    const servicios = {
        1: 'Enacal',
        2: 'Disnorte-Dissur',
        3: 'INSS'
    };
    return servicios[pay_service_id] || 'Servicio Desconocido';
}

// Función para formatear fecha
function formatearFecha(fecha) {
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Función para actualizar el contador de notificaciones
function actualizarContador() {
    const contador = document.getElementById('notificaciones-total');
    const indicador = document.getElementById('notificaciones-contador');
    if (contador) {
        contador.textContent = window.contadorNotificaciones;
    }
    if (indicador) {
        if (window.contadorNotificaciones > 0) {
            indicador.style.display = 'block';
        } else {
            indicador.style.display = 'none';
        }
    }
}

// Función para obtener el tiempo relativo
function obtenerTiempoRelativo(fecha) {
    const ahora = new Date();
    const diferencia = ahora - new Date(fecha);
    const segundos = Math.floor(diferencia / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (dias > 0) return `Hace ${dias} día${dias > 1 ? 's' : ''}`;
    if (horas > 0) return `Hace ${horas} hora${horas > 1 ? 's' : ''}`;
    if (minutos > 0) return `Hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
    return 'Hace un momento';
}

// Función para obtener el icono según el tipo
function obtenerIconoNavbar(tipo) {
    const iconos = {
        [window.TIPOS_NOTIFICACION.SUCCESS]: 'bitcoin-icons:verify-outline',
        [window.TIPOS_NOTIFICACION.ERROR]: 'mdi:alert-circle',
        [window.TIPOS_NOTIFICACION.INFO]: 'mdi:information',
        [window.TIPOS_NOTIFICACION.WARNING]: 'mdi:alert'
    };
    return iconos[tipo] || iconos[window.TIPOS_NOTIFICACION.INFO];
}

// Función para obtener la clase de color según el tipo
function obtenerClaseColor(tipo) {
    const clases = {
        [window.TIPOS_NOTIFICACION.SUCCESS]: 'success',
        [window.TIPOS_NOTIFICACION.ERROR]: 'danger',
        [window.TIPOS_NOTIFICACION.INFO]: 'info',
        [window.TIPOS_NOTIFICACION.WARNING]: 'warning'
    };
    return clases[tipo] || clases[window.TIPOS_NOTIFICACION.INFO];
}

// Función para mostrar notificación en el navbar
function mostrarNotificacionNavbar(titulo, mensaje, tipo = window.TIPOS_NOTIFICACION.INFO) {
    const notificacion = document.createElement('a');
    notificacion.href = 'javascript:void(0)';
    notificacion.className = 'px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between';
    
    const colorClase = obtenerClaseColor(tipo);
    const icono = obtenerIconoNavbar(tipo);
    
    notificacion.innerHTML = `
        <div class="text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3">
            <span class="w-44-px h-44-px bg-${colorClase}-subtle text-${colorClase}-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0">
                <iconify-icon icon="${icono}" class="icon text-xxl"></iconify-icon>
            </span>
            <div>
                <h6 class="text-md fw-semibold mb-4">${titulo}</h6>
                <p class="mb-0 text-sm text-secondary-light text-w-200-px">${mensaje}</p>
            </div>
        </div>
        <span class="text-sm text-secondary-light flex-shrink-0">${obtenerTiempoRelativo(new Date())}</span>
    `;

    const contenedor = document.getElementById('notificaciones-contenedor');
    if (contenedor) {
        contenedor.insertBefore(notificacion, contenedor.firstChild);
        window.contadorNotificaciones++;
        actualizarContador();
    }
}

// Función para mostrar notificación en la página de notificaciones
function mostrarNotificacionPagina(titulo, mensaje, tipo = window.TIPOS_NOTIFICACION.INFO) {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    const colorClase = obtenerClaseColor(tipo);
    const icono = obtenerIconoNavbar(tipo);
    
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <div class="notificacion-icono">
                <iconify-icon icon="${icono}" class="text-${colorClase}"></iconify-icon>
            </div>
            <div class="notificacion-texto">
                <h4>${titulo}</h4>
                <p>${mensaje}</p>
            </div>
        </div>
        <button class="cerrar-notificacion" onclick="this.parentElement.remove()">&times;</button>
    `;

    const contenedor = document.getElementById('notificaciones');
    if (contenedor) {
        contenedor.insertBefore(notificacion, contenedor.firstChild);
    }
}

// Función para mostrar notificación (unifica ambas funciones)
function mostrarNotificacion(titulo, mensaje, tipo = window.TIPOS_NOTIFICACION.INFO) {
    mostrarNotificacionNavbar(titulo, mensaje, tipo);
    mostrarNotificacionPagina(titulo, mensaje, tipo);
}

// Función para consultar facturas y mostrar notificaciones
async function consultarFacturas() {
    try {
        // Verificar si estamos en la página de perfil
        const esPaginaPerfil = window.location.pathname.includes('/perfil');
        if (esPaginaPerfil) {
            return; // No mostrar notificaciones en la página de perfil
        }

        const response = await fetch('/service/notification/facturas');
        const data = await response.json();
        
        if (data.success && data.facturas) {
            // Procesar todas las facturas
            data.facturas.forEach(factura => {
                // Verificar si la factura ya fue procesada
                if (!window.facturasProcesadas.has(factura.id)) {
                    const nombreServicio = obtenerNombreServicio(factura.pay_service_id);
                    const fechaEmision = formatearFecha(factura.fecha_emision);
                    const fechaVencimiento = formatearFecha(factura.fecha_vencimiento);
                    
                    if (factura.estado === 'pendiente') {
                        mostrarNotificacion(
                            'Nueva Factura Generada',
                            `Se ha generado una nueva factura para ${nombreServicio} por un monto de $${factura.monto}. Fecha de vencimiento: ${fechaVencimiento}`,
                            window.TIPOS_NOTIFICACION.INFO
                        );
                    } else if (factura.estado === 'pagado') {
                        mostrarNotificacion(
                            'Pago Realizado',
                            `Se ha procesado el pago de $${factura.monto} para ${nombreServicio}. Fecha de emisión: ${fechaEmision}`,
                            window.TIPOS_NOTIFICACION.SUCCESS
                        );
                    }
                    // Marcar la factura como procesada
                    window.facturasProcesadas.add(factura.id);
                }
            });

            // Actualizar el contador de notificaciones
            window.contadorNotificaciones = data.facturas.length;
            actualizarContador();
        }
    } catch (error) {
        console.error('Error al consultar facturas:', error);
    }
}

// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar socket.io solo si no existe una conexión
    if (typeof io !== 'undefined' && !window.socket) {
        window.socket = io({
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        const notificacionesPagos = document.getElementById('notificacionesPagos');
        const notificacionesServicios = document.getElementById('notificacionesServicios');
        const esPaginaPerfil = window.location.pathname.includes('/perfil');

        // Cargar preferencias guardadas
        if (notificacionesPagos) {
            notificacionesPagos.checked = localStorage.getItem('notificacionesPagos') !== 'false';
            notificacionesPagos.addEventListener('change', function() {
                localStorage.setItem('notificacionesPagos', this.checked);
            });
        }

        if (notificacionesServicios) {
            notificacionesServicios.checked = localStorage.getItem('notificacionesServicios') !== 'false';
            notificacionesServicios.addEventListener('change', function() {
                localStorage.setItem('notificacionesServicios', this.checked);
            });
        }

        // Escuchar eventos de pago
        window.socket.on('pagoRealizado', (data) => {
            if (!esPaginaPerfil && (!notificacionesPagos || notificacionesPagos.checked)) {
                mostrarNotificacion(
                    'Pago Exitoso',
                    `Se ha procesado tu pago de $${data.monto} para el servicio ${data.servicio_nombre}`,
                    window.TIPOS_NOTIFICACION.SUCCESS
                );
            }
        });

        window.socket.on('pagoFallido', (data) => {
            if (!esPaginaPerfil && (!notificacionesPagos || notificacionesPagos.checked)) {
                mostrarNotificacion(
                    'Error en el Pago',
                    `No se pudo procesar tu pago: ${data.mensaje}`,
                    window.TIPOS_NOTIFICACION.ERROR
                );
            }
        });

        // Escuchar eventos de facturas
        window.socket.on('nuevaFactura', (data) => {
            if (!esPaginaPerfil && (!notificacionesServicios || notificacionesServicios.checked)) {
                mostrarNotificacion(
                    'Nueva Factura',
                    `Se ha generado una nueva factura para ${data.servicio_nombre} por un monto de $${data.monto}`,
                    window.TIPOS_NOTIFICACION.INFO
                );
            }
        });

        // Escuchar eventos de servicio
        window.socket.on('servicioActualizado', (data) => {
            if (!esPaginaPerfil && (!notificacionesServicios || notificacionesServicios.checked)) {
                mostrarNotificacion(
                    'Estado de Servicio Actualizado',
                    `El servicio ${data.servicio_nombre} ha cambiado a ${data.estado}`,
                    window.TIPOS_NOTIFICACION.INFO
                );
            }
        });

        window.socket.on('servicioVinculado', (data) => {
            if (!esPaginaPerfil && (!notificacionesServicios || notificacionesServicios.checked)) {
                mostrarNotificacion(
                    'Servicio Vinculado',
                    `Has vinculado exitosamente el servicio ${data.servicio_nombre}`,
                    window.TIPOS_NOTIFICACION.SUCCESS
                );
            }
        });

        window.socket.on('servicioDesvinculado', (data) => {
            if (!esPaginaPerfil && (!notificacionesServicios || notificacionesServicios.checked)) {
                mostrarNotificacion(
                    'Servicio Desvinculado',
                    `Has desvinculado el servicio ${data.servicio_nombre}`,
                    window.TIPOS_NOTIFICACION.WARNING
                );
            }
        });
    }

    // Consultar facturas inicialmente solo si no estamos en la página de perfil
    if (!window.location.pathname.includes('/perfil')) {
        consultarFacturas();
    }
});

// Consultar facturas cada 30 segundos solo si no estamos en la página de perfil
if (!window.location.pathname.includes('/perfil')) {
    setInterval(consultarFacturas, 30000);
}