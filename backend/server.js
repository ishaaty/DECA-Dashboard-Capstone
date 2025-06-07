const express = require('express');
const cors = require('cors');
// const mysql = require('mysql'); // For raw SQL queries
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const allowedOrigins = [
  'https://deca-dashboard-capstone-peach.vercel.app',
  'http://localhost:3000',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));



// // Set up raw MySQL database connection
// const db = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });


// // Test MySQL connection
// db.connect(err => {
//   if (err) {
//     console.error('Error connecting to MySQL:', err);
//   } else {
//     console.log('Connected to MySQL database.');
//   }
// });



// Import routes
const aboutRoutes = require('./routes/aboutRoutes');
app.use('/about', aboutRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

const resourcesRouter = require('./routes/resourceRoutes');
app.use('/resources', resourcesRouter);

const eventsRouter = require('./routes/eventsRoute');
app.use('/events', eventsRouter);

const participantRoutes = require('./routes/participantRoutes');
app.use('/participantdetails', participantRoutes);

const fundraisersRoutes = require('./routes/fundraisersRoutes');
app.use('/fundraisers', fundraisersRoutes);

const todolistRoutes = require('./routes/todoListRoutes')
app.use('/todolist', todolistRoutes);

const announcementsRoutes = require('./routes/announcementsRoutes');
app.use('/announcements', announcementsRoutes);

const pagesRoutes = require('./routes/displayPages');
app.use('/pages', pagesRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/profile', profileRoutes);




// // Define test routes
// app.get('/', (req, res) => {
//   res.json("Backend is coming thru :)");
// });

// app.get('/users', (req, res) => {
//   const sql = "SELECT * FROM user";
//   db.query(sql, (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });


// Start the server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}/`);
});