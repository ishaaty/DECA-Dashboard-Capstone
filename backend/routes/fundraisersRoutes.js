const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const sequelize = require('../config/db');
const UserFundXref = require('../models/user_fund_xrefModel')(sequelize);
const Fundraisers = require('../models/fundraisersModel')(sequelize);
const s3 = require('../config/s3Config');
const { Op } = require('sequelize');
const checkJwt = require('../config/jwtConfig');

// Display fundraisers when the fundraisers page is opened
router.get('/display', async (req, res) => {
    try {
        const fundraisers = await Fundraisers.findAll(); // retrieve the existing fundraisers
        res.json(fundraisers);
    } catch (error) {
        console.error('Error fetching fundraisers:', error);
        res.status(500).json({ error: 'Failed to fetch fundraisers' });
    }
});


// Display fundraisers based on fundraiser_id
router.get('/display/:fundraiser_id', async (req, res) => {
  try {
      const fundraiser_id = parseInt(req.params.fundraiser_id, 10); // Convert to integer
      if (isNaN(fundraiser_id)) {
          return res.status(400).json({ error: 'Invalid fundraiser_id' });
      }

      const fundraisers = await Fundraisers.findAll({ where: { fundraiser_id } });
      res.json(fundraisers);

  } catch (error) {
      console.error('Error fetching fundraisers:', error);
      res.status(500).json({ error: 'Failed to fetch fundraisers' });
  }
});

// Add a new fundraisers to the database
router.post('/add', async (req, res) => {
    const { fund_location, fund_date, fund_description, fund_name } = req.body;

    if (!fund_name || (!fund_description && !fund_date && !fund_location)) {
        return res.status(400).json({ error: 'Fundraiser name, description, location, and date are required.' });
    }

    try {
        const newFundraiser = await Fundraisers.create({
            fund_location,
            fund_date,
            fund_description,
            fund_name,
        });
        res.status(201).json(newFundraiser); // Return the newly created fundraiser
    } catch (error) {
        console.error('Error adding fundraiser:', error);
        res.status(500).json({ error: 'Failed to add fundraiser' });
    }
});

// Delete a fundraiser by ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Get the fundraiser ID from the URL parameter

  try {
    const fundraiser = await Fundraisers.findByPk(id); // Find fundraiser by primary key (ID)
    if (!fundraiser) {
      return res.status(404).json({ error: 'Fundraiser not found' });
    }

    await fundraiser.destroy(); // Delete the fundraiser
    res.status(200).json({ message: 'Fundraiser deleted successfully' });
  } catch (error) {
    console.error('Error deleting fundraiser:', error);
    res.status(500).json({ error: 'Failed to delete fundraiser' });
  }
});

// Edit an existing fundraiser while keeping fundraiser_id unchanged
router.put('/edit/:fundraiser_id', async (req, res) => {
  const { fundraiser_id } = req.params; // Get fundraiser ID from the URL parameter
  const {
      fund_name, fund_description, fund_date, fund_location
  } = req.body;

  try {
      const fundraiser = await Fundraisers.findByPk(fundraiser_id); // Find fundraiser by primary key

      if (!fundraiser) {
          return res.status(404).json({ error: 'Fundraiser not found' });
      }

      // Update only the fields that can be modified
      await fundraiser.update({
          fund_name,
          fund_description,
          fund_location,
          fund_date,

      });

      res.status(200).json({ message: 'Fundraiser updated successfully', fundraiser });
  } catch (error) {
      console.error('Error updating fundraiser:', error);
      res.status(500).json({ error: 'Failed to update fundraiser' });
  }
});

// cross ref functions

// Route to get a single row based on fundraiser_id and user_id
router.get('/user-fundraiser/:fundraiser_id/:user_id', checkJwt, async (req, res) => { 
    const { fundraiser_id, user_id } = req.params; // Get fundraiser_id and user_id from URL parameters

    try { 
        // Fetch record from user_fund_xref based on both fundraiser_id and user_id
        let userFundraiser = await UserFundXref.findOne({
            where: { 
                fundraiser_id: fundraiser_id, 
                user_id: user_id
            }
        }); 

        if (!userFundraiser) { 
            // if record doesn't exist, create new record
            userFundraiser = await UserFundXref.create({
                fundraiser_id: fundraiser_id,
                user_id: user_id,
                request_status: 'pending' // default status when creating the request
            });
            return res.status(201).json({message: 'Record created successfully', userFundraiser}); 
        }

        // Send the record in the response 
        res.status(200).json(userFundraiser);
    } catch (error) { 
        console.error('Error fetching or creating user-fundraiser record:', error); 
        res.status(500).json({error:'Failed to fetch or create record'}); 
    }
}); 

// Route to get all users in a fundraiser
router.get('/get-user-fundraiser/:fundraiser_id', checkJwt, async (req, res) => { 
    const {fundraiser_id} = req.params; 

    try {
        const users = await UserFundXref.findAll({
            where: { fundraiser_id }
        });

        if (!users || users.length === 0) { 
            return res.status(404).json({error: 'No users found for this fundraiser'});
        }

        res.status(200).json(users); 
    } catch (error) { 
        console.error('Error fetching users:', error); 
        res.status(500).json({error: 'Failed to fetch users'});
    }
}); 

// Route to update the request_status for a user (approve or deny)
router.post('/update-request-status/:user_id', checkJwt, async (req, res) => {
    const { user_id } = req.params;
    const { request_status } = req.body;

    try {
        // Find the record for the user
        const userFundraiser = await UserFundXref.findOne({
            where: { user_id }
        });

        if (!userFundraiser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the request_status field
        userFundraiser.request_status = request_status;
        await userFundraiser.save();

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Route to delete a user-fundraiser entry
router.delete('/delete-user-fundraiser/:fundraiser_id/:usr_id', checkJwt, async (req,res) => {
    const { event_id, user_id } = req.params; 

    try { 
        // find an delete the record in user_fundraiser_xref
        const deletedRow = await UserFundXref.destroy({
            where: { 
                fundraiser_id: fundraiser_id, 
                user_id: user_id
            }
        }); 

        if (!deletedRow) { 
            return res.status(404).json({error: 'Record not found'}); 
        }

        res.status(200).json({message: 'Record deleted successfully'});
    } catch (error) { 
        console.error('Error deleting record:', error); 
        res.status(500).json({error: 'Failed to delete record'});
    }
}); 

// Route to request a fundraiser (create a new user-fundraiser entry with "pending" status)
router.post('/request-fundraiser/:fundraiser_id/:user_id', checkJwt, async (req, res) => {
    const { fundraiser_id, user_id } = req.params;
    console.log("fundraiser_id again ", fundraiser_id);
    console.log("user_id again ", user_id);

    try {
        console.log('Checking if record exists for fundraiser_id:', fundraiser_id, 'fundraiser_id:', user_id);

        // Check if a record already exists for this user and fundraiser combination
        const existingRecord = await UserFundXref.findOne({
            where: {
                fundraiser_id: fundraiser_id,
                user_id: user_id
            }
        });

        if (existingRecord) {
            console.log('Record exists. Updating request_status to "pending".');
            // Update the request_status to "pending"
            await existingRecord.update({ request_status: 'pending' });

            res.status(200).json({ message: 'Fundraiser request updated to pending', updatedRecord: existingRecord });
        } else {
            console.log('No existing record. Creating a new one.');
            // Create a new user-fundraiser entry
            const newUserFundraiser = await UserFundXref.create({
                fundraiser_id: fundraiser_id,
                user_id: user_id,
                request_status: 'pending'
            });

            res.status(201).json({ message: 'Fundraiser request created successfully', newUserFundraiser });
        }
    } catch (error) {
        console.error('Error processing event request:', error);
        res.status(500).json({ error: 'Failed to process fundraiser request' });
    }
});

// Route to approve a fundraiser (mark as approved)
router.post('/approve-fundraiser/:fundraiser_id/:user_id', checkJwt, async (req, res) => {
    const { fundraiser_id, user_id } = req.params;

    try {
        // Find the user-fundraiser record for this fundraiser_id and user_id
        const userFundraiser = await UserFundXref.findOne({
            where: {
                fundraiser_id: fundraiser_id,
                user_id: user_id
            }
        });

        if (!userFundraiser) {
            return res.status(404).json({ error: 'Record not found for the specified fundraiser and user' });
        }

        // Update the request_status to "approved"
        userFundraiser.request_status = 'approved';
        await userFundraiser.save();

        res.status(200).json({ message: 'Fundraiser request approved', updatedRecord: userFundraiser });
    } catch (error) {
        console.error('Error approving fundraiser:', error);
        res.status(500).json({ error: 'Failed to approve fundraiser' });
    }
});

// Route to deny an event (mark as denied)
router.post('/deny-fundraiser/:fundraiser_id/:user_id', checkJwt, async (req, res) => {
    const { fundraiser_id, user_id } = req.params;

    try {
        // Find the user-fundraiser record for this fundraiser_id and user_id
        const userFundraiser = await UserFundXref.findOne({
            where: {
                fundraiser_id: fundraiser_id,
                user_id: user_id
            }
        });

        if (!userFundraiser) {
            return res.status(404).json({ error: 'Record not found for the specified fundraiser and user' });
        }

        // Update the request_status to "denied"
        userFundraiser.request_status = 'denied';
        await userFundraiser.save();

        res.status(200).json({ message: 'Fundraiser request denied', updatedRecord: userFundraiser });
    } catch (error) {
        console.error('Error denying fundraiser:', error);
        res.status(500).json({ error: 'Failed to deny fundraiser' });
    }
});

router.get('/user-fundraiser/:fundraiser_id/:user_id', checkJwt, async (req, res) => {
    const { fundraiser_id, user_id } = req.params;
    try {
        const request = await UserFundXref.findOne({
            where: { fundraiser_id, user_id }
        });

        if (!request) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.json({ request_status: request.status });
    } catch (error) {
        console.error('Error fetching user-fundraiser request:', error);
        res.status(500).json({ error: 'Failed to fetch request status' });
    }
});

router.delete('/delete-user-fundraiser/:event_id/:user_id', checkJwt, async (req, res) => {
    const { event_id, user_id } = req.params;

    try {
        const deleted = await UserFundXref.destroy({
            where: { fundraiser_id: event_id, user_id }
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Request not found' });
        }

        res.status(200).json({ message: 'Request successfully deleted' });
    } catch (error) {
        console.error('Error deleting user fundraiser request:', error);
        res.status(500).json({ error: 'Failed to delete request' });
    }
});

router.post('/user-fundraiser', checkJwt, async (req, res) => {
    const { fundraiser_id, user_id } = req.body;

    try {
        const existingRequest = await UserFundXref.findOne({
            where: { fundraiser_id, user_id }
        });

        if (existingRequest) {
            return res.status(400).json({ error: 'Request already exists' });
        }

        const newRequest = await UserFundXref.create({
            fundraiser_id,
            user_id,
            status: 'pending'
        });

        res.status(201).json({ message: 'Request created successfully', newRequest });
    } catch (error) {
        console.error('Error creating user fundraiser request:', error);
        res.status(500).json({ error: 'Failed to create request' });
    }
});


module.exports = router