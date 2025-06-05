import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import indexRoutes from './routes/indexRoutes.js';
import { User } from './models/indexModel.js';

// Configurar __dirname (por usar ESModules)
const __dirname = dirname(fileURLToPath(import.meta.url));

// Inicializar app
const app = express();

// Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// Rutas
app.use('/auth', authRoutes);
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
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;
