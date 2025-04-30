const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const db = require('./app/models');

const authRoutes = require('./app/routes/authRoutes');
const pagoRoutes = require('./app/routes/paymentRoutes');

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pagos', pagoRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});
