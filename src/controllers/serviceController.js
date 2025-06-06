import { Servicio, UsuarioService } from '../models/indexModel.js';
import { io } from '../index.js';

// Obtener todos los servicios
export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.json({ servicios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los servicios' });
  }
};

// Vincular un servicio a un usuario
export const vincularServicio = async (req, res) => {
  try {
    const { servicio_id, numero_cuenta } = req.body;
    const usuarioId = req.usuario.id;

    // Verificar si el servicio ya está vinculado
    const servicioExistente = await UsuarioService.findOne({ where: { usuario_id: usuarioId, servicio_id } });
    if (servicioExistente) {
      return res.status(400).json({ mensaje: 'Este servicio ya está vinculado a tu cuenta' });
    }

    // Obtener información del servicio
    const servicio = await Servicio.findByPk(servicio_id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    // Vincular el servicio
    const servicioVinculado = await UsuarioService.create({
      usuario_id: usuarioId,
      servicio_id,
      numero_cuenta,
      estado: 'activo',
      creado_en: new Date()
    });

    // Emitir evento de servicio vinculado
    io.emit('servicioVinculado', {
      usuario_id: usuarioId,
      servicio_id,
      servicio_nombre: servicio.nombre,
      numero_cuenta
    });

    res.status(201).json({ mensaje: 'Servicio vinculado correctamente', servicio: servicioVinculado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al vincular el servicio' });
  }
};

// Desvincular un servicio de un usuario
export const desvincularServicio = async (req, res) => {
  try {
    const { servicio_id } = req.body;
    const usuarioId = req.usuario.id;

    const servicioVinculado = await UsuarioService.findOne({ 
      where: { usuario_id: usuarioId, servicio_id },
      include: [{ model: Servicio, attributes: ['nombre'] }]
    });

    if (!servicioVinculado) {
      return res.status(404).json({ mensaje: 'El servicio no está vinculado a tu cuenta' });
    }

    // Emitir evento antes de eliminar
    io.emit('servicioDesvinculado', {
      usuario_id: usuarioId,
      servicio_id,
      servicio_nombre: servicioVinculado.Servicio.nombre
    });

    await servicioVinculado.destroy();
    res.json({ mensaje: 'Servicio desvinculado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al desvincular el servicio' });
  }
};
