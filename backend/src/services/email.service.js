const nodemailer = require('nodemailer')

// Create transporter
let transporter = null

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      pool: true,
      maxConnections: 5,
      maxMessages: 100
    })
  }
  return transporter
}

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = getTransporter()
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to CollegeDiscovery!</h1>
        </div>
        <div style="padding: 30px; background: #f3f4f6;">
          <h2 style="color: #1f2937;">Hello ${name},</h2>
          <p style="color: #4b5563; line-height: 1.6;">Thank you for joining CollegeDiscovery! We're excited to help you find your perfect college.</p>
          <p style="color: #4b5563; line-height: 1.6;">With CollegeDiscovery, you can:</p>
          <ul style="color: #4b5563;">
            <li>Compare 1000+ colleges across India</li>
            <li>Read real student reviews</li>
            <li>Get AI-powered recommendations</li>
            <li>Save your favorite colleges</li>
            <li>Ask questions to our community</li>
          </ul>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/colleges" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 20px;">Explore Colleges</a>
        </div>
        <div style="padding: 20px; text-align: center; background: #1f2937; color: #9ca3af; font-size: 12px;">
          <p>© 2024 CollegeDiscovery. All rights reserved.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"CollegeDiscovery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to CollegeDiscovery! 🎓',
      html
    })

    console.log(`Welcome email sent to ${email}`)
  } catch (error) {
    console.error('Failed to send welcome email:', error)
  }
}

// Send password reset email with verification code
const sendPasswordResetEmail = async (email, code) => {
  try {
    const transporter = getTransporter()

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
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="padding: 20px; text-align: center; background: #1f2937; color: #9ca3af; font-size: 12px;">
          <p>© 2024 CollegeDiscovery. All rights reserved.</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"CollegeDiscovery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Password Reset Code - CollegeDiscovery',
      html
    })

    console.log(`Password reset code email sent to ${email}`)
  } catch (error) {
    console.error('Failed to send password reset code email:', error)
  }
}

// Send password successfully changed email
const sendPasswordChangedEmail = async (email) => {
  try {
    const transporter = getTransporter()

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Password Updated Successfully</h1>
        </div>
        <div style="padding: 30px; background: #f3f4f6; text-align: center;">
          <h2 style="color: #1f2937;">Your password has been changed</h2>
          <p style="color: #4b5563; line-height: 1.6;">This is a confirmation that the password for your CollegeDiscovery account has just been updated.</p>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">If you did not make this change, please contact us immediately at supportcollegediscovery@gmail.com.</p>
        </div>
        <div style="padding: 20px; text-align: center; background: #1f2937; color: #9ca3af; font-size: 12px;">
          <p>© 2024 CollegeDiscovery. All rights reserved.</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"CollegeDiscovery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Security Alert: Password Updated - CollegeDiscovery',
      html
    })

    console.log(`Password changed confirmation email sent to ${email}`)
  } catch (error) {
    console.error('Failed to send password changed email:', error)
  }
}

// Send email verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = getTransporter()
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">Verify Your Email</h1>
        </div>
        <div style="padding: 30px; background: #f3f4f6;">
          <h2 style="color: #1f2937;">Email Verification</h2>
          <p style="color: #4b5563; line-height: 1.6;">Please verify your email address to access all features of CollegeDiscovery.</p>
          <a href="${verifyUrl}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0;">Verify Email</a>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"CollegeDiscovery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - CollegeDiscovery',
      html
    })

    console.log(`Verification email sent to ${email}`)
  } catch (error) {
    console.error('Failed to send verification email:', error)
  }
}

// Send email change verification code
const sendEmailChangeCode = async (email, code) => {
  try {
    const transporter = getTransporter()

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
          <p style="color: #6b7280; font-size: 14px;">If you didn't request this, please ignore this email.</p>
        </div>
        <div style="padding: 20px; text-align: center; background: #1f2937; color: #9ca3af; font-size: 12px;">
          <p>© 2024 CollegeDiscovery. All rights reserved.</p>
        </div>
      </div>
    `

    await transporter.sendMail({
      from: `"CollegeDiscovery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your New Email - CollegeDiscovery',
      html
    })

    console.log(`Email change verification code sent to ${email}`)
  } catch (error) {
    console.error('Failed to send email change verification code:', error)
  }
}

module.exports = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendVerificationEmail,
  sendEmailChangeCode
}