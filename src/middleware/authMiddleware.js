// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const verificarToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/auth/login');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await User.findByPk(decoded.id);

    if (!usuario) {
      return res.redirect('/auth/login');
    }

    // Asegurarse de que el usuario tenga todos los datos necesarios
    req.user = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono,
      cedula: usuario.cedula,
      image_profile: usuario.image_profile
    };

    next();
  } catch (error) {
    console.error('Error en verificarToken:', error);
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
};
