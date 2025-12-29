import express from 'express';
import dictionaryController from '../controllers/dictionaryController.js';

const router = express.Router();

router.get('/:word', dictionaryController.getDefinition);

export default router;
