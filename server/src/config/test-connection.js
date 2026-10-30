import 'dotenv/config';
import { databasePool } from './database.js';

try {
  const [rows] = await databasePool.query('SELECT 1 AS connection_test');
  console.log('Connexion MySQL réussie:', rows[0]);
} catch (error) {
  console.error('Échec de la connexion MySQL.');
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await databasePool.end();
}
