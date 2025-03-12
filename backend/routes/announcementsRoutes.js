const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const Announcements = require('../models/announcementsModel')(sequelize);

// Display announcements when the home page is opened
router.get('/display', async (req, res) => {
    try {
        const announcements = await Announcements.findAll(); // retrieve the existing announcements
        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ error: 'Failed to fetch announcements' });
    }
});

// Display announcements based on ann_id
router.get('/display/:ann_id', async (req, res) => {
  try {
      const ann_id = parseInt(req.params.ann_id, 10); // Convert to integer
      if (isNaN(ann_id)) {
          return res.status(400).json({ error: 'Invalid ann_id' });
      }

      const announcements = await Announcements.findAll({ where: { ann_id } });
      res.json(announcements);

  } catch (error) {
      console.error('Error fetching announcements:', error);
      res.status(500).json({ error: 'Failed to fetch announcements' });
  }
});

// Edit an existing announcement while keeping ann_id unchanged
router.put('/edit/:ann_id', async (req, res) => {
  const { ann_id } = req.params; // Get announcement ID from the URL parameter
  const {
      ann_name, ann_description
  } = req.body;

  try {
      const announcement = await Announcements.findByPk(ann_id); // Find announcement by primary key

      if (!announcement) {
          return res.status(404).json({ error: 'Announcement not found' });
      }

      // Update only the fields that can be modified
      await announcement.update({
          ann_name, 
          ann_description,

      });

      res.status(200).json({ message: 'Announcement updated successfully', announcement });
  } catch (error) {
      console.error('Error updating announcement:', error);
      res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Add a new announcement to the database
router.post('/add', async (req, res) => {
    const { ann_name, ann_description } = req.body;

    if (!ann_name || !ann_description) {
        return res.status(400).json({ error: 'Announcement name and description are required.' });
    }

    try {
        const newAnnouncement = await Announcements.create({
          ann_name,
          ann_description,
        });
        res.status(201).json(newAnnouncement); // Return the newly created announcement
    } catch (error) {
        console.error('Error adding announcement:', error);
        res.status(500).json({ error: 'Failed to add announcement' });
    }
});

// Delete a announcement by ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Get the announcement ID from the URL parameter

  try {
    const announcement = await Announcements.findByPk(id); // Find announcement by primary key (ID)
    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    await announcement.destroy(); // Delete the announcement
    res.status(200).json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

module.exports = router