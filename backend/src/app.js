const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Import routes
const authRoutes = require('./routes/auth.routes')
const collegeRoutes = require('./routes/college.routes')
const compareRoutes = require('./routes/compare.routes')
const reviewRoutes = require('./routes/review.routes')
const userRoutes = require('./routes/user.routes')
const communityRoutes = require('./routes/community.routes')

const app = express();

// ============ UPDATED CORS CONFIGURATION ============
// Allow multiple origins (Netlify frontend, localhost)
const allowedOrigins = [
  'https://college-discovery-frontend.netlify.app',
  'http://localhost:5173',
  'http://localhost:3000',
  'https://*.netlify.app'
]

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Allow any netlify subdomain
      if (origin.includes('.netlify.app')) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(null, true); // Temporarily allow all for debugging
      }
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
}));

// Or simpler - allow all origins for testing (use only temporarily)
// app.use(cors({ origin: '*', credentials: true }));

// Rest of your middleware...
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));
app.use(compression());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rate limiting with higher limit for production
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: 'connected',
      cors: 'enabled'
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/compare', compareRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/user', userRoutes);
app.use('/api/community', communityRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = app;
