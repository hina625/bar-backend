import OpenAI from 'openai';

class OpenAIService {
    get openai() {
        if (!this._openai) {
            if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
                console.warn('WARNING: OPENAI_API_KEY is not set correctly in .env');
                return null;
            }
            this._openai = new OpenAI({
                apiKey: process.env.OPENAI_API_KEY,
            });
        }
        return this._openai;
    }

    async summarizeText(text) {
        try {
            const client = this.openai;
            if (!client) {
                throw new Error('OpenAI client is not initialized. Please check your API key.');
            }

            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful assistant that summarizes text concisely for accessibility purposes."
                    },
                    {
                        role: "user",
                        content: `Summarize the following text:\n\n${text}`
                    }
                ],
                max_tokens: 150,
            });

            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI Service Error:', error);
            throw new Error(`Failed to summarize text via OpenAI: ${error.message}`);
        }
    }

    async generateCompletion(prompt, responseFormat = 'text') {
        try {
            const client = this.openai;
            if (!client) {
                throw new Error('OpenAI client is not initialized.');
            }

            const options = {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
            };

            if (responseFormat === 'json_object') {
                options.response_format = { type: "json_object" };
            }

            const response = await client.chat.completions.create(options);
            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI Completion Error:', error);
            throw new Error(`Failed to generate completion via OpenAI: ${error.message}`);
        }
    }

    async streamAudio(text, voice = 'alloy', speed = 1.0) {
        try {
            const client = this.openai;
            if (!client) {
                throw new Error('OpenAI client is not initialized.');
            }

            const mp3 = await client.audio.speech.create({
                model: "tts-1",
                voice: voice,
                input: text,
                speed: speed,
            });

            return Buffer.from(await mp3.arrayBuffer());
        } catch (error) {
            console.error('OpenAI TTS Error:', error);
            throw new Error(`Failed to generate audio via OpenAI: ${error.message}`);
        }
    }

    async translateText(text, targetLanguage) {
        try {
            const client = this.openai;
            if (!client) {
                throw new Error('OpenAI client is not initialized.');
            }

            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a translator. Translate the following text to ${targetLanguage}. Only return the translated text, nothing else.`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                max_tokens: 1000,
            });

            return response.choices[0].message.content.trim();
        } catch (error) {
            console.error('OpenAI Translation Error:', error);
            throw new Error(`Failed to translate text via OpenAI: ${error.message}`);
        }
    }

    async parseVoiceCommand(text) {
        try {
            const client = this.openai;
            if (!client) {
                throw new Error('OpenAI client is not initialized.');
            }

            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: `You are a voice command parser for website accessibility. The user will speak in any language (English, Urdu, Hindi, Arabic, etc.). 
                        
Understand their intent and return ONLY one of these action codes. Be very flexible with synonyms and related phrases:
- scroll_down (scroll down, go down, move down, more, niche, neeche, نیچے)
- scroll_up (scroll up, go up, move up, less, upar, اوپر)
- go_top (top of page, start, beginning, shuru, شروع)
- go_bottom (bottom of page, end, finish, akhir, آخر)
- go_back (go back, previous, return, wapas, piche, واپس, پیچھے)
- go_forward (go forward, next, ahead, aage, آگے)
- refresh (refresh, reload, restart page, dobara loader, تازہ کریں)
- click (click, select, press, push, chuno, دباؤ, چنیں)
- next_link (next link, move to link, agla link, اگلا لنک)
- next_button (next button, move to button, agla button, اگلا بٹن)
- increase_font (bigger text, larger font, zoom in text, bada karo, بڑا کریں)
- decrease_font (smaller text, tiny font, zoom out text, chota karo, چھوٹا کریں)
- dark_mode (dark mode, night mode, black theme, andhera, کالی تھیم, اندھیرا)
- high_contrast (high contrast, sharp colors, clear view, wazeh, واضح)
- none (if you cannot determine the action or it's just random chatter)

IMPORTANT:
1. Focus on the INTENT, not just literal words.
2. If the user says something like "make it dark", map it to dark_mode.
3. If the user says "neeche jao", map it to scroll_down.
4. Return ONLY the lowercase action code string, no punctuation.`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                max_tokens: 50,
            });

            return response.choices[0].message.content.trim().toLowerCase();
        } catch (error) {
            console.error('OpenAI Voice Command Error:', error);
            return 'none';
        }
    }
}

export default new OpenAIService();

