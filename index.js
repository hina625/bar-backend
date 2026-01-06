import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import summarizeRoute from './routes/summarize.js';
import dictionaryRoute from './routes/dictionary.js';
import pronunciationRoute from './routes/pronunciation.js';
import simplifyRoute from './routes/simplify.js';
import ttsRoute from './routes/tts.js';
import translateRoute from './routes/translate.js';
import voiceCommandRoute from './routes/voiceCommand.js';
import feedbackRoute from './routes/feedback.js';
import contactRoute from './routes/contact.js';

dotenv.config();


connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/summarize', summarizeRoute);
app.use('/api/dictionary', dictionaryRoute);
app.use('/api/pronunciation', pronunciationRoute);
app.use('/api/simplify', simplifyRoute);
app.use('/api/tts', ttsRoute);
app.use('/api/translate', translateRoute);
app.use('/api/voice-command', voiceCommandRoute);
app.use('/api/feedback', feedbackRoute);
app.use('/api/contact', contactRoute);

app.get('/', (req, res) => {
    res.send('Accessibility Bar Backend is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
