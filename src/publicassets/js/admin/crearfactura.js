document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('facturaForm');
    const servicioSelect = document.getElementById('pay_service_id');
    const servicioDescripcion = document.getElementById('servicioDescripcion');
    const idFacturaPreview = document.getElementById('idFacturaPreview');
    
    // Función para generar vista previa del ID de factura
    const generarVistaPreviaId = () => {
        const fecha = new Date();
        const año = fecha.getFullYear().toString().slice(-2);
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        const servicioId = servicioSelect.value || 'X';
        
        return `${año}${mes}${dia}-${servicioId}-XXX`;
    };
    
    // Mostrar descripción del servicio seleccionado y actualizar vista previa del ID
    servicioSelect.addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const descripcion = selectedOption.getAttribute('data-descripcion');
        servicioDescripcion.textContent = descripcion || '';
        
        // Actualizar vista previa del ID
        if (this.value) {
            idFacturaPreview.textContent = generarVistaPreviaId();
        } else {
            idFacturaPreview.textContent = 'Se generará automáticamente al crear la factura';
        }
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            const response = await fetch('/admin/facturas/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                alert(`Factura creada exitosamente\nID de Factura: ${result.factura.id_factura}`);
                window.location.href = '/admin/';
            } else {
                alert('Error al crear la factura: ' + result.mensaje);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al crear la factura');
        }
    });
});