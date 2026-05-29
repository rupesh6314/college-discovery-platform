const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

// CORS - Allow all origins for production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check - this works because it doesn't use database
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Test database endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ success: true, message: 'Database connected' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple colleges endpoint for testing
app.get('/api/colleges', async (req, res) => {
  try {
    const colleges = await prisma.college.findMany();
    res.json({ success: true, data: colleges });
  } catch (error) {
    console.error('Database error:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Database connection failed',
      details: error.message 
    });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Simple validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password and create user
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'STUDENT'
      }
    });
    
    // Generate JWT
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server with database check
async function startServer() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Missing');
    process.exit(1);
  }
}

startServer();