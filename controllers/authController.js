// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

exports.register = async (req, res) => {
  const { nombre, correo, contrasena, telefono, direccion } = req.body;
  const hashedPassword = await bcrypt.hash(contrasena, 10);

  try {
    const usuario = await Usuario.create({
      nombre,
      correo,
      contrasena: hashedPassword,
      telefono,
      direccion,
      fecha_registro: new Date(),
    });

    res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el usuario', error });
  }
};

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { correo } });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!validPassword) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ mensaje: 'Autenticación exitosa', token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al autenticar el usuario', error });
  }
};
