// backend/src/server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║     🎓 College Discovery Platform Backend            ║
║     🚀 Server running on port ${PORT}                    ║
║     🌍 Environment: ${process.env.NODE_ENV || 'development'}     ║
║     📊 API: http://localhost:${PORT}/api              ║
║     ❤️  Health: http://localhost:${PORT}/health        ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
