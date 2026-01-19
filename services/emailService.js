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
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f4f4;
                        line-height: 1.6;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }
                    table {
                        border-collapse: collapse;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
                    .email-wrapper {
                        width: 100%;
                        background-color: #f4f4f4;
                        padding: 40px 20px;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 4px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .email-header {
                        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                        color: #ffffff;
                        padding: 32px 36px;
                        text-align: left;
                    }
                    .email-header h1 {
                        margin: 0;
                        font-size: 24px;
                        font-weight: 600;
                        letter-spacing: -0.5px;
                        color: #ffffff;
                    }
                    .email-header .subtitle {
                        margin: 8px 0 0 0;
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.9);
                        font-weight: 400;
                    }
                    .email-body {
                        padding: 36px;
                        background-color: #ffffff;
                    }
                    .info-section {
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-left: 4px solid #3b82f6;
                        border-radius: 4px;
                        padding: 24px;
                        margin-bottom: 28px;
                    }
                    .info-row {
                        padding: 12px 0;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                        padding-bottom: 0;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #475569;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 4px;
                        display: block;
                    }
                    .info-value {
                        color: #1e293b;
                        font-size: 15px;
                        margin-top: 4px;
                        display: block;
                    }
                    .rating-display {
                        display: inline-flex;
                        align-items: center;
                        gap: 8px;
                        margin-top: 4px;
                    }
                    .rating-stars {
                        color: #f59e0b;
                        font-size: 16px;
                        letter-spacing: 3px;
                    }
                    .rating-text {
                        color: #64748b;
                        font-size: 14px;
                        font-weight: 500;
                    }
                    .section-divider {
                        height: 1px;
                        background: linear-gradient(to right, transparent, #e2e8f0, transparent);
                        margin: 32px 0;
                        border: none;
                    }
                    .section-title {
                        font-size: 16px;
                        font-weight: 600;
                        color: #1e293b;
                        margin: 0 0 16px 0;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        font-size: 13px;
                    }
                    .content-box {
                        background-color: #ffffff;
                        border: 1px solid #e2e8f0;
                        border-radius: 4px;
                        padding: 20px;
                        margin: 16px 0 28px 0;
                    }
                    .answer-row {
                        padding: 12px 0;
                        border-bottom: 1px solid #f1f5f9;
                    }
                    .answer-row:last-child {
                        border-bottom: none;
                    }
                    .question-text {
                        font-weight: 600;
                        color: #334155;
                        font-size: 14px;
                        margin-bottom: 6px;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 4px;
                        font-size: 12px;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .status-yes {
                        background-color: #d1fae5;
                        color: #065f46;
                    }
                    .status-no {
                        background-color: #fee2e2;
                        color: #991b1b;
                    }
                    .comment-section {
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-left: 4px solid #10b981;
                        border-radius: 4px;
                        padding: 20px;
                        margin: 16px 0;
                    }
                    .comment-text {
                        color: #1e293b;
                        font-size: 14px;
                        line-height: 1.8;
                        margin: 0;
                    }
                    .email-footer {
                        background-color: #f8fafc;
                        border-top: 1px solid #e2e8f0;
                        padding: 24px 36px;
                        text-align: center;
                    }
                    .footer-text {
                        font-size: 12px;
                        color: #64748b;
                        line-height: 1.6;
                        margin: 0;
                    }
                    .footer-divider {
                        height: 1px;
                        background-color: #e2e8f0;
                        margin: 16px 0;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="center">
                                <table class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td class="email-header">
                                            <h1>New Feedback Received</h1>
                                            <div class="subtitle">Accessibility Bar Feedback System</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="email-body">
                                            <div class="info-section">
                                                <div class="info-row">
                                                    <span class="info-label">Submitted By</span>
                                                    <span class="info-value">${name || 'Anonymous User'}</span>
                                                </div>
                                                <div class="info-row">
                                                    <span class="info-label">Email Address</span>
                                                    <span class="info-value">${email || 'Not provided'}</span>
                                                </div>
                                                <div class="info-row">
                                                    <span class="info-label">User Rating</span>
                                                    <div class="rating-display">
                                                        <span class="rating-stars">${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}</span>
                                                        <span class="rating-text">${rating} out of 5</span>
                                                    </div>
                                                </div>
                                                <div class="info-row">
                                                    <span class="info-label">Submission Date</span>
                                                    <span class="info-value">${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
                                                </div>
                                            </div>

                                            <hr class="section-divider">

                                            <div class="section-title">Survey Responses</div>
                                            <div class="content-box">
                                                ${Object.entries(answers).map(([key, value]) => `
                                                    <div class="answer-row">
                                                        <div class="question-text">Question ${key.replace('q', '')}</div>
                                                        <span class="status-badge ${value ? 'status-yes' : 'status-no'}">
                                                            ${value ? 'Yes' : 'No'}
                                                        </span>
                                                    </div>
                                                `).join('')}
                                            </div>

                                            ${comment ? `
                                                <hr class="section-divider">
                                                <div class="section-title">Additional Comments</div>
                                                <div class="comment-section">
                                                    <p class="comment-text">${comment.replace(/\n/g, '<br>')}</p>
                                                </div>
                                            ` : ''}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="email-footer">
                                            <hr class="footer-divider">
                                            <p class="footer-text">
                                                This is an automated notification from the Accessibility Bar Feedback System.<br>
                                                Please do not reply to this email.
                                            </p>
                                            <p class="footer-text" style="margin-top: 8px; color: #94a3b8;">
                                                Generated on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
            </html>
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
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f4f4;
                        line-height: 1.6;
                        -webkit-font-smoothing: antialiased;
                        -moz-osx-font-smoothing: grayscale;
                    }
                    table {
                        border-collapse: collapse;
                        mso-table-lspace: 0pt;
                        mso-table-rspace: 0pt;
                    }
                    .email-wrapper {
                        width: 100%;
                        background-color: #f4f4f4;
                        padding: 40px 20px;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 4px;
                        overflow: hidden;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    }
                    .email-header {
                        background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
                        color: #ffffff;
                        padding: 32px 36px;
                        text-align: left;
                    }
                    .email-header h1 {
                        margin: 0;
                        font-size: 24px;
                        font-weight: 600;
                        letter-spacing: -0.5px;
                        color: #ffffff;
                    }
                    .email-header .subtitle {
                        margin: 8px 0 0 0;
                        font-size: 13px;
                        color: rgba(255, 255, 255, 0.9);
                        font-weight: 400;
                    }
                    .email-body {
                        padding: 36px;
                        background-color: #ffffff;
                    }
                    .info-section {
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-left: 4px solid #3b82f6;
                        border-radius: 4px;
                        padding: 24px;
                        margin-bottom: 28px;
                    }
                    .info-row {
                        padding: 12px 0;
                        border-bottom: 1px solid #e2e8f0;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                        padding-bottom: 0;
                    }
                    .info-label {
                        font-weight: 600;
                        color: #475569;
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 4px;
                        display: block;
                    }
                    .info-value {
                        color: #1e293b;
                        font-size: 15px;
                        margin-top: 4px;
                        display: block;
                    }
                    .info-value a {
                        color: #3b82f6;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    .info-value a:hover {
                        text-decoration: underline;
                    }
                    .section-divider {
                        height: 1px;
                        background: linear-gradient(to right, transparent, #e2e8f0, transparent);
                        margin: 32px 0;
                        border: none;
                    }
                    .section-title {
                        font-size: 13px;
                        font-weight: 600;
                        color: #1e293b;
                        margin: 0 0 16px 0;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .subject-badge {
                        display: inline-block;
                        padding: 8px 16px;
                        background-color: #3b82f6;
                        color: #ffffff;
                        border-radius: 4px;
                        font-size: 14px;
                        font-weight: 500;
                        margin: 8px 0 24px 0;
                    }
                    .message-section {
                        background-color: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-left: 4px solid #10b981;
                        border-radius: 4px;
                        padding: 24px;
                        margin: 16px 0 28px 0;
                    }
                    .message-text {
                        color: #1e293b;
                        font-size: 14px;
                        line-height: 1.8;
                        margin: 0;
                        white-space: pre-wrap;
                    }
                    .action-section {
                        text-align: center;
                        padding: 24px 0;
                        margin: 28px 0;
                    }
                    .reply-button {
                        display: inline-block;
                        padding: 12px 32px;
                        background-color: #3b82f6;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 4px;
                        font-weight: 600;
                        font-size: 14px;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                    }
                    .reply-button:hover {
                        background-color: #2563eb;
                    }
                    .email-footer {
                        background-color: #f8fafc;
                        border-top: 1px solid #e2e8f0;
                        padding: 24px 36px;
                        text-align: center;
                    }
                    .footer-text {
                        font-size: 12px;
                        color: #64748b;
                        line-height: 1.6;
                        margin: 0;
                    }
                    .footer-divider {
                        height: 1px;
                        background-color: #e2e8f0;
                        margin: 16px 0;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <div class="email-wrapper">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                        <tr>
                            <td align="center">
                                <table class="email-container" width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td class="email-header">
                                            <h1>New Contact Request</h1>
                                            <div class="subtitle">Accessibility Bar Contact Form</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="email-body">
                                            <div class="info-section">
                                                <div class="info-row">
                                                    <span class="info-label">Contact Name</span>
                                                    <span class="info-value">${name}</span>
                                                </div>
                                                <div class="info-row">
                                                    <span class="info-label">Email Address</span>
                                                    <span class="info-value">
                                                        <a href="mailto:${email}">${email}</a>
                                                    </span>
                                                </div>
                                                <div class="info-row">
                                                    <span class="info-label">Submission Date</span>
                                                    <span class="info-value">${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
                                                </div>
                                            </div>

                                            ${subject ? `
                                                <hr class="section-divider">
                                                <div class="section-title">Subject</div>
                                                <div class="subject-badge">${subject}</div>
                                            ` : ''}

                                            <hr class="section-divider">

                                            <div class="section-title">Message Content</div>
                                            <div class="message-section">
                                                <p class="message-text">${message.replace(/\n/g, '<br>')}</p>
                                            </div>

                                            <div class="action-section">
                                                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject || 'Contact Request')}" class="reply-button">
                                                    Reply to ${name}
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="email-footer">
                                            <hr class="footer-divider">
                                            <p class="footer-text">
                                                This is an automated notification from the Accessibility Bar Contact System.<br>
                                                You can reply directly to this email to respond to the contact request.
                                            </p>
                                            <p class="footer-text" style="margin-top: 8px; color: #94a3b8;">
                                                Generated on ${new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' })}
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
            </html>
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
