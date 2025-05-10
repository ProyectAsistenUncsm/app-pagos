// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

exports.verificarToken = (req, res, next) => {
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

router.get('/perfil', verificarToken, async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      include: [{ model: UsuarioServicio, include: ['servicio'] }]
    });

    if (!usuario) return res.status(404).send('Usuario no encontrado');

    res.render('perfil', { usuario }); // Asegúrate de tener perfil.ejs
  } catch (err) {
    res.status(500).send('Error al cargar perfil');
  }
});

