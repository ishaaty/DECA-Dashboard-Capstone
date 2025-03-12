const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const sequelize = require('../config/db');
const UserEventXref = require('../models/user_event_xrefModel')(sequelize);
const Events = require('../models/eventsModel')(sequelize);
const s3 = require('../config/s3Config');
const { Op } = require('sequelize');

// Multer storage setup (Memory storage for S3 upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload a PDF for a specific event and user
router.post('/upload-pdf/:event_id/:user_id', upload.single('pdf'), async (req, res) => {
    const { event_id, user_id } = req.params;
    const { requirement } = req.body;  // This will now capture the selected requirement (1, 2, etc.)
    const file = req.file;

    if (!file || !requirement) {
        return res.status(400).json({ error: 'No file uploaded or requirement missing' });
    }

    try {
        const fileKey = `pdfs/${Date.now()}_${file.originalname}`;

        // Upload file to S3
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            Body: file.buffer,
            // ACL: 'public-read'
        };

        await s3.send(new PutObjectCommand(params));

        const file_url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;

        // Map the requirement number to the appropriate column (mat_1, mat_2, etc.)
        const matField = `mat_${requirement}`;

        // Ensure the field exists
        if (!['mat_1', 'mat_2', 'mat_3', 'mat_4', 'mat_5'].includes(matField)) {
            return res.status(400).json({ error: 'Invalid requirement number' });
        }

        // Update the database record for the user-event
        const userEvent = await UserEventXref.findOne({ where: { event_id, user_id } });

        if (!userEvent) {
            return res.status(404).json({ error: 'Record not found' });
        }

        // Dynamically assign the file_url to the corresponding mat field
        userEvent[matField] = file_url; // Save the URL to the correct field (mat_1, mat_2, etc.)
        await userEvent.save();

        res.status(200).json({ message: 'PDF uploaded successfully', file_url });
    } catch (error) {
        console.error('Error uploading PDF:', error);
        res.status(500).json({ error: 'Failed to upload PDF' });
    }
});



// Route to get a single row based on event_id and user_id
router.get('/user-event/:event_id/:user_id', async (req, res) => {
    const { event_id, user_id } = req.params;  // Get event_id and user_id from URL parameters

    try {
        // Fetch the record from user_event_xref based on both event_id and user_id
        const userEvent = await UserEventXref.findOne({
            where: {
                event_id: event_id,
                user_id: user_id
            }
        });

        if (!userEvent) {
            return res.status(404).json({ error: 'Record not found' });  // Return 404 if not found
        }

        // Send the record in the response
        res.status(200).json(userEvent);
    } catch (error) {
        console.error('Error fetching user-event record:', error);
        res.status(500).json({ error: 'Failed to fetch record' });  // Return 500 for internal errors
    }
});



// Route to update statuses dynamically based on provided numbers
router.post('/save-statuses/:event_id/:user_id', async (req, res) => {
    const { event_id, user_id } = req.params;
    const statuses = req.body; // Example: {2: 'completed', 4: 'pending'}

    try {
        // Find the record to update
        const userEvent = await UserEventXref.findOne({
            where: { event_id, user_id }
        });

        if (!userEvent) {
            return res.status(404).json({ error: 'Record not found' });
        }

        // Dynamically update only the relevant status_X fields
        const updateFields = {};
        for (const [num, status] of Object.entries(statuses)) {
            const fieldName = `status_${num}`;
            if (userEvent[fieldName] !== undefined) {  // Ensure field exists
                updateFields[fieldName] = status;
            }
        }

        // Perform the update in the database
        await UserEventXref.update(updateFields, { where: { event_id, user_id } });

        res.status(200).json({ message: 'Statuses updated successfully' });
    } catch (error) {
        console.error('Error updating statuses:', error);
        res.status(500).json({ error: 'Failed to update statuses' });
    }
});


// Route to save the comment
router.post('/save-comment/:event_id/:user_id', async (req, res) => {
    const { event_id, user_id } = req.params;
    const { comment } = req.body;  // Get the comment from the request body
  
    try {
      // Find the record in user_event_xref table
      const userEvent = await UserEventXref.findOne({
        where: { event_id, user_id }
      });
  
      if (!userEvent) {
        return res.status(404).json({ error: 'Record not found' });
      }
  
      // Update the comment field
      userEvent.comment = comment;
      await userEvent.save();  // Save the updated record to the database
  
      res.status(200).json(userEvent);  // Send the updated record back in the response
    } catch (error) {
      console.error('Error saving comment:', error);
      res.status(500).json({ error: 'Failed to save comment' });
    }
});



router.get('/user-event/:event_id', async (req, res) => {
    const { event_id } = req.params;
    
    try {
        const users = await UserEventXref.findAll({
            where: { event_id }
        });

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'No users found for this event' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});


// Route to update the request_status for a user (approve or deny)
router.post('/update-request-status/:user_id', async (req, res) => {
    const { user_id } = req.params;
    const { request_status } = req.body;

    try {
        // Find the record for the user
        const userEvent = await UserEventXref.findOne({
            where: { user_id }
        });

        if (!userEvent) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the request_status field
        userEvent.request_status = request_status;
        await userEvent.save();

        res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
        console.error('Error updating request status:', error);
        res.status(500).json({ error: 'Failed to update status' });
    }
});
  


module.exports = router;
