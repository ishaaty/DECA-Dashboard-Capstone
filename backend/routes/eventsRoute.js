const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const Events = require('../models/eventsModel')(sequelize);


// Display events based on comp_id
router.get('/display/:comp_id', async (req, res) => {
  try {
      const comp_id = parseInt(req.params.comp_id, 10); // Convert to integer
      if (isNaN(comp_id)) {
          return res.status(400).json({ error: 'Invalid comp_id' });
      }

      const events = await Events.findAll({ where: { comp_id } });
      res.json(events);

  } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ error: 'Failed to fetch events' });
  }
});



// Add a new event to the database
router.post('/add', async (req, res) => {
    const { comp_id, event_name, event_descrip, event_location, event_date, event_time, req_1, req_2, req_3, req_4, req_5 } = req.body;

    if (!event_name) {
        return res.status(400).json({ error: 'Event name is required.' });
    }

    try {
        const newEvent = await Events.create({
            comp_id,
            event_name, 
            event_descrip, 
            event_location, 
            event_date, 
            event_time,
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
      event_name, event_descrip, event_location, event_date, event_time,
      req_1, req_2, req_3, req_4, req_5
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
          event_location, 
          event_date, 
          event_time, 
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