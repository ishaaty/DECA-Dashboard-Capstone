const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Route for creating a user
router.post('/create', async (req, res) => {
    try {
        const { first_name, last_name, account_email, user_class, email } = req.body;

        if (!first_name || !last_name || !account_email || !user_class || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create the user in the database
        const newUser = await User.create({ first_name, last_name, account_email, user_class, email });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});




// Route for checking user approval status
router.get('/approval-status', async (req, res) => {
  try {
    console.log("hit approval status route");
      const userEmail = req.query.email;

      if (!userEmail) {
          return res.status(400).json({ exists: false, approved: false, role: null });
      }

      // Find the user by account_email
      const user = await User.findOne({ where: { account_email: userEmail } });

      if (!user) {
          return res.json({ exists: false, approved: false, role: null });
      }

      const approvedRoles = ["participant", "board member", "admin"];
      return res.json({ 
          exists: true, 
          approved: approvedRoles.includes(user.role), 
          role: user.role 
      });

  } catch (error) {
      console.error('Error checking approval status:', error);
      res.status(500).json({ exists: false, approved: false, role: null });
  }
});



router.get('/role', async (req, res) => {
    console.log("hit role route");
    try {
      const userEmail = req.query.email;
      console.log("email: ", userEmail);
  
      if (!userEmail) {
          console.error("No email provided in request");
          return res.status(400).json({ error: "Email is required" });
      }
  
      // Find the user by account_email
      const user = await User.findOne({ where: { account_email: userEmail } });
  
      if (!user) {
          console.warn(`User not found for email: ${userEmail}`);
          return res.status(404).json({ error: "User not found" });
      }
  
      return res.json({ role: user.position });
  
    } catch (error) {
      console.error('Error checking approval status:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  


module.exports = router;