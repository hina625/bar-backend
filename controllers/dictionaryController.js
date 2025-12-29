import dictionaryService from '../services/dictionaryService.js';

class DictionaryController {
    async getDefinition(req, res) {
        const { word } = req.params;

        if (!word) {
            return res.status(400).json({ error: 'Word is required' });
        }

        try {
            const definitionData = await dictionaryService.getDefinition(word);
            res.json(definitionData);
        } catch (error) {
            console.error('Dictionary Controller Error:', error);
            res.status(404).json({ error: 'Definition not found' });
        }
    }
}

export default new DictionaryController();
