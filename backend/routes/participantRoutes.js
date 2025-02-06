const express = require('express');
const router = express.Router();
const { User, Event } = require('../models');
const {Op} = require('sequelize')

// Route to fetch users by position
router.get('/displayusers', async (req, res) => {
  const { position } = req.query;

  try {
    // Fetch users with the specified position
    console.log(User.getTableName());
    const users = await User.findAll({
      where: { position },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found for the given position.' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});

// Route to fetch users with no role
router.get('/displayunapprovedusers', async (req, res) => {
  const { position } = req.query;

  try {
    // Fetch users with the specified position
    console.log(User.getTableName());
    const users = await User.findAll({
      where: {position: { [Op.is]: null }}
    });

    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found without a position.' });
    }

    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});



// Route to fetch a user's info and events
router.get('/displaydetails', async (req, res) => {
  const { userFirst, userLast } = req.query;

  try {
    console.log('Fetching user details for:', userFirst, userLast);

    // Fetch the user by first and last name, including associated events
    const user = await User.findOne({
      where: { first_name: userFirst, last_name: userLast },
      include: {
        model: Event,  
        through: { attributes: [] },  
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const userEvents = user.Events.map(event => ({
      eventName: event.event_name,
      eventDate: event.event_date
    }));

    if (userEvents.length === 0) {
      return res.status(404).json({
        message: 'User found, but no associated events.',
        user: {
          userFirst: user.first_name,
          userLast: user.last_name,
          userEmail: user.email,
          userClass: user.user_class,
          events: [],
        },
      });
    }

    // Return the user details and associated events
    res.json({
      userFirst: user.first_name,
      userLast: user.last_name,
      userEmail: user.email,
      userClass: user.user_class,
      events: userEvents,
    });
  } catch (error) {
    console.error('Error fetching participant details:', error);
    res.status(500).json({ error: 'Failed to fetch participant details.' });
  }
});



// Route to fetch all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.findAll();

    if (!events || events.length === 0) {
      return res.status(404).json({ message: 'No events found.' });
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events.' });
  }
});



// Route to update user role
router.put("/updateusers", async (req, res) => {
  const { userIds, position } = req.body;
  
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: "No users selected." });
  }

  try {
    await User.update(
      { position: position }, 
      { where: { user_id: userIds } }
    );
    res.json({ message: "Users updated successfully" });
  } catch (error) {
    console.error("Error updating users:", error);
    res.status(500).json({ error: "Failed to update users." });
  }
});



router.delete("/deleteusers", async (req, res) => {
  const { userIds } = req.body; // Expecting an array of user IDs

  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: "Invalid user selection" });
  }

  try {
    await User.destroy({ where: { user_id: userIds } });
    res.status(200).json({ message: "Users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ error: "Failed to delete users" });
  }
});




// Export the router
module.exports = router;