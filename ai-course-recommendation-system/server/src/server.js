require('dotenv').config();
const app = require('./app');
const { initDatabase } = require('./db/datastore');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`================================================================`);
      console.log(`  AI COURSE RECOMMENDATION SYSTEM - BACKEND API SERVER RUNNING  `);
      console.log(`  URL: http://localhost:${PORT}                                 `);
      console.log(`  Health Check: http://localhost:${PORT}/api/health              `);
      console.log(`================================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { startServer };
