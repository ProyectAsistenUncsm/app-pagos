import { UsuarioService } from '../models/indexModel.js';
import User from '../models/userModel.js'; // Import the default export 'User'
import bcrypt from 'bcryptjs';


// Obtener perfil del usuario
export const vistaPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const usuario = await User.findByPk(usuarioId);

    if (!usuario) {
      return res.status(404).render('error', { 
        mensaje: 'Usuario no encontrado' 
      });
    }

    // Formatear la fecha de registro
    const fechaRegistro = usuario.fecha_registro 
      ? new Date(usuario.fecha_registro).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'No especificada';

    // Asegurarse de que la imagen del perfil se pase correctamente
    const usuarioData = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono || 'No especificado',
      cedula: usuario.cedula || 'No especificada',
      fecha_registro: fechaRegistro,
      image_profile: usuario.image_profile
    };

    res.render('perfil', { usuario: usuarioData });
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    res.status(500).render('error', { 
      mensaje: 'Error al cargar el perfil',
      error: error.message 
    });
  }
};

// Actualizar imagen de perfil
export const actualizarImagenPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ mensaje: 'No se proporcionó ninguna imagen' });
    }

    // Convertir la imagen base64 a Buffer
    const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    const usuario = await User.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizar la imagen de perfil
    usuario.image_profile = imageBuffer;
    await usuario.save();

    res.json({ 
      mensaje: 'Imagen de perfil actualizada correctamente',
      image_profile: `data:image/jpeg;base64,${imageBuffer.toString('base64')}`
    });
  } catch (error) {
    console.error('Error al actualizar imagen de perfil:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar la imagen de perfil',
      error: error.message 
    });
  }
};

// Actualizar perfil de usuario
export const actualizarPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { nombre, telefono, cedula } = req.body;

    const usuario = await User.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Actualizar campos
    if (nombre) usuario.nombre = nombre;
    if (telefono) usuario.telefono = telefono;
    if (cedula) usuario.cedula = cedula;

    await usuario.save();

    res.json({ 
      mensaje: 'Perfil actualizado correctamente',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        cedula: usuario.cedula,
        image_profile: usuario.image_profile
      }
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar el perfil',
      error: error.message 
    });
  }
};

// Cambiar contraseña
export const cambiarContrasena = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const { nuevaContrasena, confirmarContrasena } = req.body;

    // Validar que las contraseñas coincidan
    if (nuevaContrasena !== confirmarContrasena) {
      return res.status(400).json({ 
        mensaje: 'Las contraseñas no coinciden' 
      });
    }

    // Validar longitud mínima
    if (nuevaContrasena.length < 6) {
      return res.status(400).json({ 
        mensaje: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    const usuario = await User.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ 
        mensaje: 'Usuario no encontrado' 
      });
    }

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(nuevaContrasena, salt);

    // Actualizar contraseña
    usuario.contrasena = hashedPassword;
    await usuario.save();

    res.json({ 
      mensaje: 'Contraseña actualizada correctamente' 
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ 
      mensaje: 'Error al cambiar la contraseña',
      error: error.message 
    });
  }
};

// Actualizar estado de servicio
export const actualizarEstadoServicio = async (req, res) => {
  try {
    const { usuario_id, service_id, nuevoEstado } = req.body;

    const servicio = await Usuarioservice.findOne({
      where: { usuario_id, service_id }
    });

    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    service.estado = nuevoEstado;
    await service.save();

    // Emitir evento WebSocket
    const io = req.app.get('io');
    io.emit('servicioActualizado', {
      usuario_id,
      service_id,
      estado: nuevoEstado
    });

    res.json({ mensaje: 'Estado actualizado', servicio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado' });
  }
};
