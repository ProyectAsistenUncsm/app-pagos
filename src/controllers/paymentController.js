import { Pago, PayService, PayServicesData, UsuarioService } from '../models/indexModel.js';
import { io } from '../index.js';

// Obtener facturas pendientes del usuario
export const obtenerFacturasPendientes = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        
        const facturasPendientes = await UsuarioService.findAll({
            where: {
                user_id: usuarioId,
                estado: 'pendiente'
            },
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion']
            }]
        });

        res.json({ facturas: facturasPendientes });
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        res.status(500).json({ mensaje: 'Error al obtener las facturas pendientes' });
    }
};

// Cargar página de pago con datos de la factura
export const cargarPaginaPago = async (req, res) => {
    try {
        const { pay_service_id } = req.params;
        const usuarioId = req.user.id;

        console.log('Cargando página de pago para:', { pay_service_id, usuarioId });

        // Validar que el pay_service_id sea un número válido
        const serviceId = parseInt(pay_service_id);
        if (isNaN(serviceId) || serviceId <= 0) {
            console.log('ID de servicio inválido:', pay_service_id);
            return res.status(400).render('error', {
                mensaje: 'ID de servicio inválido. Debe ser un número positivo.'
            });
        }

        // Buscar el servicio primero para validar que existe
        const payService = await PayService.findByPk(serviceId, {
            attributes: ['id', 'nombre', 'descripcion'],
            include: [{ model: PayServicesData, as: 'data' }]
        });

        if (!payService) {
            console.log('Servicio no encontrado:', serviceId);
            return res.status(404).render('error', {
                mensaje: `El servicio con ID ${serviceId} no existe en el sistema`
            });
        }

        console.log('Servicio encontrado:', payService.toJSON());

        // Buscar el servicio del usuario
        const usuarioService = await UsuarioService.findOne({
            where: {
                user_id: usuarioId,
                pay_service_id: serviceId,
                estado: 'pendiente'
            },
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion'],
                include: [{
                    model: PayServicesData,
                    as: 'data'
                }]
            }]
        });

        // Si no hay servicio pendiente, crear uno nuevo
        if (!usuarioService) {
            console.log('No se encontró servicio pendiente, creando nuevo servicio');
            const nuevoServicio = await UsuarioService.create({
                user_id: usuarioId,
                pay_service_id: serviceId,
                estado: 'pendiente',
                monto: payService.data?.monto || 0,
                numero_cuenta: `ACC-${Date.now()}`,
                fecha_vencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 días
            });

            // Cargar el nuevo servicio con sus relaciones
            const servicioCompleto = await UsuarioService.findByPk(nuevoServicio.id, {
                include: [{
                    model: PayService,
                    attributes: ['nombre', 'descripcion'],
                    include: [{
                        model: PayServicesData,
                        as: 'data'
                    }]
                }]
            });

            console.log('Nuevo servicio creado:', servicioCompleto.toJSON());

            return res.render('pagos', {
                factura: servicioCompleto,
                usuario: req.user,
                title: 'Pago de Servicio'
            });
        }

        console.log('Servicio encontrado:', usuarioService.toJSON());

        res.render('pagos', {
            factura: usuarioService,
            usuario: req.user,
            title: 'Pago de Servicio'
        });
    } catch (error) {
        console.error('Error detallado al cargar página de pago:', {
            mensaje: error.message,
            stack: error.stack,
            nombre: error.name
        });
        res.status(500).render('error', {
            mensaje: 'Error al cargar la página de pago. Por favor, intente nuevamente.'
        });
    }
};

// Realizar el pago
export const realizarPago = async (req, res) => {
    try {
        const { pay_service_id, monto, datos_bancarios } = req.body;
        const usuarioId = req.user.id;

        console.log('Iniciando proceso de pago:', { pay_service_id, usuarioId });

        // Validar datos requeridos
        if (!pay_service_id || !monto || !datos_bancarios) {
            console.log('Faltan datos requeridos:', { pay_service_id, monto, datos_bancarios });
            return res.status(400).json({
                mensaje: 'Faltan datos requeridos para realizar el pago'
            });
        }

        // Validar que el pay_service_id sea un número válido
        const serviceId = parseInt(pay_service_id);
        if (isNaN(serviceId) || serviceId <= 0) {
            console.log('ID de servicio inválido:', pay_service_id);
            return res.status(400).json({
                mensaje: 'ID de servicio inválido. Debe ser un número positivo.'
            });
        }

        // Verificar que el servicio existe y está pendiente
        const usuarioService = await UsuarioService.findOne({
            where: {
                user_id: usuarioId,
                pay_service_id: serviceId,
                estado: 'pendiente'
            },
            include: [{
                model: PayService,
                attributes: ['nombre']
            }]
        });

        if (!usuarioService) {
            console.log('No se encontró servicio pendiente:', { usuarioId, serviceId });
            return res.status(404).json({
                mensaje: 'No se encontró ningún servicio pendiente para este servicio'
            });
        }

        console.log('Servicio encontrado:', usuarioService.toJSON());

        // Crear el registro de pago
        const pago = await Pago.create({
            user_id: usuarioId,
            pay_service_id: serviceId,
            monto,
            fecha_pago: new Date(),
            metodo_pago: 'tarjeta',
            estado: 'completado',
            referencia: `PAY-${Date.now()}`
        });

        // Actualizar estado del servicio
        usuarioService.estado = 'pagado';
        await usuarioService.save();

        console.log('Pago realizado exitosamente:', pago.toJSON());

        // Emitir evento de pago exitoso
        io.emit('pagoRealizado', {
            user_id: usuarioId,
            pay_service_id: serviceId,
            servicio_nombre: usuarioService.PayService.nombre,
            monto,
            fecha: pago.fecha_pago
        });

        res.json({ 
            mensaje: 'Pago realizado exitosamente',
            pago,
            servicio: usuarioService
        });
    } catch (error) {
        console.error('Error al realizar pago:', error);
        
        // Emitir evento de pago fallido
        io.emit('pagoFallido', {
            user_id: req.user?.id,
            pay_service_id: req.body?.pay_service_id,
            mensaje: error.message
        });

        res.status(500).json({ 
            mensaje: 'Error al realizar el pago. Por favor, intente nuevamente.',
            error: error.message 
        });
    }
};

// Obtener historial de pagos
export const obtenerHistorialPagos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        console.log('Obteniendo historial para usuario:', usuarioId);
        
        const pagos = await Pago.findAll({
            where: {
                user_id: usuarioId
            },
            include: [{
                model: PayService,
                attributes: ['id', 'nombre', 'descripcion']
            }],
            attributes: { exclude: ['createdAt', 'updatedAt', 'factura_id'] },
            order: [['fecha_pago', 'DESC']]
        });

        console.log('Pagos encontrados:', pagos.length);
        console.log('Primer pago (si existe):', pagos[0] ? JSON.stringify(pagos[0].toJSON(), null, 2) : 'No hay pagos');

        res.render('historial', {
            pagos,
            usuario: req.user,
            title: 'Historial de Pagos'
        });
    } catch (error) {
        console.error('Error detallado al obtener historial de pagos:', {
            mensaje: error.message,
            stack: error.stack,
            nombre: error.name
        });
        res.status(500).render('error', {
            mensaje: `Error al cargar el historial de pagos: ${error.message}`
        });
    }
};
