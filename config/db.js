// config/db.js
import dotenv from 'dotenv';
import pg from 'pg';
import { Sequelize } from 'sequelize';

dotenv.config();

const { Pool } = pg;

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

export { sequelize, pool };
