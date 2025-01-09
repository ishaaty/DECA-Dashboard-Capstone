const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Sequelize User model

// Define the POST route for creating a user
router.post('/create', async (req, res) => {
    console.log("hit");
  try {
    const { first_name, last_name, email } = req.body;

    // Validate the incoming data (basic example)
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new user in the database using Sequelize
    const newUser = await User.create({ first_name, last_name, email });
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

module.exports = router;