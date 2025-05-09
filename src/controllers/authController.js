const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

exports.register = async (req, res) => {
  try {
    const { nombre, correo, contrasena, telefono, direccion } = req.body;
    const hash = await bcrypt.hash(contrasena, 10);
    const user = await Usuario.create({
      nombre, correo, contrasena: hash, telefono, direccion, fecha_registro: new Date(),
    });
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { correo, contrasena } = req.body;
  const user = await Usuario.findOne({ where: { correo } });
  if (!user || !(await bcrypt.compare(contrasena, user.contrasena))) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};

