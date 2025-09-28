import { Router } from 'express';
import User from '../models/userModel.js';
import { verificarToken, esAdmin } from '../middleware/authMiddleware.js';
import bcrypt from 'bcrypt';
import { obtenerHistorialPagos } from '../controllers/paymentController.js';
import {
    mostrarFormularioFactura,
    crearFactura,
    obtenerFacturas,
    obtenerFacturaPorId,
    actualizarFactura,
    eliminarFactura
} from '../controllers/facturaController.js';

const router = Router();

// Ruta para la vista de usuarios
router.get('/usuarios', verificarToken, esAdmin, (req, res) => {
    res.render('usuarios', { 
        usuario: req.user,
        title: 'Gestión de Usuarios'
    });
});

// Ruta para la vista de historial
router.get('/historial', verificarToken, esAdmin, obtenerHistorialPagos);

// Rutas para facturas (ordenadas de más específica a más general)
router.get('/facturas/crear', verificarToken, esAdmin, mostrarFormularioFactura);
router.post('/facturas/crear', verificarToken, esAdmin, crearFactura);
router.get('/factura', verificarToken, esAdmin, mostrarFormularioFactura);
router.get('/facturas', verificarToken, esAdmin, obtenerFacturas);
router.get('/facturas/:id', verificarToken, esAdmin, obtenerFacturaPorId);
router.put('/facturas/:id', verificarToken, esAdmin, actualizarFactura);
router.delete('/facturas/:id', verificarToken, esAdmin, eliminarFactura);

// API Routes
// Obtener todos los usuarios administradores
router.get('/api/usuarios', verificarToken, esAdmin, async (req, res) => {
    try {
        const usuarios = await User.findAll({
            where: { rol_id: 1 },
            attributes: ['id', 'nombre', 'correo', 'telefono', 'cedula']
        });
        res.json({ usuarios });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error al obtener los usuarios' });
    }
});

// Crear un nuevo usuario administrador
router.post('/api/usuarios', verificarToken, esAdmin, async (req, res) => {
    try {
        const { nombre, correo, contrasena, confirmarContrasena, telefono, cedula } = req.body;

        // Validar que las contraseñas coincidan
        if (contrasena !== confirmarContrasena) {
            return res.status(400).json({ mensaje: 'Las contraseñas no coinciden' });
        }

        // Verificar si el correo ya existe
        const usuarioExistente = await User.findOne({ where: { correo } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        // Crear el nuevo usuario
        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const nuevoUsuario = await User.create({
            nombre,
            correo,
            contrasena: hashedPassword,
            telefono,
            cedula,
            rol_id: 1
        });

        res.status(201).json({
            mensaje: 'Usuario administrador creado exitosamente',
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo,
                telefono: nuevoUsuario.telefono,
                cedula: nuevoUsuario.cedula
            }
        });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ mensaje: 'Error al crear el usuario administrador' });
    }
});

// Eliminar un usuario administrador
router.delete('/api/usuarios/:id', verificarToken, esAdmin, async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el usuario existe y es un administrador
        const usuario = await User.findOne({
            where: { id, rol_id: 1 }
        });

        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario administrador no encontrado' });
        }

        // Eliminar el usuario
        await usuario.destroy();
        res.json({ mensaje: 'Usuario administrador eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el usuario administrador' });
    }
});

export default router; 