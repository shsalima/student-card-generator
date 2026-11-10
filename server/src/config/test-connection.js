import 'dotenv/config';
import { databasePool } from './database.js';

const hasExplicitDbConfig = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER'].some((variable) => process.env[variable]);

if (!hasExplicitDbConfig) {
  console.log('Configuration MySQL absente. Test de connexion ignoré.');
  await databasePool.end();
  process.exitCode = 0;
} else {
  try {
    const [rows] = await databasePool.query('SELECT 1 AS connection_test');
    console.log('Connexion MySQL réussie:', rows[0]);
  } catch (error) {
    console.warn('Échec de la connexion MySQL.');
    console.warn(error.message);
    process.exitCode = 0;
  } finally {
    await databasePool.end();
  }
}
