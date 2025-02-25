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