const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/db');
const About = require('../models/aboutModel')(sequelize);

// Get about description
router.get('/', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({ description: '' }); // default empty
    }
    res.json(about);
  } catch (error) {
    console.error('Error fetching about description:', error);
    res.status(500).json({ error: 'Failed to fetch description' });
  }
});

// Update about description
router.put('/', async (req, res) => {
  const { description } = req.body;
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({ description });
    } else {
      about.description = description;
      await about.save();
    }
    res.status(200).json(about);
  } catch (error) {
    console.error('Error updating description:', error);
    res.status(500).json({ error: 'Failed to update description' });
  }
});

module.exports = router;
