import { PayService, UsuarioService } from '../models/indexModel.js';
import { io } from '../index.js';

// Obtener todos los servicios
export const obtenerServicios = async (req, res) => {
  try {
    const servicios = await PayService.findAll();
    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({ mensaje: 'Error al obtener los servicios' });
  }
};

// Vincular un servicio a un usuario
export const vincularServicio = async (req, res) => {
  try {
    const { pay_service_id, numero_cuenta } = req.body;
    const usuarioId = req.user.id;

    // Verificar si el servicio ya está vinculado
    const servicioExistente = await UsuarioService.findOne({ where: { usuario_id: usuarioId, pay_service_id } });
    if (servicioExistente) {
      return res.status(400).json({ mensaje: 'Este servicio ya está vinculado a tu cuenta' });
    }

    // Obtener información del servicio
    const servicio = await PayService.findByPk(pay_service_id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    // Vincular el servicio
    const servicioVinculado = await UsuarioService.create({
      usuario_id: usuarioId,
      pay_service_id,
      numero_cuenta,
      estado: 'activo',
      monto: 0, // Monto inicial
      fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días desde ahora
    });

    // Emitir evento de servicio vinculado
    io.emit('servicioVinculado', {
      usuario_id: usuarioId,
      pay_service_id,
      service_nombre: servicio.nombre,
      numero_cuenta
    });

    res.status(201).json({ mensaje: 'Servicio vinculado correctamente', servicio: servicioVinculado });
  } catch (error) {
    console.error('Error al vincular servicio:', error);
    res.status(500).json({ mensaje: 'Error al vincular el servicio' });
  }
};

// Desvincular un servicio de un usuario
export const desvincularServicio = async (req, res) => {
  try {
    const { pay_service_id } = req.body;
    const usuarioId = req.user.id;

    const servicioVinculado = await UsuarioService.findOne({ 
      where: { usuario_id: usuarioId, pay_service_id },
      include: [{ model: PayService, attributes: ['nombre'] }]
    });

    if (!servicioVinculado) {
      return res.status(404).json({ mensaje: 'El servicio no está vinculado a tu cuenta' });
    }

    // Emitir evento antes de eliminar
    io.emit('servicioDesvinculado', {
      usuario_id: usuarioId,
      pay_service_id,
      servicio_nombre: servicioVinculado.PayService.nombre
    });

    await servicioVinculado.destroy();
    res.json({ mensaje: 'Servicio desvinculado correctamente' });
  } catch (error) {
    console.error('Error al desvincular servicio:', error);
    res.status(500).json({ mensaje: 'Error al desvincular el servicio' });
  }
};

// Crear un nuevo servicio
export const crearServicio = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const servicio = await PayService.create({ nombre, descripcion });
    
    // Emitir evento de nuevo servicio
    io.emit('nuevoServicio', servicio);
    
    res.status(201).json(servicio);
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ mensaje: 'Error al crear el servicio' });
  }
};

// Actualizar un servicio
export const actualizarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    
    const servicio = await PayService.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    
    await servicio.update({ nombre, descripcion });
    
    // Emitir evento de servicio actualizado
    io.emit('servicioActualizado', servicio);
    
    res.json(servicio);
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ mensaje: 'Error al actualizar el servicio' });
  }
};

// Eliminar un servicio
export const eliminarServicio = async (req, res) => {
  try {
    const { id } = req.params;
    
    const servicio = await PayService.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }
    
    await servicio.destroy();
    
    // Emitir evento de servicio eliminado
    io.emit('servicioEliminado', { id });
    
    res.json({ mensaje: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el servicio' });
  }
};
