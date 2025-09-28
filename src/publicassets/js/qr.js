// Crear elemento de video
const video = document.createElement("video");

// Obtener el canvas donde se mostrará el QR
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

// Div donde llegará nuestro canvas
const btnScanQR = document.getElementById("btn-scan-qr");

// Obtener botones de encender y apagar cámara usando clases
const btnopen_camera = document.querySelector('.btn-success'); // Botón para encender la cámara
const btnApagarCamara = document.querySelector('.btn-danger');   // Botón para apagar la cámara

// Lectura desactivada
let scanning = false;

// Recomiendo usar un objeto para manejar el estado
const scannerState = {
  isScanning: false,
  selectedCamera: null,
  stream: null
};

const ShowErrorMessage = (mensaje, error = null) => {
  console.error(mensaje, error);
  // Usar un sistema de notificaciones más moderno
  // Por ejemplo, toastify o sweet alert
  Swal.fire({
    icon: 'error',
    title: 'Error',
    text: mensaje
  });
};

// Función para solicitar permiso de cámara
const Camera_Request = async () => {
  try {
    const result = await Swal.fire({
      title: '¿Permitir acceso a la cámara?',
      text: 'Necesitamos acceder a tu cámara para escanear códigos QR',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Permitir',
      cancelButtonText: 'Denegar'
    });

    if (result.isConfirmed) {
      return true;
    } else {
      Swal.fire({
        title: 'Acceso denegado',
        text: 'No podrás escanear códigos QR sin acceso a la cámara',
        icon: 'info'
      });
      return false;
    }
  } catch (error) {
    ShowErrorMessage("Error al solicitar permiso de cámara", error);
    return false;
  }
};

// Función para enumerar dispositivos y obtener cámaras disponibles
const cameras_availables = async () => {
  try {
    const dispositivos = await navigator.mediaDevices.enumerateDevices();
    const camaras = dispositivos.filter(dispositivo => dispositivo.kind === 'videoinput');
    
    if (camaras.length === 0) {
      ShowErrorMessage('No se encontraron cámaras en el dispositivo');
      return [];
    }

    // Buscar específicamente la cámara trasera
    const camaraTrasera = camaras.find(camara => 
      camara.label.toLowerCase().includes('back') || 
      camara.label.toLowerCase().includes('trasera') ||
      camara.label.toLowerCase().includes('environment')
    );

    // Si no se encuentra la cámara trasera, usar la última cámara (que suele ser la trasera)
    return camaraTrasera || camaras[camaras.length - 1];
  } catch (error) {
    ShowErrorMessage('Error al obtener dispositivos de video', error);
    return [];
  }
};

// Función para configurar el stream
const Stream_settings = async (deviceId) => {
  try {
    // Primero verificamos si el navegador soporta mediaDevices
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Tu navegador no soporta el acceso a la cámara');
    }

    // Configuración más detallada para la cámara
    const constraints = {
      video: {
        facingMode: 'environment', // Intentar usar la cámara trasera primero
        width: { ideal: 520 },
        height: { ideal: 520 },
        deviceId: deviceId ? { exact: deviceId } : undefined
      }
    };
    
    // Intentar obtener el stream
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    
    // Si llegamos aquí, el stream se obtuvo correctamente
    scannerState.stream = stream;
    scannerState.isScanning = true;
    scanning = true;

    // Ocultar botones de encender y apagar cámara
    btnopen_camera.hidden = true; // Ocultar botón de encender cámara
    btnApagarCamara.hidden = true;   // Ocultar botón de apagar cámara

    return stream; // Devolver el stream obtenido

  } catch (error) {
    console.error('Error detallado:', error);
    
    // Manejo específico de errores
    if (error.name === 'NotAllowedError') {
      ShowErrorMessage('Permiso denegado. Por favor, permite el acceso a la cámara.');
    } else if (error.name === 'NotFoundError') {
      ShowErrorMessage('No se encontró ninguna cámara disponible.');
    } else if (error.name === 'NotReadableError') {
      ShowErrorMessage('La cámara está en uso por otra aplicación.');
    } else if (error.name === 'OverconstrainedError') {
      // Si fallan las restricciones, intentar con configuración más básica
      return Stream_settings(null);
    } else {
      ShowErrorMessage(`Error al iniciar la cámara: ${error.message}`);
    }
    throw error;
  }
};



// Función para reproducir video
const play_video = async (stream) => {
  // Configurar el video
  video.setAttribute("playsinline", true); // Importante para iOS
  video.setAttribute("autoplay", true);
  video.srcObject = stream;

  // Esperar a que el video esté listo
  return new Promise((resolve) => {
    video.onloadedmetadata = async () => {
      try {
        await video.play();
        tick();
        scan();
        resolve();
      } catch (playError) {
        console.error('Error al iniciar el stream:', error);
        ShowErrorMessage("Error al reproducir el video", playError);
      }
    };
  });
};

// Función principal que combina ambas
const StreamStart = async (deviceId) => {
  const stream = await Stream_settings(deviceId);
  await play_video(stream);
};

// Función para encender la cámara
const open_camera = async (tipoDeCamara = "environment") => {
  try {
    const permisoConcedido = await Camera_Request();
    
    if (!permisoConcedido) {
      return;
    }

    const camaraTrasera = await cameras_availables(); // Obtener cámara trasera
    if (!camaraTrasera) {
      ShowErrorMessage('No se encontró una cámara trasera disponible');
      return;
    }

    // Llamar a StreamStart con la cámara trasera
    await StreamStart(camaraTrasera.deviceId);

    btnScanQR.hidden = true;
    canvasElement.hidden = false;

  } catch (error) {
    console.error('Error específico:', error);
    
    if (error.name === 'NotAllowedError') {
      ShowErrorMessage('Permiso de cámara denegado. Por favor, permite el acceso a la cámara.');
    } else if (error.name === 'NotFoundError') {
      ShowErrorMessage('No se encontró ninguna cámara. Por favor, asegúrate de que tu dispositivo tiene una cámara.');
    } else if (error.name === 'NotReadableError') {
      ShowErrorMessage('La cámara está en uso por otra aplicación.');
    } else {
      ShowErrorMessage(`Error al acceder a la cámara: ${error.message}`);
    }
  }
};

// Apagar la cámara y detener el stream
const close_camera = () => {
  scanning = false;
  scannerState.isScanning = false;

  if (scannerState.stream) {
      scannerState.stream.getTracks().forEach(track => {
          track.stop();
      });
      scannerState.stream = null;
  }

  if (video.srcObject) {
      video.srcObject = null;
  }

  // Restaurar elementos UI
  if (btnScanQR) btnScanQR.hidden = false;
  if (canvasElement) canvasElement.hidden = true;
};

// Función para escanear el código QR
function scan() {
  if (!scanning) return;

  try {
    qrcode.decode(); // Intentamos decodificar el código QR
  } catch (error) {
    // Mostramos un mensaje si ocurre un error específico
    console.warn("No se pudo leer el QR, intentando nuevamente...", error);
  } finally {
    // Intentamos nuevamente después de un breve intervalo
    setTimeout(scan, 300);
  }
}

function tick() {
  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
  }

  if (scanning) {
    requestAnimationFrame(tick); // Continuamos el ciclo de actualización
  }
}

// activate_user sonido cuando se escanea el código QR
const activate_Sonido = () => {
  const audio = document.getElementById('audioScaner');
  if (audio) {
    audio.play();
  }
}

// Función para extraer los últimos 9 caracteres
const last_9_character = (texto) => {
  return texto.slice(-9);
};

// Modificamos el callback del QR
qrcode.callback = (response) => {
  if (response) {
    const last9 = last_9_character(response);
    
    // Mostrar notificación con la respuesta completa y los últimos 9 caracteres separados
    Swal.fire({
      title: 'Código QR escaneado',
      html: `
        <p><strong>Respuesta completa:</strong> ${response}</p>
        <p><strong>Id del usuario:</strong> ${last9}</p>
      `,
      icon: 'success'
    });
    
    show(response); // Mantiene la función original por si la necesitas
    activate_Sonido();
    close_camera();
  }
};

// Función para registrar la asistencia
function registrarAsistencia(response) {
  $.ajax({
      url: '../controllers/registrar_asistencia.php',
      type: 'POST',
      data: { respuesta: respuesta },
      dataType: 'json',
      success: function(response) {
          if (response.status === 'success') {
              Swal.fire({
                  title: '¡Registro exitoso!',
                  html: `
                      <p><strong>Código:</strong> ${respuesta}</p>
                      <p><strong>Tipo:</strong> ${response.tipo}</p>
                      <p><strong>Hora:</strong> ${response.hora}</p>
                  `,
                  icon: 'success',
                  timer: 3000,
                  timerProgressBar: true
              });
              // Actualizar la tabla si existe
              if (typeof tabla !== 'undefined') {
                  tabla.ajax.reload();
              }
          } else {
              Swal.fire({
                  title: 'Error',
                  text: response.message,
                  icon: 'error'
              });
          }
      },
      error: function(xhr, status, error) {
          console.error('Error en la solicitud:', error);
          Swal.fire({
              title: 'Error',
              text: 'Error al procesar la solicitud',
              icon: 'error'
          });
      }
  });
}

// Evento para mostrar la cámara al cargar la página
window.addEventListener('load', () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    open_camera("environment");
  } else {
    ShowErrorMessage("Tu navegador no soporta el acceso a la cámara. Por favor, actualiza tu navegador o usa uno diferente.");
  }
});

//qr_0.8.3.2.2_js