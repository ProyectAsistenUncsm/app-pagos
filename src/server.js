console.log('Hola mundo');

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const db = require('../models');
const Pago = require('../models/Pago');
const cookieParser = require('cookie-parser');
const http = require('http');
const { Server } = require('socket.io'); // solo si 



// Rutas
const authRoutes = require('../routes/authRoutes');
const paymentRoutes = require('../routes/paymentRoutes');
const usuarioRoutes = require('../routes/usuarios');
const servicioRoutes = require('../routes/servicios');
const adminRoutes = require('../routes/admin');
const historialRoutes = require('./routes/historial');
const path = require('path');
// Inicializa la app
const app = express();


// Seguridad y middlewares
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb',extended: true }));



// Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('io', io);

// Rutas de vistas (formularios)
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/vincular-servicio', (req, res) => {
  res.render('vincular-servicio');
});

app.get('/historial/:usuarioId', async (req, res) => {
  try {
    const pagos = await Pago.find({ usuario: req.params.usuarioId }).populate('PayService');
    res.render('historial', { pagos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar historial');
  }
});



app.use(express.static(path.join(__dirname, 'src/publicassets')));

app.use(express.static('src/publicassets'));
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pagos', paymentRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/historial', historialRoutes);


// 404 - Página no encontrada
app.use((req, res) => {
  res.status(404).render('404', {
    mensaje: 'Página no encontrada',
    usuario: req.user
  });
});

// 404 - Página no encontrada
app.use((req, res) => {
  res.status(404).render('404', {
    mensaje: 'Página no encontrada',
    usuario: req.user
  });
});

// Manejo de errores generales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});


// Escuchar en puerto (para Heroku usar process.env.PORT)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});


