document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');

    if (imageUpload && imagePreview) {
        imageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            
            if (file) {
                // Validar tipo de archivo
                if (!file.type.match('image.*')) {
                    window.mostrarNotificacion('Por favor seleccione una imagen válida (PNG, JPG, JPEG)', 'error');
                    return;
                }

                // Validar tamaño (5MB máximo)
                if (file.size > 5 * 1024 * 1024) {
                    window.mostrarNotificacion('La imagen no debe superar los 5MB', 'error');
                    return;
                }

                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Crear una imagen temporal para obtener dimensiones
                    const img = new Image();
                    img.onload = function() {
                        // Calcular nuevas dimensiones manteniendo la proporción
                        let width = img.width;
                        let height = img.height;
                        const maxDimension = 800;

                        if (width > height && width > maxDimension) {
                            height = (height * maxDimension) / width;
                            width = maxDimension;
                        } else if (height > maxDimension) {
                            width = (width * maxDimension) / height;
                            height = maxDimension;
                        }

                        // Crear canvas para redimensionar
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0, width, height);

                        // Convertir a JPEG con calidad 0.6
                        const resizedImage = canvas.toDataURL('image/jpeg', 0.6);
                        
                        // Actualizar vista previa
                        const previewImg = document.createElement('img');
                        previewImg.src = resizedImage;
                        previewImg.alt = 'Vista previa';
                        previewImg.style.width = 'auto';
                        previewImg.style.height = 'auto';
                        previewImg.style.objectFit = 'cover';
                        
                        // Limpiar y actualizar el contenedor de vista previa
                        imagePreview.innerHTML = '';
                        imagePreview.appendChild(previewImg);
                        
                        // Guardar la imagen temporalmente
                        window.imagenTemporal = resizedImage;

                        // Emitir evento de vista previa de imagen
                        if (window.socket) {
                            window.socket.emit('vistaPreviaImagen', {
                                imageData: resizedImage
                            });
                        }
                    };
                    img.src = e.target.result;
                };

                reader.onerror = function() {
                    console.error('Error al leer el archivo');
                    window.mostrarNotificacion('Error al leer el archivo. Por favor, intente nuevamente.', 'error');
                };

                reader.readAsDataURL(file);
            }
        });
    }

    // Escuchar eventos de actualización de imagen de perfil
    if (window.socket) {
        window.socket.on('imagenPerfilActualizada', (data) => {
            if (data.image_profile) {
                const previewImg = document.createElement('img');
                previewImg.src = data.image_profile;
                previewImg.alt = 'Imagen de perfil';
                previewImg.style.width = 'auto';
                previewImg.style.height = 'auto';
                previewImg.style.objectFit = 'cover';
                
                imagePreview.innerHTML = '';
                imagePreview.appendChild(previewImg);
            }
        });
    }
});