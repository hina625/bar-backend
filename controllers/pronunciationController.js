import openaiService from '../services/openaiService.js';

export const getPronunciation = async (req, res) => {
    try {
        const { text, language = 'en' } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        const prompt = `
        Provide the pronunciation guide for the following text in language '${language}': "${text}".
        Return ONLY a JSON object with the following keys:
        - "ipa": The International Phonetic Alphabet representation.
        - "syllables": An array of strings representing the syllable breakdown.
        - "simple_pronunciation": A phonetic respelling for easy reading (e.g., "kuh-mpyoo-tur").
        - "translation": (Optional) Translation in English if the text is not English.
        `;

        const response = await openaiService.generateCompletion(prompt, 'json_object');

        // Parse the JSON string from OpenAI
        // Sanitize string to remove markdown code blocks if present
        const jsonString = response.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
        const data = JSON.parse(jsonString);

        res.json(data);
    } catch (error) {
        console.error('Pronunciation Error:', error);
        res.status(500).json({ error: error.message || 'Failed to fetch pronunciation data' });
    }
};
