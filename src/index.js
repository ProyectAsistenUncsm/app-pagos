import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';


import indexRoutes from './routes/indexRoutes.js';

import { User } from './models/indexModel.js'; // Use import here (adjust path if needed)

const app = express();

//directory of files
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(indexRoutes);
app.use('/auth', indexRoutes);

app.use(express.static(join(__dirname, 'publicassets')));





app.listen(process.env.PORT || 3000);
console.log('Server is running on port', 3000);

