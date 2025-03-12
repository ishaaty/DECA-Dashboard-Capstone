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
    },
    mat_1: {
      type: DataTypes.STRING(2083),
      allowNull: true
    },
    mat_2: {
      type: DataTypes.STRING(2083),
      allowNull: true
    },
    mat_3: {
      type: DataTypes.STRING(2083),
      allowNull: true
    },
    mat_4: {
      type: DataTypes.STRING(2083),
      allowNull: true
    },
    mat_5: {
      type: DataTypes.STRING(2083),
      allowNull: true
    },
    status_1: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status_2: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status_3: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status_4: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    status_5: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
  }, {
    tableName: 'user_event_xref',
    timestamps: false
  });

  UserEventXref.associate = (models) => {
    // Define the inverse association with Event and User
    UserEventXref.belongsTo(models.User, { foreignKey: 'user_id' });
    UserEventXref.belongsTo(models.Event, { foreignKey: 'event_id' });
  };

  return UserEventXref;
};
