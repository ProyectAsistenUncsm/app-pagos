document.addEventListener('DOMContentLoaded', function() {
    const adminForm = document.getElementById('adminForm');
    const adminTable = document.getElementById('adminTable');

    // Cargar lista de administradores
    cargarAdministradores();

    // Manejar envío del formulario
    adminForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = {
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            contrasena: document.getElementById('contrasena').value,
            confirmarContrasena: document.getElementById('confirmarContrasena').value,
            telefono: document.getElementById('telefono').value,
            cedula: document.getElementById('cedula').value,
            rol_id: 1 // Siempre será administrador
        };

        try {
            const response = await fetch('/admin/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
                credentials: 'include' // Incluir cookies en la petición
            });

            const data = await response.json();

            if (response.ok) {
                mostrarNotificacion('Éxito', 'Administrador creado correctamente', 'success');
                adminForm.reset();
                cargarAdministradores();
            } else {
                throw new Error(data.mensaje || 'Error al crear el administrador');
            }
        } catch (error) {
            mostrarNotificacion('Error', error.message, 'error');
        }
    });

    // Función para cargar la lista de administradores
    async function cargarAdministradores() {
        try {
            const response = await fetch('/admin/api/usuarios', {
                credentials: 'include' // Incluir cookies en la petición
            });
            const data = await response.json();

            if (response.ok) {
                const tbody = adminTable.querySelector('tbody');
                tbody.innerHTML = '';

                data.usuarios.forEach(usuario => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${usuario.nombre}</td>
                        <td>${usuario.correo}</td>
                        <td>${usuario.telefono || '-'}</td>
                        <td>${usuario.cedula || '-'}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" onclick="eliminarUsuario(${usuario.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                throw new Error(data.mensaje || 'Error al cargar los administradores');
            }
        } catch (error) {
            mostrarNotificacion('Error', error.message, 'error');
        }
    }

    // Función para eliminar usuario
    window.eliminarUsuario = async function(id) {
        if (!confirm('¿Está seguro de eliminar este administrador?')) {
            return;
        }

        try {
            const response = await fetch(`/admin/api/usuarios/${id}`, {
                method: 'DELETE',
                credentials: 'include' // Incluir cookies en la petición
            });

            const data = await response.json();

            if (response.ok) {
                mostrarNotificacion('Éxito', 'Administrador eliminado correctamente', 'success');
                cargarAdministradores();
            } else {
                throw new Error(data.mensaje || 'Error al eliminar el administrador');
            }
        } catch (error) {
            mostrarNotificacion('Error', error.message, 'error');
        }
    };

    // Función para mostrar notificaciones
    function mostrarNotificacion(titulo, mensaje, tipo) {
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${tipo} border-0`;
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
}); 