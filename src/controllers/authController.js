import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Import the default export 'User'

// Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
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

    // Crear el usuario
    const nuevoUser = await User.create({
      nombre,
      correo,
      contrasena: contrasenaEncriptada,
      telefono,
      cedula,
      fecha_registro: new Date()
    });

    // Notificar a los clientes conectados sobre el nuevo usuario
    const io = req.app.get('io');
    if (io) {
      io.emit('nuevoUsuario', { nombre, correo });
    }

    res.status(201).json({ 
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUser.id,
        nombre: nuevoUser.nombre,
        correo: nuevoUser.correo,
        telefono: nuevoUser.telefono,
        cedula: nuevoUser.cedula
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      mensaje: 'Error al registrar el usuario',
      error: error.message 
    });
  }
};

// Iniciar sesión de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    // Validaciones básicas
    if (!correo || !contrasena) {
      return res.status(400).json({ 
        mensaje: 'Correo y contraseña son obligatorios' 
      });
    }

    const user = await User.findOne({ where: { correo } });

    if (!user) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(contrasena, user.contrasena);
    if (!esValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        correo: user.correo,
        nombre: user.nombre 
      }, 
      process.env.JWT_SECRET || 'tu_clave_secreta_por_defecto', 
      { expiresIn: '1h' }
    );

    // Enviar respuesta con el token
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Solo en producción
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000 // 1 hora
    });

    res.json({ 
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      mensaje: 'Error al iniciar sesión',
      error: error.message 
    });
  }
};

// Recuperar contraseña
export const RecoverPassword = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ mensaje: 'El correo es obligatorio' });
    }

    const user = await User.findOne({ where: { correo } });

    if (!user) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Generar el token JWT para recuperación
    const token = jwt.sign(
      { id: user.id, correo: user.correo }, 
      process.env.JWT_SECRET || 'tu_clave_secreta_por_defecto', 
      { expiresIn: '1h' }
    );

    res.json({ 
      mensaje: 'Se ha enviado un enlace de recuperación a tu correo',
      token 
    });
  } catch (error) {
    console.error('Error en recuperación:', error);
    res.status(500).json({ 
      mensaje: 'Error al procesar la recuperación de contraseña',
      error: error.message 
    });
  }
};



