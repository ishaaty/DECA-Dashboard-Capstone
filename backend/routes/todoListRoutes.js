const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const TodoList = require('../models/user_event_xrefModel')(sequelize);

// Display resources when the resource page is opened
router.get('/display', async (req, res) => {
    try {
        const todoList = await Resources.findAll(); // retrieve the existing resources
        res.json(resources);
    } catch (error) {
        console.error('Error fetching resources:', error);
        res.status(500).json({ error: 'Failed to fetch resources' });
    }
});

// Add a new resource to the database
router.post('/add', async (req, res) => {
    const { resource_name, web_url, file_url } = req.body;

    if (!resource_name || (!web_url && !file_url)) {
        return res.status(400).json({ error: 'Resource name and at least one URL (web or file) are required.' });
    }

    try {
        const newResource = await Resources.create({
            resource_name,
            web_url,
            file_url,
        });
        res.status(201).json(newResource); // Return the newly created resource
    } catch (error) {
        console.error('Error adding resource:', error);
        res.status(500).json({ error: 'Failed to add resource' });
    }
});

// Delete a resource by ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Get the resource ID from the URL parameter

  try {
    const resource = await Resources.findByPk(id); // Find resource by primary key (ID)
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    await resource.destroy(); // Delete the resource
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

module.exports = router