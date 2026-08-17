import express from 'express';
import {
  translateController,
  translateFileController,
  translateBatchController,
  getServiceStatusController
} from '../controllers/translation.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/translate - Translate text
router.post('/translate', translateController);

// POST /api/translate/file - Translate file
router.post('/translate/file', upload.single('file'), translateFileController);

// POST /api/translate/batch - Translate multiple texts
router.post('/translate/batch', translateBatchController);

// GET /api/services/status - Get status of all services
router.get('/services/status', getServiceStatusController);

export default router;
