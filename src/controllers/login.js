console.clear();

document.getElementById('loginForm').addEventListener('submit', async (e) => {
	e.preventDefault();
	
	const email = document.getElementById('email').value;
	const contrasena = document.getElementById('password').value;

	try {
		const response = await fetch('/api/usuarios/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ email, contrasena })
		});

		const data = await response.json();

		if (response.ok) {
			// Guardar el token en localStorage
			localStorage.setItem('token', data.token);
			// Redirigir al dashboard o página principal
			window.location.href = '/';
		} else {
			alert(data.mensaje || 'Error al iniciar sesión');
		}
	} catch (error) {
		console.error('Error:', error);
		alert('Error al iniciar sesión');
	}
});

