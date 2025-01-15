const mysql = require('mysql');
require('dotenv').config();

const express = require('express');
const app = express();

// Enable CORS for requests from the frontend (React app)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000', // React app
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true, 
}));

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));


const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const resourcesRouter = require('./routes/resourceRoutes');
app.use('/resources', resourcesRouter);


const sequelize = require('./config/db');
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const User = require('./models/userModel');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

app.get('/', (re, res) => {
    return res.json("from backend");
})

app.get('/users', (req, res)=> {
    const sql = "select * from user";
    db.query(sql, (err, data) => {
        if (err) return res.json(err);
        return res.json(data);
    })
})

app.listen(8081, ()=> {
    console.log("Listening on http://localhost:8081/users");
})

// Sync Sequelize models with database
sequelize.sync({ force: false }) // Set `force: true` to drop and recreate tables
  .then(() => {
    console.log('Database synchronized successfully.');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
