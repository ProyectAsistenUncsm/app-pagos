import Factura from '../models/Factura.js';
import PayService from '../models/PayService.js';
import { Op } from 'sequelize';
import { io } from '../index.js';

// Función para generar ID de factura
const generarIdFactura = async (pay_service_id) => {
    const fecha = new Date();
    const año = fecha.getFullYear().toString().slice(-2);
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    
    // Obtener el último número de factura para este servicio
    const ultimaFactura = await Factura.findOne({
        where: { pay_service_id },
        order: [['id', 'DESC']]
    });
    
    let numero = '001';
    if (ultimaFactura) {
        const ultimoNumero = parseInt(ultimaFactura.id.toString().slice(-3));
        numero = (ultimoNumero + 1).toString().padStart(3, '0');
    }
    
    // Formato: AÑO-MES-DIA-SERVICIO-NUMERO
    return `${año}${mes}${dia}-${pay_service_id}-${numero}`;
};

// Mostrar formulario de creación de factura
export const mostrarFormularioFactura = async (req, res) => {
    try {
        const servicios = await PayService.findAll({
            attributes: ['id', 'nombre', 'descripcion']
        });
        
        if (!servicios || servicios.length === 0) {
            // Crear servicios por defecto si no existen
            const serviciosPorDefecto = [
                {
                    nombre: 'Enacal',
                    descripcion: 'Empresa de servicios de acueductos'
                },
                {
                    nombre: 'Disnorte-Dissur',
                    descripcion: 'Empresa de servicio electrico'
                },
                {
                    nombre: 'INSS',
                    descripcion: 'Instituto Nicaraguense de Servicio Social'
                }
            ];

            for (const servicio of serviciosPorDefecto) {
                await PayService.create(servicio);
            }

            // Obtener los servicios nuevamente
            const serviciosActualizados = await PayService.findAll({
                attributes: ['id', 'nombre', 'descripcion']
            });
            
            return res.render('factura', { 
                usuario: req.user,
                title: 'Crear Factura',
                servicios: serviciosActualizados
            });
        }
        
        res.render('factura', { 
            usuario: req.user,
            title: 'Crear Factura',
            servicios
        });
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).render('error', {
            mensaje: 'Error al cargar los servicios',
            usuario: req.user
        });
    }
};

// Crear una nueva factura
export const crearFactura = async (req, res) => {
    try {
        const { 
            pay_service_id, 
            usuario_id,
            monto, 
            fecha_emision, 
            fecha_vencimiento, 
            estado 
        } = req.body;

        // Validar datos requeridos
        if (!pay_service_id || !usuario_id || !monto || !fecha_emision || !fecha_vencimiento || !estado) {
            return res.status(400).json({
                success: false,
                mensaje: 'Todos los campos son requeridos'
            });
        }

        // Verificar si el servicio existe
        const servicio = await PayService.findOne({
            where: { id: pay_service_id },
            attributes: ['id', 'nombre', 'descripcion']
        });

        if (!servicio) {
            return res.status(404).json({
                success: false,
                mensaje: 'El servicio especificado no existe'
            });
        }

        // Crear la factura con el usuario_id proporcionado en el formulario
        const factura = await Factura.create({
            pay_service_id,
            usuario_id: parseInt(usuario_id),
            monto: parseFloat(monto),
            fecha_emision: new Date(fecha_emision),
            fecha_vencimiento: new Date(fecha_vencimiento),
            estado
        });

        // Obtener la factura con los datos del servicio
        const facturaCompleta = await Factura.findByPk(factura.id, {
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion']
            }]
        });

        // Emitir notificación de nueva factura
        if (io) {
            io.emit('nuevaFactura', {
                usuario_id: usuario_id,
                servicio_nombre: servicio.nombre,
                monto: monto,
                fecha_vencimiento: fecha_vencimiento
            });
        }

        res.status(201).json({
            success: true,
            mensaje: 'Factura creada exitosamente',
            factura: facturaCompleta
        });
    } catch (error) {
        console.error('Error al crear factura:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear la factura',
            error: error.message
        });
    }
};

// Obtener todas las facturas
export const obtenerFacturas = async (req, res) => {
    try {
        const facturas = await Factura.findAll({
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion']
            }]
        });
        res.json({
            success: true,
            facturas
        });
    } catch (error) {
        console.error('Error al obtener facturas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener las facturas',
            error: error.message
        });
    }
};

// Obtener una factura por ID
export const obtenerFacturaPorId = async (req, res) => {
    try {
        const factura = await Factura.findByPk(req.params.id, {
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion']
            }]
        });
        
        if (!factura) {
            return res.status(404).json({
                success: false,
                mensaje: 'Factura no encontrada'
            });
        }
        
        res.json({
            success: true,
            factura
        });
    } catch (error) {
        console.error('Error al obtener factura:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener la factura',
            error: error.message
        });
    }
};

// Actualizar una factura
export const actualizarFactura = async (req, res) => {
    try {
        const {
            pay_service_id,
            monto,
            fecha_emision,
            fecha_vencimiento,
            estado
        } = req.body;

        const factura = await Factura.findByPk(req.params.id);
        if (!factura) {
            return res.status(404).json({
                success: false,
                mensaje: 'Factura no encontrada'
            });
        }

        await factura.update({
            pay_service_id,
            monto: parseFloat(monto),
            fecha_emision: new Date(fecha_emision),
            fecha_vencimiento: new Date(fecha_vencimiento),
            estado
        });

        const facturaActualizada = await Factura.findByPk(factura.id, {
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion']
            }]
        });

        res.json({
            success: true,
            mensaje: 'Factura actualizada exitosamente',
            factura: facturaActualizada
        });
    } catch (error) {
        console.error('Error al actualizar factura:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar la factura',
            error: error.message
        });
    }
};

// Eliminar una factura
export const eliminarFactura = async (req, res) => {
    try {
        const factura = await Factura.findByPk(req.params.id);
        if (!factura) {
            return res.status(404).json({
                success: false,
                mensaje: 'Factura no encontrada'
            });
        }

        await factura.destroy();
        res.json({
            success: true,
            mensaje: 'Factura eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar factura:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar la factura',
            error: error.message
        });
    }
};

// Obtener notificaciones de facturas
export const obtenerNotificacionesFacturas = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        
        // Obtener facturas recientes (últimas 24 horas)
        const fechaLimite = new Date();
        fechaLimite.setHours(fechaLimite.getHours() - 24);

        const facturas = await Factura.findAll({
            where: {
                usuario_id: usuarioId,
                createdAt: {
                    [Op.gte]: fechaLimite
                }
            },
            include: [{
                model: PayService,
                attributes: ['nombre', 'descripcion']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.json({
            success: true,
            facturas: facturas
        });
    } catch (error) {
        console.error('Error al obtener notificaciones de facturas:', error);
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener las notificaciones',
            error: error.message
        });
    }
}; 