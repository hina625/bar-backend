import express from 'express';
import openaiService from '../services/openaiService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { text, context } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const action = await openaiService.parseVoiceCommand(text, context);
        res.json({ action });
    } catch (error) {
        console.error('Voice command parsing error:', error);
        res.status(500).json({ error: 'Failed to parse voice command' });
    }
});

export default router;
