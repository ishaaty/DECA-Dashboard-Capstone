const { Sequelize } = require('sequelize');
require('dotenv').config({ path: '../.env' }); // Adjust path to locate .env

// Replace with your actual database credentials
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,   // Change to your database host
  dialect: 'mysql',    // Or 'postgres', 'sqlite', 'mariadb', etc.
});

module.exports = sequelize;