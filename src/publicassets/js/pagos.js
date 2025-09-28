// Función para mostrar notificaciones
function mostrarNotificacion(titulo, mensaje, tipo) {
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${tipo === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <strong>${titulo}</strong><br>
                ${mensaje}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

// Manejador del formulario de pago
document.getElementById('formPago').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
    }

    const btnPagar = document.getElementById('btnPagar');
    btnPagar.disabled = true;
    btnPagar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Procesando...';
    
    const formData = new FormData(form);
    const datos = Object.fromEntries(formData.entries());

    // Preparar datos bancarios
    const datos_bancarios = {
        numero_tarjeta: datos.numero_tarjeta,
        vencimiento: datos.vencimiento,
        cvv: datos.cvv,
        nombre_tarjeta: datos.nombre_tarjeta
    };

    try {
        const response = await fetch('/pay/realizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                pay_service_id: datos.pay_service_id,
                monto: datos.monto,
                datos_bancarios
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Mostrar notificación de éxito
            mostrarNotificacion(
                'Pago Exitoso',
                'Tu pago ha sido procesado correctamente',
                'success'
            );
            
            // Redirigir al index después de 2 segundos
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            throw new Error(data.mensaje || 'Error al procesar el pago');
        }
    } catch (error) {
        mostrarNotificacion(
            'Error en el Pago',
            error.message,
            'error'
        );
        btnPagar.disabled = false;
        btnPagar.innerHTML = 'Realizar Pago';
    }
});
