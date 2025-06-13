document.addEventListener('DOMContentLoaded', function () {
	const loginForm = document.getElementById('loginForm');

	if (loginForm) {
		loginForm.addEventListener('submit', async function (e) {
			e.preventDefault();

			const formData = {
				correo: document.getElementById('correo').value,
				contrasena: document.getElementById('password').value,
				recordar: document.getElementById('rememberMe').checked
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

		// Lógica para mostrar/ocultar contraseña
		const togglePassword = document.getElementById('togglePassword');
		const passwordInput = document.getElementById('password');

		if (togglePassword && passwordInput) {
			togglePassword.addEventListener('click', function () {
				const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
				passwordInput.setAttribute('type', type);
				// Cambiar el icono del ojo
				this.querySelector('i').classList.toggle('fa-eye');
				this.querySelector('i').classList.toggle('fa-eye-slash');
			});
		}
	}
});
