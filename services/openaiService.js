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
                        
Understand their intent and return ONLY one of these action codes:
- scroll_down (user wants to scroll down, go down, neeche, نیچے)
- scroll_up (user wants to scroll up, go up, upar, اوپر)
- go_top (user wants to go to top of page)
- go_bottom (user wants to go to bottom of page)
- go_back (user wants to go back, previous page, wapas, واپس)
- go_forward (user wants to go forward, next page, aage, آگے)
- refresh (user wants to refresh, reload the page)
- click (user wants to click current element)
- next_link (user wants to focus next link)
- next_button (user wants to focus next button)
- increase_font (user wants bigger text, increase font size)
- decrease_font (user wants smaller text, decrease font size)
- dark_mode (user wants to toggle dark mode)
- high_contrast (user wants to toggle high contrast)
- none (if you cannot determine the action)

Return ONLY the action code, nothing else.`
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

