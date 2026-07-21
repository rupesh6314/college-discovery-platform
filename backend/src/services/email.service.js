const { Resend } = require('resend');

// Initialize Resend with API key
// Using a fallback for local development if the env var isn't loaded yet
const resend = new Resend(process.env.RESEND_API_KEY);

// For Resend's free tier, you MUST use their verified onboarding domain
const FROM_EMAIL = 'CollegeDiscovery <onboarding@resend.dev>';

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to CollegeDiscovery!</h1>
        </div>
        <div style="padding: 30px; background: #f3f4f6;">
          <h2 style="color: #1f2937;">Hello ${name},</h2>
          <p style="color: #4b5563; line-height: 1.6;">Thank you for joining CollegeDiscovery! We're excited to help you find your perfect college.</p>
          <ul style="color: #4b5563;">
            <li>Compare 1000+ colleges across India</li>
            <li>Read real student reviews</li>
            <li>Get AI-powered recommendations</li>
          </ul>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/colleges" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Explore Colleges</a>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Welcome to CollegeDiscovery! 🎓',
      html
    });

    if (error) throw error;
    console.log(`Welcome email sent to ${email} via Resend`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }
};

// Send password reset email with verification code
const sendPasswordResetEmail = async (email, code) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Reset Your Password</h1>
        </div>
        <div style="padding: 30px; background: #f3f4f6; text-align: center;">
          <h2 style="color: #1f2937;">Password Reset Code</h2>
          <p style="color: #4b5563; line-height: 1.6;">You requested to reset your password. Please use the verification code below:</p>
          <div style="background: #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #1f2937; letter-spacing: 5px; font-family: monospace; margin: 0;">${code}</h1>
          </div>
          <p style="color: #4b5563; line-height: 1.6;">This code will expire in 15 minutes.</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your Password Reset Code - CollegeDiscovery',
      html
    });

    if (error) throw error;
    console.log(`Password reset code email sent to ${email} via Resend`);
  } catch (error) {
    console.error('Failed to send password reset code email:', error);
  }
};

// Send password successfully changed email
const sendPasswordChangedEmail = async (email) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Updated Successfully</h1>
        </div>
        <div style="padding: 30px; background: #f3f4f6; text-align: center;">
          <h2 style="color: #1f2937;">Your password has been changed</h2>
          <p style="color: #4b5563; line-height: 1.6;">This is a confirmation that the password for your CollegeDiscovery account has just been updated.</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Security Alert: Password Updated - CollegeDiscovery',
      html
    });

    if (error) throw error;
    console.log(`Password changed confirmation email sent to ${email} via Resend`);
  } catch (error) {
    console.error('Failed to send password changed email:', error);
  }
};

// Send email change verification code
const sendEmailChangeCode = async (email, code) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Verify Your New Email</h1>
        </div>
        <div style="padding: 30px; background: #f3f4f6; text-align: center;">
          <h2 style="color: #1f2937;">Email Change Verification</h2>
          <p style="color: #4b5563; line-height: 1.6;">You requested to change your CollegeDiscovery email to this address. Please use the verification code below:</p>
          <div style="background: #e5e7eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #1f2937; letter-spacing: 5px; font-family: monospace; margin: 0;">${code}</h1>
          </div>
          <p style="color: #4b5563; line-height: 1.6;">This code will expire in 15 minutes.</p>
        </div>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify Your New Email - CollegeDiscovery',
      html
    });

    if (error) throw error;
    console.log(`Email change verification code sent to ${email} via Resend`);
  } catch (error) {
    console.error('Failed to send email change verification code:', error);
  }
};

const sendVerificationEmail = async (email, token) => {
  // Not used right now but kept for consistency
};

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendVerificationEmail,
  sendEmailChangeCode
};