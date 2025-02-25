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
      // FOR NOW
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
    event_location: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    event_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    event_time: {
      type: DataTypes.TIME(),
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

  return Event;
};
