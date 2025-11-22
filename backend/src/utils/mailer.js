import transporter from './../config/mail.js';
import { MAIL_FROM } from './../config/env.js';

async function sendMail({ to, subject, html, text }) {
    const mailOptions = {
        from: MAIL_FROM || 'noreply@example.com',
        to,
        subject,
        text,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent to ${to}`);
    } catch (error) {
        console.error('❌ Email sending failed:', error);
        throw new Error('Failed to send email');
    }
}

export default sendMail;
