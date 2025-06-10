import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import authRoutes from './routes/authRoutes.js';
import indexRoutes from './routes/indexRoutes.js';
import userRoutes from './routes/userRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import { User } from './models/indexModel.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import historialRoutes from './routes/historial.js';
import dotenv from 'dotenv';


// Configurar variables de entorno
dotenv.config();

// Configurar __dirname (por usar ESModules)
const __dirname = dirname(fileURLToPath(import.meta.url));

// Inicializar app
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middlewares globales
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'publicassets')));

// Configurar motor de vistas
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware de autenticación JWT
app.use(async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
      const usuario = await User.findByPk(decoded.id);
      if (usuario) {
        res.locals.usuario = usuario;
        req.user = usuario;
      }
    }
  } catch (err) {
    console.error("Token inválido o ausente:", err.message);
  }
  next();
});

// Configuración de Socket.IO
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

// Rutas
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/service', serviceRoutes);
app.use('/pay', paymentRoutes);
app.use('/admin', adminRoutes);
app.use('/historial', historialRoutes);
app.use('/', indexRoutes);

// 404 - Página no encontrada
app.use((req, res) => {
  res.status(404).render('404', {
    mensaje: 'Página no encontrada',
    usuario: req.user
  });
});

// Arranque del servidor (PORT dinámico para Heroku)
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export { app, io };

