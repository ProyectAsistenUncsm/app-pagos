import { UsuarioService } from '../models/indexModel.js';
import User from '../models/userModel.js'; // Import the default export 'User'


// Obtener perfil del usuario
// Agrega esta función si usas EJS en lugar de solo APIs JSON
export const vistaPerfil = async (req, res) => {
  try {
    const usuarioId = req.User.id;
    const usuario = await User.findByPk(usuarioId, {
      include: [{ model: UsuarioService, include: ['servicio'] }]
    });

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.render('perfil', { usuario });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el perfil');
  }
};

// Actualizar estado de servicio
exports.actualizarEstadoServicio = async (req, res) => {
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
