import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import indexRoutes from './routes/indexRoutes.js';
import { User } from './models/indexModel.js';


// const jwt = require('jsonwebtoken');
//const routes_user = require('./routes/userRoutes.js');
//const { User } = require('./models/indexModel.js'); // Usando require

//app.use('/', routes_user);

//directory of files
const __dirname = dirname(fileURLToPath(import.meta.url));

// Middleware básico
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'publicassets')));

// Configuración de vistas
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware para agregar datos del usuario a las vistas
app.use(async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const usuario = await User.findByPk(decoded.id);
      if (usuario) {
        res.locals.usuario = usuario; // disponible en EJS como <%= usuario %>
        req.usuario = usuario; // opcional si necesitas usarlo en controladores
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

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).render('404', { 
    mensaje: 'Página no encontrada',
    usuario: req.user 
  });
});

app.listen(process.env.PORT || 3000);
console.log('Server is running on port', 3000);

