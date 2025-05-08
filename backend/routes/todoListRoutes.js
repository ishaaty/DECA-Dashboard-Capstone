const express = require('express');
const router = express.Router();
const multer = require('multer');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const sequelize = require('../config/db');
const UserEventXref = require('../models/user_event_xrefModel')(sequelize);
const Events = require('../models/eventsModel')(sequelize);
const s3 = require('../config/s3Config');
const { Op } = require('sequelize');
const checkJwt = require('../config/jwtConfig');

// Multer storage setup (Memory storage for S3 upload)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to upload a PDF for a specific event and user
router.post('/upload-pdf/:event_id/:user_id', checkJwt, upload.single('pdf'), async (req, res) => {
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
router.get('/user-event/:event_id/:user_id', checkJwt, async (req, res) => {
    const { event_id, user_id } = req.params;  // Get event_id and user_id from URL parameters

    try {
        // Fetch the record from user_event_xref based on both event_id and user_id
        let userEvent = await UserEventXref.findOne({
            where: {
                event_id: event_id,
                user_id: user_id
            }
        });

        if (!userEvent) {
            // If the record doesn't exist, create a new record
            userEvent = await UserEventXref.create({
                event_id: event_id,
                user_id: user_id,
                request_status: 'pending' // Default status when creating the record
            });
            return res.status(201).json({ message: 'Record created successfully', userEvent });
        }

        // Send the record in the response
        res.status(200).json(userEvent);
    } catch (error) {
        console.error('Error fetching or creating user-event record:', error);
        res.status(500).json({ error: 'Failed to fetch or create record' });  // Return 500 for internal errors
    }
});




// Route to update statuses dynamically based on provided numbers
router.post('/save-statuses/:event_id/:user_id', checkJwt, async (req, res) => {
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
router.post('/save-comment/:event_id/:user_id', checkJwt, async (req, res) => {
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



router.get('/get-user-event/:event_id', checkJwt, async (req, res) => {
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
router.post('/update-request-status/:user_id', checkJwt, async (req, res) => {
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



// Route to delete a user-event entry
router.delete('/delete-user-event/:event_id/:user_id', checkJwt, async (req, res) => {
    const { event_id, user_id } = req.params;

    try {
        // Find and delete the record in user_event_xref
        const deletedRow = await UserEventXref.destroy({
            where: {
                event_id: event_id,
                user_id: user_id
            }
        });

        if (!deletedRow) {
            return res.status(404).json({ error: 'Record not found' });
        }

        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ error: 'Failed to delete record' });
    }
});

// Route to request an event (create a new user-event entry with "pending" status)
router.post('/request-event/:event_id/:user_id', checkJwt, async (req, res) => {
    const { event_id, user_id } = req.params;
    console.log("event_id again ", event_id);
    console.log("user_id again ", user_id);

    try {
        console.log('Checking if record exists for event_id:', event_id, 'user_id:', user_id);

        // Check if a record already exists for this user and event combination
        const existingRecord = await UserEventXref.findOne({
            where: {
                event_id: event_id,
                user_id: user_id
            }
        });

        if (existingRecord) {
            console.log('Record exists. Updating request_status to "pending".');
            // Update the request_status to "pending"
            await existingRecord.update({ request_status: 'pending' });

            res.status(200).json({ message: 'Event request updated to pending', updatedRecord: existingRecord });
        } else {
            console.log('No existing record. Creating a new one.');
            // Create a new user-event entry
            const newUserEvent = await UserEventXref.create({
                event_id: event_id,
                user_id: user_id,
                request_status: 'pending'
            });

            res.status(201).json({ message: 'Event request created successfully', newUserEvent });
        }
    } catch (error) {
        console.error('Error processing event request:', error);
        res.status(500).json({ error: 'Failed to process event request' });
    }
});

// Route to approve an event (mark as approved)
router.post('/approve-event/:event_id/:user_id', checkJwt, async (req, res) => {
    const { event_id, user_id } = req.params;

    try {
        // Find the user-event record for this event_id and user_id
        const userEvent = await UserEventXref.findOne({
            where: {
                event_id: event_id,
                user_id: user_id
            }
        });

        if (!userEvent) {
            return res.status(404).json({ error: 'Record not found for the specified event and user' });
        }

        // Update the request_status to "approved"
        userEvent.request_status = 'approved';
        await userEvent.save();

        res.status(200).json({ message: 'Event request approved', updatedRecord: userEvent });
    } catch (error) {
        console.error('Error approving event:', error);
        res.status(500).json({ error: 'Failed to approve event' });
    }
});

// Route to deny an event (mark as denied)
router.post('/deny-event/:event_id/:user_id', checkJwt, async (req, res) => {
    const { event_id, user_id } = req.params;

    try {
        // Find the user-event record for this event_id and user_id
        const userEvent = await UserEventXref.findOne({
            where: {
                event_id: event_id,
                user_id: user_id
            }
        });

        if (!userEvent) {
            return res.status(404).json({ error: 'Record not found for the specified event and user' });
        }

        // Update the request_status to "denied"
        userEvent.request_status = 'denied';
        await userEvent.save();

        res.status(200).json({ message: 'Event request denied', updatedRecord: userEvent });
    } catch (error) {
        console.error('Error denying event:', error);
        res.status(500).json({ error: 'Failed to deny event' });
    }
});



module.exports = router;
