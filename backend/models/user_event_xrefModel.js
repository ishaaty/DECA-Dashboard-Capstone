const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserEventXref = sequelize.define('UserEventXref', {
    user_event_xref_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    request_status: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'user_event_xref',
    timestamps: false
  });

  return UserEventXref;
};
