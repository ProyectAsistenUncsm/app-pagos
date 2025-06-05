import { UsuarioService } from '../models/indexModel.js';
import User from '../models/userModel.js'; // Import the default export 'User'


// Obtener perfil del usuario
// Agrega esta función si usas EJS en lugar de solo APIs JSON
export const vistaPerfil = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const usuario = await User.findByPk(usuarioId);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.render('perfil', { 
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        cedula: usuario.cedula,
        fecha_registro: usuario.fecha_registro
      }
    });
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    res.status(500).json({ 
      mensaje: 'Error al cargar el perfil',
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
        cedula: usuario.cedula
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

// Actualizar estado de servicio
export const actualizarEstadoServicio = async (req, res) => {
  try {
    const { usuario_id, servicio_id, nuevoEstado } = req.body;

    const servicio = await UsuarioServicio.findOne({
      where: { usuario_id, servicio_id }
    });

    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    servicio.estado = nuevoEstado;
    await servicio.save();

    // Emitir evento WebSocket
    const io = req.app.get('io');
    io.emit('servicioActualizado', {
      usuario_id,
      servicio_id,
      estado: nuevoEstado
    });

    res.json({ mensaje: 'Estado actualizado', servicio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado' });
  }
};
