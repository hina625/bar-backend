import express from 'express';
import { getPronunciation } from '../controllers/pronunciationController.js';

const router = express.Router();

router.post('/', getPronunciation);

export default router;
