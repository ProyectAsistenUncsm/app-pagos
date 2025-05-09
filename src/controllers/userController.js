const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario, UsuarioServicio } = require('../models');

// Registro de usuario
exports.registrarUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena, telefono, direccion } = req.body;

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, salt);

    // Crear el usuario
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      contrasena: contrasenaEncriptada,
      telefono,
      direccion,
      fecha_registro: new Date()
    });

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', usuario: nuevoUsuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
};

// Iniciar sesión de usuario
exports.loginUsuario = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    const usuario = await Usuario.findOne({ where: { correo } });

    if (!usuario) {
      return res.status(400).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const esValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!esValida) {
      return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: usuario.id, correo: usuario.correo }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

// Obtener perfil del usuario
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const usuario = await Usuario.findByPk(usuarioId, {
      include: [
        {
          model: UsuarioServicio,
          include: ['servicio']
        }
      ]
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ usuario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener el perfil' });
  }
};
