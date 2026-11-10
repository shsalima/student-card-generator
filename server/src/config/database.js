import fs from 'node:fs';
import mysql from 'mysql2/promise';

const databaseConfig = {
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  database: process.env.DB_NAME ?? 'gestion_cartes_etudiants',
  user: process.env.DB_USER ?? 'root',
  password: process.env.DB_PASSWORD ?? '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export const databasePool = mysql.createPool(databaseConfig);

const schemaSql = fs.readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');

export const initializeDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: databaseConfig.host,
      port: databaseConfig.port,
      user: databaseConfig.user,
      password: databaseConfig.password,
      multipleStatements: true,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseConfig.database}\``);
    await connection.end();
    await databasePool.query(schemaSql);

    return true;
  } catch (error) {
    console.warn('Database initialization skipped:', error.message);
    return false;
  }
};

export const isDatabaseAvailable = async () => {
  try {
    await databasePool.query('SELECT 1 AS health_check');
    return true;
  } catch (error) {
    console.warn('MySQL unavailable:', error.message);
    return false;
  }
};
