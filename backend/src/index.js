import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import translationRoutes from './routes/translation.js';
import parserRoutes from './routes/parser.js';
import healthRoutes from './routes/health.js';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api', translationRoutes);
app.use('/api', parserRoutes);
app.use('/api', healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Multi-TNT-Translate Backend`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`\n🔗 API Endpoints:`);
  console.log(`  POST   http://localhost:${PORT}/api/translate`);
  console.log(`  POST   http://localhost:${PORT}/api/translate/file`);
  console.log(`  POST   http://localhost:${PORT}/api/translate/batch`);
  console.log(`  GET    http://localhost:${PORT}/api/services/status`);
  console.log(`  POST   http://localhost:${PORT}/api/parse`);
  console.log(`  POST   http://localhost:${PORT}/api/generate`);
  console.log(`  GET    http://localhost:${PORT}/api/health`);
  console.log(`\n`);
});

export default app;
