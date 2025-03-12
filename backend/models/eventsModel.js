const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Event = sequelize.define('Event', {
    event_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    comp_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    event_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    event_descrip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    req_1: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    req_2: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    req_3: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    req_4: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    req_5: {
      type: DataTypes.STRING(45),
      allowNull: true,
    }
  }, {
    tableName: 'events',
    timestamps: false,
  });

  Event.associate = (models) => {
    // Define the association with UserEventXref
    Event.belongsToMany(models.User, { through: models.UserEventXref, foreignKey: 'event_id' });
    Event.hasMany(models.UserEventXref, { foreignKey: 'event_id' });  // To fetch request statuses
  };

  return Event;
};
