document.addEventListener('DOMContentLoaded', function () {
	const loginForm = document.getElementById('loginForm');

	if (loginForm) {
		loginForm.addEventListener('submit', async function (e) {
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
					console.log('Inicio de sesión exitoso');
					window.location.replace('/');
				} else {
					alert(data.mensaje || 'Error al iniciar sesión');
				}
			} catch (error) {
				console.error('Error:', error);
				alert('Error al conectar con el servidor: ' + error.message);
			}
		});
	}
});
