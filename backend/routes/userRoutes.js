const express = require('express');
const router = express.Router();
const { User } = require('../models');
const { Op } = require('sequelize');


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
            return res.status(200).json({ message: 'Information updated successfully', user });
        } else {
            // Create a new user
            user = await User.create({ first_name, last_name, user_class, account_email, email, cell_phone, home_phone, gender, demographic, dob });
            return res.status(201).json({ message: 'Approval request submitted', user });
        }
    } catch (error) {
        console.error('Error creating/updating user:', error);
        res.status(500).json({ message: 'Error processing user data', error: error.message });
    }
});


router.get('/user-info', async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const user = await User.findOne({ 
            where: { user_id },
            attributes: ['first_name', 'last_name', 'email'] 
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: 'Internal server error' });
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
  
router.get('/get-user-id', async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Query to search for a user with either the email or account_email
        const user = await User.findOne({
            where: {
                [Op.or]: [{ email }, { account_email: email }]  // Search for either email or account_email
            },
            attributes: ['user_id']  // Only fetch the user_id
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user_id: user.user_id });  // Return the user_id

    } catch (error) {
        console.error('Error fetching user_id:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



module.exports = router;