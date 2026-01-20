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


            console.log(`[TTS] Request received: voice=${voice}, speed=${speed}, textLength=${text?.length}`);

            if (!text) {
                return res.status(400).json({ error: 'Text content is required' });
            }


            const safeText = text.substring(0, 4000);

            let response;

            // OpenAI voices
            const openAiVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];

            if (openAiVoices.includes(voice)) {
                console.log(`[TTS] Using OpenAI Service for voice: ${voice}`);
                response = await openaiService.streamAudio(safeText, voice, speed);
            } else {
                console.log(`[TTS] Using ElevenLabs Service for voice: ${voice}`);
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
            
            // Provide more detailed error messages
            let errorMessage = 'Failed to generate speech';
            let statusCode = 500;
            
            if (error.message) {
                if (error.message.includes('not initialized') || error.message.includes('API key')) {
                    errorMessage = 'TTS service is not configured. Please check API keys.';
                    statusCode = 503;
                } else if (error.message.includes('network') || error.message.includes('timeout')) {
                    errorMessage = 'Network error while generating speech. Please try again.';
                    statusCode = 503;
                } else {
                    errorMessage = error.message;
                }
            }
            
            res.status(statusCode).json({ 
                error: errorMessage,
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
}

export default new TtsController();
