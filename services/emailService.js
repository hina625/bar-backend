import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendFeedbackEmail = async (feedbackData) => {
    const { name, email, rating, answers, comment } = feedbackData;

    const formattedAnswers = Object.entries(answers)
        .map(([key, value]) => `Question ${key.replace('q', '')}: ${value ? 'Yes' : 'No'}`)
        .join('\n');

    const mailOptions = {
        from: `"Accessibility Bar Feedback" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Feedback Received - ${rating} Stars`,
        text: `
            You have received new feedback:
            
            Name: ${name || 'N/A'}
            Email: ${email || 'N/A'}
            Rating: ${rating} / 5
            
            Answers:
            ${formattedAnswers}
            
            Comment:
            ${comment || 'No comment provided'}
            
            Submitted at: ${new Date().toLocaleString()}
        `,
        html: `
            <h3>New Feedback Received</h3>
            <p><strong>Name:</strong> ${name || 'N/A'}</p>
            <p><strong>Email:</strong> ${email || 'N/A'}</p>
            <p><strong>Rating:</strong> ${rating} / 5</p>
            <br>
            <h4>Answers:</h4>
            <pre>${formattedAnswers}</pre>
            <br>
            <h4>Comment:</h4>
            <p>${comment || 'No comment provided'}</p>
            <br>
            <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Feedback email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending feedback email:', error);
        throw error;
    }
};

export const sendContactEmail = async (contactData) => {
    const { name, email, subject, message } = contactData;

    const mailOptions = {
        from: `"Accessibility Bar Contact" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Request: ${subject || 'No Subject'}`,
        text: `
            You have received a new contact request:
            
            Name: ${name}
            Email: ${email}
            Subject: ${subject || 'N/A'}
            
            Message:
            ${message}
            
            Submitted at: ${new Date().toLocaleString()}
        `,
        html: `
            <h3>New Contact Request</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <br>
            <h4>Message:</h4>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <br>
            <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Contact email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending contact email:', error);
        throw error;
    }
};
