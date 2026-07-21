// backend/src/controllers/auth.controller.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const emailService = require('../services/email.service');

const prisma = new PrismaClient();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET + '_refresh', {
    expiresIn: '30d'
  });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, city, state } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone: phone || undefined }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email or phone' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        city: city || null,
        state: state || null,
        role: 'STUDENT'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        city: true,
        state: true,
        createdAt: true
      }
    });

    // Generate tokens
    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Send welcome email in the background without awaiting it
    // This prevents the registration request from timing out if SMTP is blocked (e.g. on Render)
    emailService.sendWelcomeEmail(user.email, user.name).catch(emailError => {
      console.error('Welcome email failed in background:', emailError);
    });

    res.status(201).json({
      success: true,
      user,
      token,
      refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// Add this to your login function - ensure token is returned correctly
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    res.json({
      success: true,
      token,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Server error' })
  }
}

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET + '_refresh');
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const newToken = generateToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    res.json({
      token: newToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        savedColleges: {
          include: {
            college: {
              select: {
                id: true,
                name: true,
                slug: true,
                city: true,
                state: true,
                overallRating: true,
                logoUrl: true
              }
            }
          }
        },
        comparisons: {
          include: {
            colleges: {
              include: {
                college: true
              }
            }
          }
        },
        reviews: {
          include: {
            college: {
              select: { name: true, slug: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, city, state, education, examScore, examName, interests, budgetMin, budgetMax } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        phone: phone || undefined,
        city: city || undefined,
        state: state || undefined,
        education: education || undefined,
        examScore: examScore ? parseFloat(examScore) : undefined,
        examName: examName || undefined,
        interests: interests ? JSON.stringify(interests) : undefined,
        budgetMin: budgetMin ? parseFloat(budgetMin) : undefined,
        budgetMax: budgetMax ? parseFloat(budgetMax) : undefined
      },
      select: {
        id: true,
        name: true,
        email: true,
        pendingEmail: true,
        phone: true,
        city: true,
        state: true,
        education: true,
        examScore: true,
        examName: true,
        interests: true,
        budgetMin: true,
        budgetMax: true,
        role: true
      }
    });

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedPassword }
    });

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

// Generate a random 6-character alphanumeric code
const generateVerificationCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User Mail Not found' });
    }

    // Generate code and expiration (15 minutes from now)
    const resetCode = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    // Save to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordCode: resetCode,
        resetPasswordExpires: expires
      }
    });
    
    // Send email asynchronously
    emailService.sendPasswordResetEmail(email, resetCode).catch(console.error);

    res.json({ success: true, message: 'Password reset code sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send reset code' });
  }
};

exports.verifyResetCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.resetPasswordCode !== code || !user.resetPasswordExpires) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (new Date() > user.resetPasswordExpires) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Code is valid. Issue a temporary short-lived token just for password resetting.
    // This token is valid for 15 minutes.
    const tempToken = jwt.sign({ id: user.id, purpose: 'password_reset' }, process.env.JWT_SECRET, { expiresIn: '15m' });

    res.json({ success: true, tempToken });
  } catch (error) {
    console.error('Verify reset code error:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ error: 'Invalid token type' });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and clear reset fields
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        resetPasswordCode: null,
        resetPasswordExpires: null
      }
    });

    // Notify user asynchronously
    emailService.sendPasswordChangedEmail(user.email).catch(console.error);

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(400).json({ error: 'Invalid or expired reset session' });
  }
};

exports.requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;
    
    // Check if new email is already in use
    const existingUser = await prisma.user.findUnique({ where: { email: newEmail } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    const emailChangeCode = generateVerificationCode();
    const expires = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        pendingEmail: newEmail,
        emailChangeCode,
        emailChangeExpires: expires
      }
    });

    emailService.sendEmailChangeCode(newEmail, emailChangeCode).catch(console.error);

    res.json({ success: true, message: 'Verification code sent to new email' });
  } catch (error) {
    console.error('Request email change error:', error);
    res.status(500).json({ error: 'Failed to request email change' });
  }
};

exports.verifyEmailChange = async (req, res) => {
  try {
    const { code } = req.body;
    
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user || user.emailChangeCode !== code || !user.emailChangeExpires || !user.pendingEmail) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (new Date() > user.emailChangeExpires) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Check if another user took the email in the meantime
    const existingUser = await prisma.user.findUnique({ where: { email: user.pendingEmail } });
    if (existingUser && existingUser.id !== user.id) {
      return res.status(400).json({ error: 'Email is already in use by another account' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: user.pendingEmail,
        pendingEmail: null,
        emailChangeCode: null,
        emailChangeExpires: null
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        city: true,
        state: true,
        role: true
      }
    });

    res.json({ success: true, user: updatedUser, message: 'Email updated successfully' });
  } catch (error) {
    console.error('Verify email change error:', error);
    res.status(500).json({ error: 'Failed to update email' });
  }
};