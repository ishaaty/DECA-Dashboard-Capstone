const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const Events = require('../models/eventsModel')(sequelize);

// Fetch an event by ID
router.get('/display/:comp_id', async (req, res) => {
    const { comp_id } = req.params;  // Get comp_id from URL parameter

    try {
        // Fetch all events with the same comp_id
        const events = await Events.findAll({
            where: { comp_id: comp_id }  // Filter by comp_id
        });

        if (events.length === 0) {
            return res.status(404).json({ error: 'No events found for this competition' });  // Return 404 if no events found
        }

        // Send the events data in the response
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });  // Return 500 for internal errors
    }
});


// Fetch a single event by event_id
router.get('/event/:event_id', async (req, res) => {
    const { event_id } = req.params;  // Get event_id from URL parameter

    try {
        // Fetch the event with the given event_id
        const event = await Events.findByPk(event_id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });  // Return 404 if no event found
        }

        // Send the event data in the response
        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Failed to fetch event' });  // Return 500 for internal errors
    }
});





// Add a new event to the database
router.post('/add', async (req, res) => {
    const { comp_id, event_name, event_descrip, req_1, req_2, req_3, req_4, req_5 } = req.body;

    if (!event_name) {
        return res.status(400).json({ error: 'Event name is required.' });
    }

    try {
        const newEvent = await Events.create({
            comp_id,
            event_name, 
            event_descrip,
            req_1,
            req_2,
            req_3,
            req_4,
            req_5
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


// Edit an existing event while keeping comp_id and event_id unchanged
router.put('/edit/:event_id', async (req, res) => {
  const { event_id } = req.params; // Get event ID from the URL parameter
  const {
      event_name, event_descrip, req_1, req_2, req_3, req_4, req_5
  } = req.body;

  try {
      const event = await Events.findByPk(event_id); // Find event by primary key

      if (!event) {
          return res.status(404).json({ error: 'Event not found' });
      }

      // Update only the fields that can be modified
      await event.update({
          event_name, 
          event_descrip,
          req_1, 
          req_2, 
          req_3, 
          req_4, 
          req_5
      });

      res.status(200).json({ message: 'Event updated successfully', event });
  } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ error: 'Failed to update event' });
  }
});


module.exports = router