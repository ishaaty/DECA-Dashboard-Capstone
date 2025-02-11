const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const Events = require('../models/eventsModel')(sequelize);


// Display resources when the events page is opened
router.get('/display', async (req, res) => {
    try {
        const events = await Events.findAll(); // retrieve the existing events
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});

// Add a new event to the database
router.post('/add', async (req, res) => {
    const { competition_id, event_name, event_descrip, event_location, event_date, event_time } = req.body;

    if (!event_name) {
        return res.status(400).json({ error: 'Event name is required.' });
    }

    try {
        const newEvent = await Events.create({
            competition_id,
            event_name, 
            event_descrip, 
            event_location, 
            event_date, 
            event_time
        });
        res.status(201).json(newEvent); // Return the newly created event
    } catch (error) {
        console.error('Error adding event:', error);
        res.status(500).json({ error: 'Failed to add event' });
    }
});

// Delete a resource by ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Get the resource ID from the URL parameter

  try {
    const event = await Events.findByPk(id); // Find resource by primary key (ID)
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    await event.destroy(); // Delete the event
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router