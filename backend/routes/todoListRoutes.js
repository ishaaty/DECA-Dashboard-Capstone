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

module.exports = router;
