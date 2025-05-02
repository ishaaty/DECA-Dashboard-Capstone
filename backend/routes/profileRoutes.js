// routes/profileRoutes.js

const express = require('express');
const router = express.Router();
const {Op} = require('sequelize')
const { User, Event } = require('../models');


router.put('/update', async (req, res) => {
  const {
    user_id,
    first_name,
    last_name,
    user_class,
    position,
    cell_phone,
    home_phone,
    gender,
    demographic,
    dob,
    account_email,
    email
  } = req.body;

  try {
    let user = await User.findOne({ where: { user_id } });
    await user.update({ first_name, last_name, user_class, position, account_email, cell_phone, home_phone, gender, demographic, dob, account_email, email });
    res.status(200).send({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send({ error: 'Failed to update user' });
  }
});

module.exports = router;
