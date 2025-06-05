document.addEventListener('DOMContentLoaded', function() {
	const loginForm = document.getElementById('loginForm');
	
	if (loginForm) {
		loginForm.addEventListener('submit', async function(e) {
			e.preventDefault();
			
			const formData = {
				correo: document.getElementById('correo').value,
				contrasena: document.getElementById('password').value
			};

			try {
				const response = await fetch('/auth/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(formData)
				});

				const data = await response.json();

				if (response.ok) {
					console.log('Login exitoso');
					// Guardar el token en localStorage
                    //localStorage.setItem('token', data.token);
                    // Guardar información del usuario
                   // localStorage.setItem('user', JSON.stringify(data.usuario));
                    // Redirigir a la página principal
                    //setTimeout(() => {
                       // window.location.href = '/';
                    //}, 100);
					window.location.href = '/';
				} else {
					alert(data.mensaje || 'Error al iniciar sesión');
				}
			} catch (error) {
				console.error('Error:', error);
				alert('Error al conectar con el servidor');
			}
		});
	}
});

