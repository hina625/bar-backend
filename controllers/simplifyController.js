import openaiService from '../services/openaiService.js';

class SimplifyController {
    async simplify(req, res) {
        try {
            const { text } = req.body;
            if (!text) {
                return res.status(400).json({ error: 'Text content is required' });
            }

            // Truncate text if too long to avoid token limits (approx 15k chars is safe for gpt-3.5-turbo context usually, but keeping it safer at 12k)
            const safeText = text.substring(0, 12000);

            const prompt = `
            You are an expert web accessibility specialist. I will provide you with the text content of a webpage.
            
            Your task:
            1. Reorganize and rewrite this content into a single, cohesive, well-structured HTML article.
            2. Use semantic HTML tags: <header>, <h1>, <h2>, <p>, <ul>, <li>, <section>.
            3. IGNORE and REMOVE any navigation menus, footnotes, ads, medical disclaimers, cookie notices, or irrelevant sidebars.
            4. Ensure the layout is clean, simple, and extremely easy to read.
            5. Do NOT include <head>, <body>, <html>, or <style> tags. Return ONLY the content that would go inside the <body>.
            6. If there are code blocks, format them with <pre><code>.

            Content:
            ${safeText}
            `;

            const simplifiedHtml = await openaiService.generateCompletion(prompt);

            res.json({ html: simplifiedHtml });

        } catch (error) {
            console.error('Simplify Layout Error:', error);
            res.status(500).json({ error: 'Failed to simplify page layout' });
        }
    }
}

export default new SimplifyController();
