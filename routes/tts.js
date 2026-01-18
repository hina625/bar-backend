import express from 'express';
import ttsController from '../controllers/ttsController.js';

const router = express.Router();

router.get('/', ttsController.streamAudio);
router.post('/', ttsController.streamAudio);

export default router;
