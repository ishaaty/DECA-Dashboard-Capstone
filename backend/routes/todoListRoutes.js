const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const UserEventXref = require('../models/user_event_xrefModel')(sequelize);

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
  


<<<<<<< HEAD
module.exports = router;
=======
module.exports = router;
>>>>>>> d7c9502 (finalyl done w announcements)
