const express = require('express');
const router = express.Router();
const { User, Event } = require('../models');
const {Op} = require('sequelize')
const mysql = require('mysql');
const ExcelJS = require('exceljs');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Route to fetch users by position
router.get('/displayusers', async (req, res) => {
  const { position } = req.query;

  try {
    console.log(User.getTableName());
    const users = await User.findAll({ where: { position } });

    // Return an empty array instead of a 404 error if no users exist
    res.json(users.length ? users : []);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
});



// Route to fetch users with no role
router.get('/displayunapprovedusers', async (req, res) => {
  try {
    console.log(User.getTableName());
    
    // Fetch users who have no position or an unapproved position
    const users = await User.findAll({
      where: {
        [Op.or]: [
          { position: { [Op.is]: null } },
          { position: "" },
          { position: "no role" }
        ]
      }
    });

    // Instead of throwing an error, return an empty array if no users are found
    res.json(users.length > 0 ? users : []);
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
      eventDate: event.event_date,
    }));

    // Return the user details with an empty array for events if none are found
    res.json({
      userFirst: user.first_name,
      userLast: user.last_name,
      userEmail: user.email,
      userClass: user.user_class,
      events: userEvents,  // If no events, this will be an empty array
      userId: user.user_id,
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
  formattedPosition = position.toLowerCase();
  
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return res.status(400).json({ error: "No users selected." });
  }

  try {
    await User.update(
      { position: formattedPosition }, 
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

router.get('/export', async (req, res) => {
  try {
    const sql = `
      SELECT users.user_id, users.first_name, users.last_name, users.email, users.position, competitions.comp_name
      FROM users
      LEFT JOIN user_comp_xref ON users.user_id = user_comp_xref.\`user-id\`
      LEFT JOIN competitions ON user_comp_xref.\`comp-id\` = competitions.competition_id
      ORDER BY users.user_id;
    `;

    db.query(sql, async (err, results) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      console.log('Fetched participant data:', results);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Participants Data');

      worksheet.addRow(['User ID', 'First Name', 'Last Name', 'Email', 'Position', 'Competition']);

      results.forEach(user => {
        worksheet.addRow([
          user.user_id,
          user.first_name,
          user.last_name,
          user.email,
          user.position,
          user.comp_name || 'No Competition'
        ]);
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=participants.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    });
  } catch (error) {
    console.error('Export Error:', error);
    res.status(500).json({ error: 'Failed to generate Excel file' });
  }
});

module.exports = router;