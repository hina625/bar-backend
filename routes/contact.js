import express from 'express';
import Contact from '../models/Contact.js';
import { sendContactEmail } from '../services/emailService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const newContact = new Contact({
            name,
            email,
            subject,
            message
        });

        const contact = await newContact.save();

        try {
            await sendContactEmail({ name, email, subject, message });
        } catch (mailErr) {
            console.error('Email failed to send but contact was saved:', mailErr);
        }

        res.status(201).json(contact);
    } catch (err) {
        console.error('Contact submission error:', err.message);
        res.status(500).json({ error: err.message || 'Server Error' });
    }
});

export default router;
