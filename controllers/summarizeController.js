import openaiService from '../services/openaiService.js';
import Summary from '../models/Summary.js';

class SummarizeController {
    async summarize(req, res) {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ error: 'Text is required' });
        }

        try {

            const prompt = `
            Analyze the following text and provide:
            1. A comprehensive summary.
            2. A simplified version of that summary (easier to read, simpler vocabulary).
            3. A list of acronyms found in the text.

            Return ONLY a JSON object with the following keys:
            - "summary": The comprehensive summary (approx 200 words).
            - "simplified_summary": The simplified version of the summary (approx 150 words, easy to understand).
            - "acronyms": An object where keys are acronyms found in the text and values are their full forms.

            Text:
            ${text}
            `;

            const jsonResponse = await openaiService.generateCompletion(prompt, 'json_object');
            const data = JSON.parse(jsonResponse);

            const summaryText = data.summary;
            const simplifiedSummary = data.simplified_summary;
            const acronyms = data.acronyms || {};


            // Optional: Save to history without blocking the response

            // Fire-and-forget save to history (don't await)
            const summaryEntry = new Summary({
                originalText: text,
                summaryText: summaryText,
            });
            summaryEntry.save().catch(dbError => {
                console.error('Database Save Error (Summarization history):', dbError.message);
            });

            res.json({
                summary: summaryText,
                simplifiedSummary: simplifiedSummary,
                acronyms: acronyms
            });
        } catch (error) {
            console.error('Summarize Controller Error:', error);
            res.status(500).json({ error: error.message || 'Internal Server Error' });
        }
    }

    async getHistory(req, res) {
        try {
            const history = await Summary.find().sort({ createdAt: -1 }).limit(50);
            res.json(history);
        } catch (error) {
            console.error('History Controller Error:', error);
            res.status(500).json({ error: 'Failed to fetch history' });
        }
    }

    async deleteHistoryItem(req, res) {
        try {
            const { id } = req.params;
            const deletedItem = await Summary.findByIdAndDelete(id);
            if (!deletedItem) {
                return res.status(404).json({ error: 'Item not found' });
            }
            res.json({ message: 'History item deleted successfully' });
        } catch (error) {
            console.error('Delete Controller Error:', error);
            res.status(500).json({ error: 'Failed to delete history item' });
        }
    }
}

export default new SummarizeController();
