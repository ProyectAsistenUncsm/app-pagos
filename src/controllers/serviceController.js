const { Servicio, UsuarioServicio } = require('../models');

// Obtener todos los servicios
exports.obtenerServicios = async (req, res) => {
  try {
    const servicios = await Servicio.findAll();
    res.json({ servicios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener los servicios' });
  }
};

// Vincular un servicio a un usuario
exports.vincularServicio = async (req, res) => {
  try {
    const { servicio_id, numero_cuenta } = req.body;
    const usuarioId = req.usuario.id;

    // Verificar si el servicio ya está vinculado
    const servicioExistente = await UsuarioServicio.findOne({ where: { usuario_id: usuarioId, servicio_id } });
    if (servicioExistente) {
      return res.status(400).json({ mensaje: 'Este servicio ya está vinculado a tu cuenta' });
    }

    // Vincular el servicio
    const servicioVinculado = await UsuarioServicio.create({
      usuario_id: usuarioId,
      servicio_id,
      numero_cuenta,
      estado: 'activo',
      creado_en: new Date()
    });

    res.status(201).json({ mensaje: 'Servicio vinculado correctamente', servicio: servicioVinculado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al vincular el servicio' });
  }
};

// Desvincular un servicio de un usuario
exports.desvincularServicio = async (req, res) => {
  try {
    const { servicio_id } = req.body;
    const usuarioId = req.usuario.id;

    const servicioVinculado = await UsuarioServicio.findOne({ where: { usuario_id: usuarioId, servicio_id } });

    if (!servicioVinculado) {
      return res.status(404).json({ mensaje: 'El servicio no está vinculado a tu cuenta' });
    }

    await servicioVinculado.destroy();
    res.json({ mensaje: 'Servicio desvinculado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al desvincular el servicio' });
  }
};
