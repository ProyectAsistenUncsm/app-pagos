// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  try {
    // Intentar obtener el token de las cookies primero
    let token = req.cookies?.token;
    
    // Si no está en las cookies, intentar obtenerlo del header Authorization
    if (!token && req.headers.authorization) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ mensaje: 'No hay sesión activa' });
    }

    const verificado = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
    req.user = verificado;
    next();
  } catch (error) {
    console.error('Error en verificación de token:', error);
    return res.status(401).json({ mensaje: 'Sesión inválida o expirada' });
  }
};
