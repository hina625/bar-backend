import express from 'express';
import simplifyController from '../controllers/simplifyController.js';

const router = express.Router();

router.post('/', simplifyController.simplify);

export default router;
