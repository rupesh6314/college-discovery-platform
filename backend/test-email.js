require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
  try {
    console.log('Testing email configuration...');
    console.log('USER:', process.env.EMAIL_USER);
    // Don't log full pass
    console.log('PASS (first 4):', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.substring(0, 4) + '...' : 'undefined');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify connection configuration
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('Server is ready to take our messages (Credentials are valid!).');

    // Send a test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"CollegeDiscovery" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to itself
      subject: 'Test Email Configuration',
      text: 'If you receive this, the email credentials are correct and working!'
    });

    console.log('Test email sent successfully! Message ID:', info.messageId);
  } catch (error) {
    console.error('Email Test Failed:', error);
  }
};

testEmail();
