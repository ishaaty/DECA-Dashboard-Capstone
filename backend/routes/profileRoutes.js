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

    // await User.update(
    //   { first_name: first_name }, 
    //   { last_name: last_name }, 
    //   { user_class: user_class }, 
    //   { position: position }, 
    //   { cell_phone: cell_phone }, 
    //   { home_phone: home_phone }, 
    //   { gender: gender }, 
    //   { demographic: demographic }, 
    //   { dob: dob }, 
    //   { account_email: account_email }, 
    //   { email: email }, 
    //   { where: { user_id: user_id } }
    // );
    // const query = `
    //   UPDATE user
    //   SET first_name = ?, last_name = ?, user_class = ?, position = ?, cell_phone = ?, home_phone = ?, gender = ?, demographic = ?, dob = ?, account_email = ?, email = ?
    //   WHERE user_id = ?
    // `;

    // const values = [first_name, last_name, user_class, position, cell_phone, home_phone, gender, demographic, dob, account_email, email, user_id];
    // await db.query(query, values);

    res.status(200).send({ message: 'User updated successfully' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send({ error: 'Failed to update user' });
  }
});

module.exports = router;
