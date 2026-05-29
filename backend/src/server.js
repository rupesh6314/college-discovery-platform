require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Simple listen - NO signal handlers
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
