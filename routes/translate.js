import express from 'express';
import openaiService from '../services/openaiService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { text, targetLanguage } = req.body;

        if (!text || !targetLanguage) {
            return res.status(400).json({ error: 'Text and target language are required' });
        }

        const translatedText = await openaiService.translateText(text, targetLanguage);
        res.json({ translatedText });
    } catch (error) {
        console.error('Translation Controller Error:', error);
        res.status(500).json({ error: 'Failed to translate text' });
    }
});

export default router;
