// backend/config/emailConfig.js
const nodemailer = require('nodemailer');
require('dotenv').config();  // Import dotenv to use environment variables

// Create a transport using Mailtrap SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io', // Mailtrap SMTP server
  port: 587, // SMTP port for Mailtrap
  auth: {
    user: process.env.MAILTRAP_USER, // Mailtrap username
    pass: process.env.MAILTRAP_PASS, // Mailtrap password
  },
});

module.exports = transporter;
