const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const TodoList = require('../models/user_event_xrefModel')(sequelize);

// Display todoList (and comment) based on event_id, user_id, and request_status
router.get('/display', async (req, res) => {
  try {
      const { event_id, user_id } = req.query; // Assuming parameters are passed as query params

      if (!event_id || !user_id) {
          return res.status(400).json({ error: 'event_id and user_id are required' });
      }

      const todoListItem = await TodoList.findOne({
          where: {
              event_id,
              user_id,
              request_status: 'approved' // Ensure the request is approved
          }
      });

      if (!todoListItem) {
          return res.status(404).json({ error: 'No matching todo list item found' });
      }

      res.json(todoListItem);
  } catch (error) {
      console.error('Error fetching todoList item:', error);
      res.status(500).json({ error: 'Failed to fetch todo list item' });
  }
});


// Save statuses of materials

// Add/edit comment


// User Functionality
// Upload material for requirement


module.exports = router