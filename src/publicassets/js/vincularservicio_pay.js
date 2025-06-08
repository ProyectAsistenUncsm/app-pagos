document.addEventListener('DOMContentLoaded', function() {
    const vincularForm = document.getElementById('vincularForm');
    const confirmarForm = document.getElementById('confirmarForm');
    const facturaInfo = document.getElementById('facturaInfo');
    const confirmarSection = document.getElementById('confirmarSection');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    if (vincularForm) {
        vincularForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulario de vinculación enviado');
            
            const formData = new FormData(this);
            const data = {
                pay_service_id: formData.get('pay_service_id'),
                numero_cuenta: formData.get('numero_cuenta')
            };

            console.log('Datos a enviar:', data);

            try {
                const response = await fetch('/user/vincular-servicio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });

                console.log('Respuesta recibida:', response);

                const result = await response.json();
                console.log('Datos de respuesta:', result);

                if (result.success) {
                    facturaInfo.innerHTML = `
                        <div class="alert alert-info">
                            <h4>Factura encontrada</h4>
                            <p>Servicio: ${result.factura.PayService.nombre}</p>
                            <p>Número de cuenta: ${result.factura.numero_cuenta}</p>
                            <p>Monto: ${result.factura.monto}</p>
                        </div>
                    `;
                    confirmarSection.style.display = 'block';
                    errorMessage.style.display = 'none';
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
                        Error al procesar la solicitud
                    </div>
                `;
                confirmarSection.style.display = 'none';
            }
        });
    }

    if (confirmarForm) {
        confirmarForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulario de confirmación enviado');
            
            const formData = new FormData(this);
            const data = {
                pay_service_id: formData.get('pay_service_id'),
                numero_cuenta: formData.get('numero_cuenta')
            };

            console.log('Datos a enviar:', data);

            try {
                const response = await fetch('/users/confirmar-vinculacion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(data)
                });

                console.log('Respuesta recibida:', response);

                const result = await response.json();
                console.log('Datos de respuesta:', result);

                if (result.success) {
                    successMessage.textContent = result.mensaje;
                    successMessage.style.display = 'block';
                    errorMessage.style.display = 'none';
                    confirmarSection.style.display = 'none';
                    vincularForm.reset();
                    facturaInfo.innerHTML = '';
                } else {
                    errorMessage.textContent = result.mensaje;
                    errorMessage.style.display = 'block';
                    successMessage.style.display = 'none';
                }
            } catch (error) {
                console.error('Error:', error);
                errorMessage.textContent = 'Error al procesar la solicitud';
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
            }
        });
    }
});