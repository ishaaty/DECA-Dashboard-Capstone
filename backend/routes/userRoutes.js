const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Route for creating or updating a user
router.post('/create-update', async (req, res) => {
    try {
        const { 
            first_name, 
            last_name, 
            user_class, 
            account_email, 
            email, 
            cell_phone, 
            home_phone, 
            gender, 
            demographic, 
            dob 
        } = req.body;

        // Ensure required fields are provided
        if (!first_name || !last_name || !user_class || !account_email || !email) {
            return res.status(400).json({ message: 'Missing required fields: first_name, last_name, user_class, account_email, email' });
        }

        // Check if user exists
        let user = await User.findOne({ where: { email } });

        if (user) {
            // Update existing user
            await user.update({ first_name, last_name, user_class, account_email, cell_phone, home_phone, gender, demographic, dob });
            return res.status(200).json({ message: 'User updated successfully', user });
        } else {
            // Create a new user
            user = await User.create({ first_name, last_name, user_class, account_email, email, cell_phone, home_phone, gender, demographic, dob });
            return res.status(201).json({ message: 'User created successfully', user });
        }
    } catch (error) {
        console.error('Error creating/updating user:', error);
        res.status(500).json({ message: 'Error processing user data', error: error.message });
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