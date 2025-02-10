const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
  }
);



sequelize.authenticate()
  .then(() => {
    console.log('Sequelize connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });


  
const User = require('./userModel')(sequelize, DataTypes);
const Event = require('./eventsModel')(sequelize, DataTypes);
const UserEventXref = require('./user_event_xrefModel')(sequelize, DataTypes);
const Competition = require('./competitionModel')(sequelize, DataTypes);
const UserCompXref = require('./user_comp_xrefModel')(sequelize, DataTypes);
const Fundraiser = require('./fundraisersModel')(sequelize, DataTypes);
const UserFundXref = require('./user_fund_xrefModel')(sequelize, DataTypes);
const Resource = require('./resourcesModel')(sequelize, DataTypes);
const Material = require('./materialsModel')(sequelize, DataTypes);



// Set associations after defining models
User.belongsToMany(Event, {
  through: UserEventXref,
  foreignKey: 'user_id',
  otherKey: 'event_id'
});

Event.belongsToMany(User, {
  through: UserEventXref,
  foreignKey: 'event_id',
  otherKey: 'user_id'
});



// Export models and sequelize instance
module.exports = {
  sequelize,
  User,
  Event,
  UserEventXref,
  Competition,
  UserCompXref,
  Fundraiser,
  UserFundXref,
  Resource,
  Material
};
