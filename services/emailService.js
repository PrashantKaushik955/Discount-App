const nodemailer = require('nodemailer');
const config = require('../config/config');

const transporter = nodemailer.createTransport(config.emailConfig);

exports.sendEmail = async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: config.emailConfig.auth.user,
      to,
      subject,
      text,
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw new Error('Failed to send email');
  }
};
