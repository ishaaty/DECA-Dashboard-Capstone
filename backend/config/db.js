const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' }); // Adjust path to locate .env

// Replace with your actual database credentials
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,   // Change to your database host
  dialect: 'mysql',    // Or 'postgres', 'sqlite', 'mariadb', etc.
  pool: {
    max: 200,  // Maximum number of connections
    min: 0,   // Minimum number of connections
    acquire: 30000,  // Max time (in ms) before a connection is considered unavailable
    idle: 10000       // Max time (in ms) that a connection can be idle before being released
  }
});

module.exports = sequelize;