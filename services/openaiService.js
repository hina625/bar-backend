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

    async parseVoiceCommand(text, context) {
        try {
            const client = this.openai;
            if (!client) {
                throw new Error('OpenAI client is not initialized.');
            }

            const systemPrompt = `You are a Universal Website Control Agent. Your goal is to map user voice commands to actions on the current webpage.
You will be provided with the user's spoken command and a context summary of the webpage (links, buttons, inputs).

OUTPUT FORMAT:
You MUST return a JSON object with one of the following structures:

1. CLICK (for clicking links or buttons):
   { "action": "click_element", "selector": "ELEMENT_ID_OR_SELECTOR" }

2. TYPE (for inputting text):
   { "action": "type_text", "selector": "INPUT_ID", "value": "TEXT_TO_TYPE" }

3. NAVIGATE (for general URL navigation):
   { "action": "navigate", "url": "FULL_URL" }

4. SCROLL:
   { "action": "scroll", "value": "up" | "down" | "top" | "bottom" }

5. ACCESSIBILITY (for feature toggles):
   { "action": "FEATURE_CODE" }
   Feature Codes: dark_mode, light_mode, high_contrast, grayscale, invert, toggle_ruler, toggle_guide, toggle_mask, toggle_spotlight, toggle_magnifier, toggle_links, toggle_headings, toggle_buttons, toggle_images, toggle_animations, toggle_tts, increase_font, decrease_font, reset_font, reset_all.

6. UNKNOWN:
   { "action": "none" }

RULES:
- If the user mentions a specific button or link text (e.g., "click Contact"), find the matching element in the provided context and return a "click_element" action with its ID.
- Be flexible with language (English, Urdu, Hindi, etc.). Translate the intent to the action.
- If the command is vague (e.g., "go down"), use scroll.
- If the user wants to search or type, use "type_text".
- Pioritize accessibility commands if the intent matches them.
`;

            const userPrompt = `User Command: "${text}"
            
Current Page Context:
URL: ${context?.url || 'Unknown'}
Title: ${context?.title || 'Unknown'}
Interactive Elements:
${JSON.stringify(context?.elements || [], null, 2)}
`;

            const response = await client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ],
                max_tokens: 150,
                response_format: { type: "json_object" }
            });

            const content = response.choices[0].message.content;
            return JSON.parse(content);

        } catch (error) {
            console.error('OpenAI Voice Command Error:', error);
            return { action: 'none' };
        }
    }
}

export default new OpenAIService();

