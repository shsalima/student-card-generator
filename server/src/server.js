import 'dotenv/config';
import express from 'express';
import { initializeDatabase } from './config/database.js';
import studentsRouter from './routes/students.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/health', async (_request, response) => {
  const dbReady = await initializeDatabase().catch(() => false);
  response.json({ status: 'ok', databaseReady: dbReady });
});

app.use('/api', studentsRouter);

app.use((error, _request, response, _next) => {
  console.error('Unexpected server error:', error);
  response.status(500).json({ success: false, message: 'Erreur serveur interne.' });
});

const bootstrap = async () => {
  const dbReady = await initializeDatabase();
  console.log(dbReady ? 'MySQL database initialized successfully.' : 'MySQL database not reachable; API remains in fallback mode.');

  app.listen(port, () => {
    console.log(`API server listening on port ${port}`);
  });
};

bootstrap();
