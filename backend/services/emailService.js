const nodemailer = require('nodemailer');

const isMailConfigured = !!(
  process.env.SMTP_HOST &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
);

let transporter = null;

if (isMailConfigured) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  console.log('Nodemailer SMTP mailer configured.');
} else {
  console.log('SMTP credentials missing. Emails will be logged to console in dev mode.');
}

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const fromAddress = process.env.SMTP_FROM || 'noreply@smartrecruit.com';
    
    if (isMailConfigured && transporter) {
      const info = await transporter.sendMail({
        from: `"Smart Recruitment Portal" <${fromAddress}>`,
        to,
        subject,
        text,
        html
      });
      console.log(`Email dispatched successfully to ${to}. MessageId: ${info.messageId}`);
      return info;
    } else {
      console.log(`[EMAIL MOCK LOGGER]
==========================================
TO: ${to}
SUBJECT: ${subject}
TEXT: ${text}
HTML: ${html.substring(0, 300)}...
==========================================`);
      return { mock: true, to, subject };
    }
  } catch (error) {
    console.error('Error dispatching system email:', error);
    return { error: true, message: error.message };
  }
};

module.exports = { sendEmail };
