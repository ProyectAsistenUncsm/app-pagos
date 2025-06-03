import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Import the default export 'User'

// Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, contrasena, telefono, cedula } = req.body;

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Verificar si la cédula ya existe
    const cedulaExistente = await User.findOne({ where: { cedula } });
    if (cedulaExistente) {
      return res.status(400).json({ mensaje: 'La cédula ya está registrada' });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    // Crear el usuario
    const nuevoUser = await User.create({
      nombre,
      email,
      contrasena: contrasenaEncriptada,
      telefono,
      cedula,
      fecha_registro: new Date()
    });

    // Notificar a los clientes conectados sobre el nuevo usuario
    const io = req.app.get('io');
    if (io) {
      io.emit('nuevoUsuario', { nombre, email });
    }

    res.status(201).json({ 
      mensaje: 'Usuario registrado correctamente',
      usuario: {
        id: nuevoUser.id,
        nombre: nuevoUser.nombre,
        email: nuevoUser.email,
        telefono: nuevoUser.telefono,
        cedula: nuevoUser.cedula
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
};

// Iniciar sesión de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    const user = await User.findOne({ where: { email } });

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
        email: user.email,
        nombre: user.nombre 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Enviar respuesta con el token
    res.json({ 
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

// Recuperar contraseña
export const RecoverPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ mensaje: 'Cambio de contraseña exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
  }
};



