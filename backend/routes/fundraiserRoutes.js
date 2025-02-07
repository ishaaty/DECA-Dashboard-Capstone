const express = require('express');
const router = express.Router();
const sequelize = require('../config/db');
const Fundraisers = require('../models/fundraisersModel')(sequelize);

// Display fundraisers when the fundraisers page is opened
router.get('/display', async (req, res) => {
    try {
        const fundraisers = await Fundrasiers.findAll(); // retrieve the existing fundraisers
        res.json(fundraisers);
    } catch (error) {
        console.error('Error fetching fundraisers:', error);
        res.status(500).json({ error: 'Failed to fetch fundraisers' });
    }
});

// Add a new fundraisers to the database
router.post('/add', async (req, res) => {
    const { fund_location, fund_date, fund_description, fund_name } = req.body;

    if (!fund_name || (!fund_description && !fund_date && !fund_location)) {
        return res.status(400).json({ error: 'Fundraiser name, description, location, and date are required.' });
    }

    try {
        const newFundraiser = await Fundraisers.create({
            fund_location,
            fund_date,
            fund_description,
            fund_name,
        });
        res.status(201).json(newFundraiser); // Return the newly created fundraiser
    } catch (error) {
        console.error('Error adding fundraiser:', error);
        res.status(500).json({ error: 'Failed to add fundraiser' });
    }
});

// Delete a fundraiser by ID
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params; // Get the fundraiser ID from the URL parameter

  try {
    const fundraiser = await Fundraisers.findByPk(id); // Find fundraiser by primary key (ID)
    if (!fundraiser) {
      return res.status(404).json({ error: 'Fundraiser not found' });
    }

    await fundraiser.destroy(); // Delete the fundraiser
    res.status(200).json({ message: 'Fundraiser deleted successfully' });
  } catch (error) {
    console.error('Error deleting fundraiser:', error);
    res.status(500).json({ error: 'Failed to delete fundraiser' });
  }
});

module.exports = router