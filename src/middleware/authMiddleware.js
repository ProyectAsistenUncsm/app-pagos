// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const verificarToken = async (req, res, next) => {
    console.log('Verificando token para ruta:', req.path);
    console.log('Cookies recibidas:', req.cookies);
    
    try {
        const token = req.cookies.token;

        if (!token) {
            console.log('No se encontró token en las cookies');
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({
                    success: false,
                    mensaje: 'No autorizado - Token no proporcionado'
                });
            }
            return res.redirect('/auth/login');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decodificado:', decoded);
            
            const usuario = await User.findByPk(decoded.id);
            console.log('Usuario encontrado:', usuario ? 'Sí' : 'No');

            if (!usuario) {
                console.log('Usuario no encontrado en la base de datos');
                if (req.path.startsWith('/api/')) {
                    return res.status(401).json({
                        success: false,
                        mensaje: 'Usuario no encontrado'
                    });
                }
                return res.redirect('/auth/login');
            }

            // Asegurarse de que el usuario tenga todos los datos necesarios
            req.user = {
                id: usuario.id,
                nombre: usuario.nombre,
                correo: usuario.correo,
                telefono: usuario.telefono,
                cedula: usuario.cedula,
                image_profile: usuario.image_profile,
                rol_id: usuario.rol_id
            };

            console.log('Usuario autenticado:', req.user);
            next();
        } catch (jwtError) {
            console.error('Error al verificar token:', jwtError);
            res.clearCookie('token');
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({
                    success: false,
                    mensaje: 'Token inválido o expirado'
                });
            }
            return res.redirect('/auth/login');
        }
    } catch (error) {
        console.error('Error en verificarToken:', error);
        res.clearCookie('token');
        if (req.path.startsWith('/api/')) {
            return res.status(500).json({
                success: false,
                mensaje: 'Error al verificar autenticación',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        return res.redirect('/auth/login');
    }
};

// Middleware para verificar si es administrador
export const esAdmin = async (req, res, next) => {
    console.log('Verificando rol de administrador para ruta:', req.path);
    console.log('Usuario actual:', req.user);
    
    try {
        if (!req.user) {
            console.log('No hay usuario autenticado');
            if (req.path.startsWith('/api/')) {
                return res.status(401).json({
                    success: false,
                    mensaje: 'No autorizado'
                });
            }
            return res.redirect('/auth/login');
        }

        if (req.user.rol_id !== 1) { // 1 = Admin
            console.log('Usuario no es administrador');
            if (req.path.startsWith('/api/')) {
                return res.status(403).json({
                    success: false,
                    mensaje: 'No tienes permisos para realizar esta acción'
                });
            }
            return res.status(403).render('error', {
                mensaje: 'No tienes permisos para acceder a esta página'
            });
        }

        console.log('Usuario es administrador');
        next();
    } catch (error) {
        console.error('Error en verificación de admin:', error);
        if (req.path.startsWith('/api/')) {
            return res.status(500).json({
                success: false,
                mensaje: 'Error al verificar permisos',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
        res.status(500).render('error', {
            mensaje: 'Error al verificar permisos'
        });
    }
};