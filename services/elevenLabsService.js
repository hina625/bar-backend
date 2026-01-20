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
        // For speed control in ElevenLabs, we can use model_id 'eleven_turbo_v2' which supports speed better
        // or use SSML tags for speed control
        const useTurboModel = process.env.ELEVENLABS_USE_TURBO === 'true';
        const modelId = useTurboModel ? 'eleven_turbo_v2' : 'eleven_multilingual_v2';
        
        // Format text for better pronunciation of Roman Urdu (not Hindi)
        // Roman Urdu uses English alphabet, so we ensure proper spacing
        const formattedText = text.trim();
        
        const body = {
            text: formattedText,
            model_id: modelId,
            voice_settings: {
                stability: 0.5,
                similarity_boost: 0.75,
                style: 0.0,
                use_speaker_boost: true
            }
        };

        // Speed is handled differently in ElevenLabs v2 - it's a model parameter, not voice setting
        // For older models, speed might not be fully supported
        if (useTurboModel && speed !== 1.0) {
            // For turbo model, we can adjust output sample rate or use SSML
            // But for now, we'll note that speed adjustment may be limited
            console.log(`[ElevenLabs] Speed parameter (${speed}) requested but may not be fully supported for this voice/model`);
        }

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
            let errorText;
            try {
                const errorData = await response.json();
                errorText = errorData.detail?.message || errorData.message || JSON.stringify(errorData);
            } catch {
                errorText = await response.text();
            }
            
            // Provide more helpful error messages
            if (response.status === 401) {
                throw new Error('ElevenLabs API key is invalid or expired. Please check your API key.');
            } else if (response.status === 400) {
                throw new Error(`Invalid request to ElevenLabs: ${errorText}. Check voice ID and text format.`);
            } else if (response.status === 404) {
                throw new Error(`ElevenLabs voice ID not found: ${voiceId}. Please verify the voice ID is correct.`);
            } else if (response.status === 429) {
                throw new Error('ElevenLabs rate limit exceeded. Please try again later.');
            } else {
                throw new Error(`ElevenLabs API Error (${response.status}): ${errorText}`);
            }
        }

        return response;
    }
}

export default new ElevenLabsService();
