import axios from 'axios';
import openaiService from './openaiService.js';

class DictionaryService {
    async getDefinition(word) {
        try {
            // Try Free Dictionary API first
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);

            if (response.data && response.data.length > 0) {
                const entry = response.data[0];
                const firstMeaning = entry.meanings[0];
                const firstDefinition = firstMeaning?.definitions[0];

                return {
                    word: entry.word,
                    meaning: firstDefinition?.definition,
                    partOfSpeech: firstMeaning?.partOfSpeech,
                    phonetic: entry.phonetic || entry.phonetics?.find(p => p.text)?.text,
                    example: firstDefinition?.example,
                    synonyms: firstMeaning?.synonyms?.slice(0, 3) || [],
                    source: 'dictionary-api'
                };
            }
        } catch (error) {
            console.warn(`Dictionary API failed for "${word}", falling back to AI...`);
        }

        // Fallback to OpenAI
        try {
            const prompt = `Define the word "${word}".
            Return a JSON object with:
            - word: "${word}"
            - partOfSpeech: (e.g., Verb, Noun)
            - phonetic: IPA transcription (e.g., /kri:'eit/)
            - simplePhonetic: Simple pronunciation (e.g., [kree-ayt])
            - meaning: A clear definition.
            - example: A usage example sentence.
            - synonyms: An array of up to 3 synonyms.
            `;

            const aiResponse = await openaiService.generateCompletion(prompt, 'json_object');
            const jsonString = aiResponse.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/```$/, '').trim();
            const data = JSON.parse(jsonString);

            return {
                ...data,
                source: 'ai'
            };
        } catch (aiError) {
            console.error('AI Dictionary Fallback Error:', aiError);
            throw new Error('Definition not found');
        }
    }
}

export default new DictionaryService();
