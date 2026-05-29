const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = require('./app');

const PORT = process.env.PORT || 5000;

// Start the server
const server = app.listen(PORT, '0.0.0.0', () => {
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

// Graceful shutdown - FIXED version
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
    });
  } else {
    console.log('No server instance to close');
  }
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  if (server) {
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
