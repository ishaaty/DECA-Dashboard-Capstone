const { railwaySequelize } = require('./config/db');

(async () => {
  try {
    await railwaySequelize.authenticate();
    console.log('✅ DB connected successfully!');
  } catch (error) {
    console.error('❌ DB connection failed:', error);
  }
})();
