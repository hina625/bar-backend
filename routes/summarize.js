import express from 'express';
import summarizeController from '../controllers/summarizeController.js';

const router = express.Router();

router.post('/', summarizeController.summarize);
router.get('/history', summarizeController.getHistory);
router.delete('/history/:id', summarizeController.deleteHistoryItem);

export default router;
