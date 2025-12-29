import express from 'express';
import ttsController from '../controllers/ttsController.js';

const router = express.Router();

router.post('/', ttsController.streamAudio);

export default router;
