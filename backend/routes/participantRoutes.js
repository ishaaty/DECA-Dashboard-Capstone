const express = require('express');
const router = express.Router();
const { User, Event } = require('../models');

// Fetch participant details along with their events
router.get('/displaydetails', async (req, res) => {
  const { userFirst, userLast } = req.query;

  try {
    // Fetch the user by first and last name along with their associated events
    const user = await User.findOne({
      where: { first_name: userFirst, last_name: userLast },
      include: {
        model: Event,
        through: { attributes: [] }, // Exclude the join table data (user_event_xref)
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return the user details along with the events they are associated with
    res.json({
      userFirst: user.first_name,
      userLast: user.last_name,
      userEmail: user.email,
      userClass: user.user_class,
      events: user.Events.map(event => event.event_name),
    });
  } catch (error) {
    console.error('Error fetching participant details:', error);
    res.status(500).json({ error: 'Failed to fetch participant details' });
  }
});

module.exports = router;
