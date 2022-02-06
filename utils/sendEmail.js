const nodemailer = require('nodemailer');

const sendEmail = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
    port: process.env.SMTP_PORT || 2525,
    auth: {
      user: process.env.SMTP_EMAIL || 'cd7d76f4c1d024',
      pass: process.env.SMTP_PASSWORD || '65053c95180257'
    }
  });

  const message = {
    from: `${process.env.FROM_NAME || 'noreply@footballManagement.io'} <${process.env.FROM_EMAIL || 'FootballManagement'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;