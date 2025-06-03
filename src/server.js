console.log('Hola mundo');

const express = require('express');
const http = require('http')
const socketIO = require('socket.io')
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const db = require('../models');

// Rutas
const authRoutes = require('../routes/authRoutes');
const pagoRoutes = require('../routes/paymentRoutes');
const usuarioRoutes = require('../routes/usuarios');
const servicioRoutes = require('../routes/servicios');

// Inicializa la app
const app = express();
const server = http.createServer(app);
//const io = socketIO(server);

// Seguridad y middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO
const { Server } = require('socket.io');
const io = new Server(server);

// WebSocket
io.on('connection', (socket) => {
  console.log('🟢 Usuario conectado por WebSocket', socket.id);

  socket.on('mensaje', (data) => {
    console.log('Mensaje recibido:', data);
    // Reenviar el mensaje a todos
    io.emit('mensaje', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Usuario desconectado', socket.id);
  });
});

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

app.use(express.static('src/publicassets'));
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pagos', pagoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/servicios', servicioRoutes);

// Puerto y arranque
//const PORT = process.env.PORT || 3000;

//db.sequelize.sync().then(() => {
 // app.listen(PORT, () => {
 //   console.log(`Servidor corriendo en puerto ${PORT}`);
 // });
//});

// Escuchar en puerto (para Heroku usar process.env.PORT)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});


