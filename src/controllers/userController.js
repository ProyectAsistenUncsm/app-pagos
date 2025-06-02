import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioService } from '../models/indexModel.js';
import User from '../models/userModel.js'; // Import the default export 'User'



// Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, telefono, direccion } = req.body;

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    // Crear el usuario
    const nuevoUser = await User.create({ // Use the imported 'User' class
      nombre,
      correo,
      contrasena: contrasenaEncriptada,
      telefono,
      direccion,
      fecha_registro: new Date()
    });

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: nuevoUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }

  const io = req.app.get('io');
io.emit('nuevoUsuario', { nombre, correo });
};

// Iniciar sesión de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const user = await User.findOne({ where: { correo } });

    if (!user) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(contrasena, User.contrasena);
    if (!esValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: User.id, correo: User.correo }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 43200000 // 12 hora
  }).redirect('/perfil'); // o cualquier otra vista
};

// Obtener perfil del usuario
// Agrega esta función si usas EJS en lugar de solo APIs JSON
export const vistaPerfil = async (req, res) => {
  try {
    const usuarioId = req.User.id;
    const usuario = await User.findByPk(usuarioId, {
      include: [{ model: UsuarioService, include: ['servicio'] }]
    });

    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    res.render('perfil', { usuario });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el perfil');
  }
};

// Actualizar estado de servicio
exports.actualizarEstadoServicio = async (req, res) => {
  try {
    const { usuario_id, servicio_id, nuevoEstado } = req.body;

    const servicio = await UsuarioServicio.findOne({
      where: { usuario_id, servicio_id }
    });

    if (!servicio) {
      return res.status(404).json({ mensaje: 'Servicio no encontrado' });
    }

    servicio.estado = nuevoEstado;
    await servicio.save();

    // Emitir evento WebSocket
    const io = req.app.get('io');
    io.emit('servicioActualizado', {
      usuario_id,
      servicio_id,
      estado: nuevoEstado
    });

    res.json({ mensaje: 'Estado actualizado', servicio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al actualizar el estado' });
  }
};
