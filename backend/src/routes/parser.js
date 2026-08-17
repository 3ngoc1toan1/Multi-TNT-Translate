import express from 'express';
import {
  parseFileController,
  generateFileController
} from '../controllers/parser.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// POST /api/parse - Parse file
router.post('/parse', upload.single('file'), parseFileController);

// POST /api/generate - Generate file
router.post('/generate', generateFileController);

export default router;
