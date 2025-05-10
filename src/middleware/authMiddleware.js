// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => { // Use 'export const' for a named ESM export
  const token = req.cookies.token || req.headers['authorization'];

  if (!token) {
    return res.status(401).send('Acceso denegado');
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado;
    next();
  } catch (error) {
    return res.status(400).send('Token inválido');
  }
};
