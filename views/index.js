import express from 'express';
import { v4 as uuidv4 } from 'uuid';


const port =  process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const mySettings = process.env.MY_SETTING;
const version = 4;

const app = express();
app.use(express.json());