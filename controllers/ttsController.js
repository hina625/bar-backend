import openaiService from '../services/openaiService.js';

class TtsController {
    async streamAudio(req, res) {
        try {
            const { text, voice = 'alloy', speed = 1.0 } = req.body;

            if (!text) {
                return res.status(400).json({ error: 'Text content is required' });
            }

            // Limit text length to avoid timeouts/limits (OpenAI limit is 4096 chars)
            const safeText = text.substring(0, 4000);

            const audioedBuffer = await openaiService.streamAudio(safeText, voice, speed);

            res.set({
                'Content-Type': 'audio/mpeg',
                'Content-Length': audioedBuffer.length,
            });

            res.send(audioedBuffer);

        } catch (error) {
            console.error('TTS Controller Error:', error);
            res.status(500).json({ error: 'Failed to generate speech' });
        }
    }
}

export default new TtsController();
