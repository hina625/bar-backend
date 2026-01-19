import { Readable } from 'stream';
import openaiService from '../services/openaiService.js';
import elevenLabsService from '../services/elevenLabsService.js';

class TtsController {
    async streamAudio(req, res) {
        try {
            const params = { ...req.query, ...req.body };
            const text = params.text;
            const voice = params.voice || 'alloy';
            const speed = parseFloat(params.speed) || 1.0;

            if (!text) {
                return res.status(400).json({ error: 'Text content is required' });
            }


            const safeText = text.substring(0, 4000);

            let response;

            // OpenAI voices
            const openAiVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

            if (openAiVoices.includes(voice)) {
                response = await openaiService.streamAudio(safeText, voice, speed);
            } else {
                // Assume it's an ElevenLabs Voice ID if not an OpenAI voice
                response = await elevenLabsService.streamAudio(safeText, voice, speed);
            }

            res.set({
                'Content-Type': 'audio/mpeg',
                'Transfer-Encoding': 'chunked'
            });

            // Pipe the body stream directly to the response
            if (response.body.pipe) {
                response.body.pipe(res);
            } else {
                Readable.fromWeb(response.body).pipe(res);
            }

        } catch (error) {
            console.error('TTS Controller Error:', error);
            res.status(500).json({ error: 'Failed to generate speech' });
        }
    }
}

export default new TtsController();
