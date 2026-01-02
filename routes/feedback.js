import express from 'express';
import Feedback from '../models/Feedback.js';
import { sendFeedbackEmail } from '../services/emailService.js';

const router = express.Router();

// @route   POST api/feedback
// @desc    Submit feedback
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { name, email, rating, answers, comment } = req.body;

        if (!rating || !answers) {
            return res.status(400).json({ error: 'Rating and answers are required' });
        }

        const newFeedback = new Feedback({
            name,
            email,
            rating,
            answers,
            comment
        });

        const feedback = await newFeedback.save();

        // Send email notification (don't await so response isn't delayed, 
        // or await if you want to ensure it's sent)
        try {
            await sendFeedbackEmail({ name, email, rating, answers, comment });
        } catch (mailErr) {
            console.error('Email failed to send but feedback was saved:', mailErr);
        }

        res.status(201).json(feedback);
    } catch (err) {
        console.error('Feedback submission error:', err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
