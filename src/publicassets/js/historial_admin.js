document.addEventListener('DOMContentLoaded', function() {
    // Función para filtrar la tabla
    function filtrarTabla() {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const servicio = document.getElementById('servicio').value;
        
        const filas = document.querySelectorAll('tbody tr');
        let hayResultados = false;
        
        filas.forEach(fila => {
            if (!fila.cells || fila.cells.length < 2) return;

            try {
                const fecha = new Date(fila.cells[0].textContent);
                const servicioFila = fila.cells[2].textContent.trim(); // Índice 2 porque es la columna de servicio
                
                let mostrar = true;
                
                // Filtro por fecha inicio
                if (fechaInicio) {
                    const fechaInicioObj = new Date(fechaInicio);
                    fechaInicioObj.setHours(0, 0, 0, 0);
                    if (fecha < fechaInicioObj) mostrar = false;
                }
                
                // Filtro por fecha fin
                if (fechaFin) {
                    const fechaFinObj = new Date(fechaFin);
                    fechaFinObj.setHours(23, 59, 59, 999);
                    if (fecha > fechaFinObj) mostrar = false;
                }
                
                // Filtro por servicio
                if (servicio) {
                    const nombreServicio = obtenerNombreServicio(servicio);
                    console.log('Servicio seleccionado:', nombreServicio);
                    console.log('Servicio en fila:', servicioFila);
                    
                    // Comparación exacta
                    if (servicioFila !== nombreServicio) {
                        mostrar = false;
                    }
                }
                
                fila.style.display = mostrar ? '' : 'none';
                if (mostrar) hayResultados = true;
            } catch (error) {
                console.error('Error al procesar fila:', error);
                fila.style.display = 'none';
            }
        });

        // Mostrar mensaje si no hay resultados
        const mensajeNoResultados = document.getElementById('mensajeNoResultados');
        if (!hayResultados) {
            if (!mensajeNoResultados) {
                const mensaje = document.createElement('tr');
                mensaje.id = 'mensajeNoResultados';
                mensaje.innerHTML = '<td colspan="7" class="text-center">No se encontraron pagos con los filtros seleccionados</td>';
                document.querySelector('tbody').appendChild(mensaje);
            }
        } else if (mensajeNoResultados) {
            mensajeNoResultados.remove();
        }
    }
    
    // Función para obtener el nombre del servicio
    function obtenerNombreServicio(id) {
        const servicios = {
            '1': 'Enacal',
            '2': 'Dissnorte-Disur',
            '3': 'INSS'
        };
        return servicios[id] || '';
    }
    
    // Agregar event listeners a los filtros
    document.getElementById('fechaInicio').addEventListener('change', filtrarTabla);
    document.getElementById('fechaFin').addEventListener('change', filtrarTabla);
    document.getElementById('servicio').addEventListener('change', filtrarTabla);
    document.getElementById('limpiarFiltros').addEventListener('click', () => {
        document.getElementById('fechaInicio').value = '';
        document.getElementById('fechaFin').value = '';
        document.getElementById('servicio').value = '';
        filtrarTabla();
    });
});