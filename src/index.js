import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


import indexRoutes from './routes/indexRoutes.js';

const app = express();

//directory of files
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(indexRoutes);
app.use('/auth', indexRoutes);

app.use(express.static(join(__dirname, 'publicassets')));


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



app.listen(process.env.PORT || 3000);
console.log('Server is running on port', 3000);

