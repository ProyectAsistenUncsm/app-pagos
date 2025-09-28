import { UsuarioService, PayService, Factura } from '../models/indexModel.js';
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

// Mostrar perfil del usuario
export const mostrarPerfil = async (req, res) => {
    try {
        // Verificar si es una petición AJAX/JSON
        const isJsonRequest = req.xhr || req.headers.accept.includes('application/json');

        // Obtener datos del usuario
        const usuario = await User.findByPk(req.user.id);
        if (!usuario) {
            if (isJsonRequest) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Usuario no encontrado'
                });
            }
            return res.status(404).render('error', {
                mensaje: 'Usuario no encontrado',
                usuario: null
            });
        }

        // Obtener servicios disponibles
        const servicios = await PayService.findAll({
            attributes: ['id', 'nombre', 'descripcion']
        });

        // Obtener facturas del usuario
        const facturas = await Factura.findAll({
            where: { usuario_id: req.user.id },
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion']
            }],
            attributes: [
                'id',
                'pay_service_id',
                'monto',
                'fecha_emision',
                'fecha_vencimiento',
                'estado',
                'createdAt',
                'updatedAt'
            ],
            order: [['createdAt', 'DESC']]
        });

        // Preparar datos del usuario para la vista
        const usuarioData = {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            telefono: usuario.telefono || 'No especificado',
            cedula: usuario.cedula || 'No especificada',
            fecha_registro: usuario.fecha_registro ? new Date(usuario.fecha_registro).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'No especificada',
            image_profile: usuario.image_profile
        };

        // Si es una petición JSON, devolver JSON
        if (isJsonRequest) {
            return res.json({
                success: true,
                usuario: usuarioData,
                servicios,
                facturas
            });
        }

        // Si es una petición normal, renderizar la vista
        res.render('perfil', {
            usuario: usuarioData,
            servicios,
            facturas
        });
    } catch (error) {
        console.error('Error al cargar perfil:', error);
        
        // Si es una petición JSON, devolver error en JSON
        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.status(500).json({
                success: false,
                mensaje: 'Error al cargar el perfil',
                error: error.message
            });
        }

        // Si es una petición normal, renderizar página de error
        res.status(500).render('error', {
            mensaje: 'Error al cargar el perfil',
            usuario: req.user
        });
    }
};

// Vincular servicio
export const vincularServicio = async (req, res) => {
    try {
        const { pay_service_id, numero_cuenta } = req.body;

        // Verificar si ya existe una factura para este servicio y número de cuenta
        const facturaExistente = await Factura.findOne({
            where: {
                pay_service_id,
                numero_cuenta
            },
            include: [{
                model: PayService,
                attributes: ['nombre']
            }]
        });

        if (facturaExistente) {
            return res.json({
                success: true,
                factura: facturaExistente
            });
        }

        res.json({
            success: false,
            mensaje: 'No se encontró ninguna factura con ese número de cuenta'
        });
    } catch (error) {
        console.error('Error al vincular servicio:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al procesar la solicitud'
        });
    }
};

// Confirmar vinculación
export const confirmarVinculacion = async (req, res) => {
    try {
        const { pay_service_id, numero_cuenta } = req.body;

        // Verificar si ya existe una factura para este servicio y número de cuenta
        const facturaExistente = await Factura.findOne({
            where: {
                pay_service_id,
                numero_cuenta
            }
        });

        if (!facturaExistente) {
            return res.json({
                success: false,
                mensaje: 'No se encontró la factura'
            });
        }

        // Actualizar la factura con el ID del usuario
        await facturaExistente.update({
            usuario_id: req.user.id
        });

        res.json({
            success: true,
            mensaje: 'Servicio vinculado exitosamente'
        });
    } catch (error) {
        console.error('Error al confirmar vinculación:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al procesar la solicitud'
        });
  }
};

// Crear nueva factura
export const crearFactura = async (req, res) => {
    try {
        const { pay_service_id, numero_cuenta } = req.body;
        const usuarioId = req.user.id;

        // Obtener información del servicio
        const servicio = await PayService.findByPk(pay_service_id);
        if (!servicio) {
            return res.status(404).json({
                success: false,
                mensaje: 'Servicio no encontrado'
            });
        }

        // Generar un monto aleatorio entre 100 y 1000
        const monto = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

        // Crear la nueva factura
        const nuevaFactura = await Factura.create({
            usuario_id: usuarioId,
            pay_service_id,
            numero_cuenta,
            monto,
            estado: 'pendiente',
            fecha_emision: new Date(),
            fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días desde ahora
        });

        // Incluir la información del servicio en la respuesta
        const facturaConServicio = await Factura.findByPk(nuevaFactura.id, {
            include: [{
                model: PayService,
                attributes: ['nombre']
            }]
        });

        res.json({
            success: true,
            factura: facturaConServicio
        });
    } catch (error) {
        console.error('Error al crear factura:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear la factura'
        });
    }
};

// Confirmar factura
export const confirmarFactura = async (req, res) => {
    try {
        const usuarioId = req.user.id;

        // Obtener la última factura creada por el usuario
        const ultimaFactura = await Factura.findOne({
            where: {
                usuario_id: usuarioId,
                estado: 'pendiente'
            },
            order: [['createdAt', 'DESC']],
            include: [{
                model: PayService,
                attributes: ['nombre']
            }]
        });

        if (!ultimaFactura) {
            return res.json({
                success: false,
                mensaje: 'No se encontró ninguna factura pendiente'
            });
        }

        // Emitir evento de nueva factura
        const io = req.app.get('io');
        if (io) {
            io.emit('nuevaFactura', {
                usuario_id: usuarioId,
                servicio_nombre: ultimaFactura.PayService.nombre,
                monto: ultimaFactura.monto
            });
        }

        res.json({
            success: true,
            mensaje: 'Factura creada exitosamente'
        });
    } catch (error) {
        console.error('Error al confirmar factura:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al confirmar la factura'
        });
    }
};
