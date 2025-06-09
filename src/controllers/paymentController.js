import { Pago, PayService, PayServicesData, UsuarioService, Factura, User } from '../models/indexModel.js';
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

// Cargar página de pago
export const cargarPaginaPago = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Buscar la factura con el servicio asociado
        const factura = await Factura.findOne({
            where: {
                id: id,
                usuario_id: req.user.id
            },
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion']
            }]
        });

        if (!factura) {
            return res.status(404).render('error', {
                mensaje: 'Factura no encontrada',
                usuario: req.user
            });
        }

        res.render('pagos', {
            usuario: req.user,
            factura: factura
        });
    } catch (error) {
        console.error('Error al cargar página de pago:', error);
        res.status(500).render('error', {
            mensaje: 'Error al cargar la página de pago',
            usuario: req.user
        });
    }
};

// Realizar pago
export const realizarPago = async (req, res) => {
    try {
        const { pay_service_id, monto, datos_bancarios } = req.body;

        // Aquí iría la lógica para procesar el pago
        // Por ahora solo simulamos un pago exitoso

        // Crear el registro del pago
        const pago = await Pago.create({
            user_id: req.user.id,
            pay_service_id: pay_service_id,
            monto: monto,
            fecha_pago: new Date(),
            referencia: `PAY-${Date.now()}`,
            metodo_pago: 'tarjeta',
            estado: 'completado'
        });

        // Actualizar el estado de la factura
        await Factura.update(
            { estado: 'pagado' },
            { 
                where: { 
                    pay_service_id,
                    usuario_id: req.user.id,
                    estado: 'pendiente'
                }
            }
        );

        // Obtener el servicio para la notificación
        const servicio = await PayService.findByPk(pay_service_id);

        // Emitir notificación de pago exitoso
        if (io) {
            io.emit('pagoRealizado', {
                usuario_id: req.user.id,
                servicio_nombre: servicio.nombre,
                monto: monto,
                fecha: new Date()
            });
        }

        res.json({ 
            success: true,
            mensaje: 'Pago realizado exitosamente',
            pago: pago
        });
    } catch (error) {
        console.error('Error al realizar pago:', error);
        
        // Emitir notificación de error
        if (io) {
            io.emit('pagoFallido', {
                usuario_id: req.user.id,
                mensaje: error.message
            });
        }

        res.status(500).json({ 
            success: false,
            mensaje: 'Error al procesar el pago',
            error: error.message 
        });
    }
};

// Obtener historial de pagos
export const obtenerHistorialPagos = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const esAdmin = req.user.rol_id === 1; // Asumiendo que 1 es el ID del rol de administrador
        
        console.log('Obteniendo historial para usuario:', usuarioId);
        console.log('Es administrador:', esAdmin);
        
        // Construir la consulta base
        const whereClause = esAdmin ? {} : { user_id: usuarioId };
        
        const pagos = await Pago.findAll({
            where: whereClause,
            include: [
                {
                    model: PayService,
                    attributes: ['id', 'nombre', 'descripcion']
                },
                {
                    model: User,
                    attributes: ['id', 'nombre', 'correo'],
                    required: true // Asegura que solo se incluyan pagos con usuarios válidos
                }
            ],
            order: [['fecha_pago', 'DESC']]
        });

        console.log('Pagos encontrados:', pagos.length);
        if (pagos.length > 0) {
            console.log('Primer pago (si existe):', JSON.stringify(pagos[0], null, 2));
        }

        // Asegurarnos de que todos los datos necesarios estén disponibles
        const datosVista = {
            pagos: pagos || [],
            usuario: req.user || {},
            esAdmin: esAdmin || false,
            title: 'Historial de Pagos'
        };

        res.render('historial', datosVista);
    } catch (error) {
        console.error('Error al obtener historial de pagos:', error);
        res.status(500).render('error', {
            mensaje: 'Error al cargar el historial de pagos',
            usuario: req.user || {},
            esAdmin: false
        });
    }
};
