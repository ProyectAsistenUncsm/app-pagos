import bcrypt from 'bcryptjs';
import { User } from '../models/indexModel.js';

// Crear usuario administrador
export const crearUsuarioAdmin = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body);
        const { nombre, correo, contrasena, telefono, cedula } = req.body;

        // Validaciones básicas
        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({ 
                mensaje: 'Nombre, correo y contraseña son obligatorios' 
            });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await User.findOne({ where: { correo } });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'El correo ya está registrado' });
        }

        // Verificar si la cédula ya existe
        if (cedula) {
            const cedulaExistente = await User.findOne({ where: { cedula } });
            if (cedulaExistente) {
                return res.status(400).json({ mensaje: 'La cédula ya está registrada' });
            }
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

        // Crear el usuario administrador
        const nuevoAdmin = await User.create({
            nombre,
            correo,
            contrasena: contrasenaEncriptada,
            telefono,
            cedula,
            fecha_registro: new Date(),
            rol_id: 1 // Rol de administrador
        });

        res.status(201).json({ 
            mensaje: 'Administrador creado correctamente',
            usuario: {
                id: nuevoAdmin.id,
                nombre: nuevoAdmin.nombre,
                correo: nuevoAdmin.correo,
                telefono: nuevoAdmin.telefono,
                cedula: nuevoAdmin.cedula,
                rol_id: nuevoAdmin.rol_id
            }
        });
    } catch (error) {
        console.error('Error al crear administrador:', error);
        res.status(500).json({ 
            mensaje: 'Error al crear el administrador',
            error: error.message 
        });
    }
};

// Obtener lista de administradores
export const obtenerAdministradores = async (req, res) => {
    try {
        console.log('Buscando administradores...');
        const administradores = await User.findAll({
            where: { rol_id: 1 },
            attributes: ['id', 'nombre', 'correo', 'telefono', 'cedula', 'fecha_registro'],
            order: [['fecha_registro', 'DESC']]
        });
        console.log('Administradores encontrados:', administradores);

        res.json({ 
            success: true,
            administradores: administradores.map(admin => ({
                ...admin.toJSON(),
                fecha_registro: admin.fecha_registro ? new Date(admin.fecha_registro).toLocaleDateString('es-ES') : 'No especificada'
            }))
        });
    } catch (error) {
        console.error('Error al obtener administradores:', error);
        res.status(500).json({ 
            success: false,
            mensaje: 'Error al obtener la lista de administradores',
            error: error.message 
        });
    }
};

// Eliminar administrador
export const eliminarAdministrador = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Intentando eliminar administrador con ID:', id);

        const admin = await User.findOne({
            where: { id, rol_id: 1 }
        });

        if (!admin) {
            return res.status(404).json({ 
                success: false,
                mensaje: 'Administrador no encontrado' 
            });
        }

        await admin.destroy();

        res.json({ 
            success: true,
            mensaje: 'Administrador eliminado correctamente' 
        });
    } catch (error) {
        console.error('Error al eliminar administrador:', error);
        res.status(500).json({ 
            success: false,
            mensaje: 'Error al eliminar el administrador',
            error: error.message 
        });
    }
}; 