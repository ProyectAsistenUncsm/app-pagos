document.addEventListener('DOMContentLoaded', function() {
    const vincularForm = document.getElementById('vincularServicioForm');
    const facturaInfo = document.getElementById('facturaInfo');
    const confirmarSection = document.getElementById('confirmarSection');
    const facturasList = document.getElementById('facturasList');
    const guardarServicio = document.getElementById('guardarServicio');
    const confirmarVinculacion = document.getElementById('confirmarVinculacion');
    const modal = document.getElementById('vincularServicioModal');

    // Función para manejar errores de respuesta
    const handleResponseError = async (response) => {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            throw new Error(errorData.mensaje || 'Error en la solicitud');
        }
        throw new Error('Error en la solicitud');
    };

    // Cargar servicios vinculados y facturas
    const cargarDatos = async () => {
        try {
            const response = await fetch('/user/perfil', {
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include'
            });
            
            if (!response.ok) {
                await handleResponseError(response);
            }

            const data = await response.json();
            
            if (data.success) {
                // Filtrar solo las facturas pendientes
                const facturasPendientes = data.facturas ? data.facturas.filter(factura => factura.estado === 'pendiente') : [];
                
                if (!facturasPendientes || facturasPendientes.length === 0) {
                    facturasList.innerHTML = `
                        <div class="alert alert-info">
                            No tienes facturas pendientes. Haz clic en "Vincular Nuevo Servicio" para crear una nueva factura.
                        </div>
                    `;
                } else {
                    facturasList.innerHTML = facturasPendientes.map(factura => `
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${factura.PayService.nombre}</h5>
                                <p class="card-text">
                                    <strong>ID:</strong> ${factura.id}<br>
                                    <strong>Monto:</strong> $${factura.monto}<br>
                                    <strong>Estado:</strong> ${factura.estado}<br>
                                    <strong>Fecha de Emisión:</strong> ${new Date(factura.fecha_emision).toLocaleDateString()}<br>
                                    <strong>Fecha de Vencimiento:</strong> ${new Date(factura.fecha_vencimiento).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    `).join('');
                }
            } else {
                throw new Error(data.mensaje || 'Error al cargar los datos');
            }
        } catch (error) {
            console.error('Error al cargar datos:', error);
            if (facturasList) {
                facturasList.innerHTML = `
                    <div class="alert alert-danger">
                        ${error.message || 'Error al cargar las facturas. Por favor, intente nuevamente.'}
                    </div>
                `;
            }
        }
    };

    // Cargar datos iniciales
    cargarDatos();

    if (guardarServicio) {
        guardarServicio.addEventListener('click', async function() {
            const servicio = document.getElementById('servicio').value;
            const numeroFactura = document.getElementById('numeroFactura').value;

            if (!servicio || !numeroFactura) {
                alert('Por favor, complete todos los campos');
                return;
            }

            try {
                const response = await fetch('/user/crear-factura', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        pay_service_id: servicio,
                        numero_cuenta: numeroFactura
                    })
                });

                if (!response.ok) {
                    await handleResponseError(response);
                }

                const result = await response.json();

                if (result.success) {
                    facturaInfo.innerHTML = `
                        <div class="alert alert-info">
                            <h4>Nueva Factura Creada</h4>
                            <p>Servicio: ${result.factura.PayService.nombre}</p>
                            <p>Número de cuenta: ${result.factura.numero_cuenta}</p>
                            <p>Monto: $${result.factura.monto}</p>
                            <p>Fecha de vencimiento: ${new Date(result.factura.fecha_vencimiento).toLocaleDateString()}</p>
                        </div>
                    `;
                    confirmarSection.style.display = 'block';
                    guardarServicio.style.display = 'none';
                } else {
                    facturaInfo.innerHTML = `
                        <div class="alert alert-warning">
                            ${result.mensaje}
                        </div>
                    `;
                    confirmarSection.style.display = 'none';
                }
            } catch (error) {
                console.error('Error:', error);
                facturaInfo.innerHTML = `
                    <div class="alert alert-danger">
                        ${error.message || 'Error al procesar la solicitud'}
                    </div>
                `;
                confirmarSection.style.display = 'none';
            }
        });
    }

    if (confirmarVinculacion) {
        confirmarVinculacion.addEventListener('click', async function() {
            try {
                const response = await fetch('/user/confirmar-factura', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });

                if (!response.ok) {
                    await handleResponseError(response);
                }

                const result = await response.json();

                if (result.success) {
                    //alert(result.mensaje);
                    // Cerrar el modal
                    const modalInstance = bootstrap.Modal.getInstance(modal);
                    modalInstance.hide();
                    // Recargar los datos
                    cargarDatos();
                } else {
                    alert(result.mensaje || 'Error al crear la factura');
                }
            } catch (error) {
                console.error('Error:', error);
                alert(error.message || 'Error al procesar la solicitud');
            }
        });
    }
});