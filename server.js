const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const db = require('./app/models');

// Rutas
const authRoutes = require('./app/routes/authRoutes');
const pagoRoutes = require('./app/routes/paymentRoutes');
const usuarioRoutes = require('./app/routes/usuarios');
const servicioRoutes = require('./app/routes/servicios');

// Inicializa la app
const app = express();

// Seguridad y middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Motor de vistas EJS
app.set('view engine', 'ejs');
app.set('views', './app/views');

// Rutas de vistas (formularios)
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/vincular-servicio', (req, res) => {
  res.render('vincular-servicio');
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/servicios', servicioRoutes);

// Puerto y arranque
const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});
