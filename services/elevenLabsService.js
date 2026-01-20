import fetch from 'node-fetch';

class ElevenLabsService {
    constructor() {
        this.baseUrl = 'https://api.elevenlabs.io/v1';
    }

    async streamAudio(text, voiceId, speed = 1.0) {
        const apiKey = process.env.ELEVENLABS_API_KEY;

        if (!apiKey) {
            throw new Error('ELEVENLABS_API_KEY is not set');
        }

        // Stability and similarity boost can be adjusted based on preference
        // 0.5 is a good default for both
        const body = {
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                speed: speed // Note: ElevenLabs might handle speed differently or via tags, but basic model settings don't explicitly have 'speed' param in the same way. We'll ignore for now or use if v2 supports it. v1 doesn't directly support speed param in settings, but we keep the interface consistent.
            }
        };

        const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}/stream`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'xi-api-key': apiKey,
                'Accept': 'audio/mpeg'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`ElevenLabs API Error: ${response.status} - ${errorText}`);
        }

        return response;
    }
}

export default new ElevenLabsService();
