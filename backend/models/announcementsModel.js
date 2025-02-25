const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Announcement = sequelize.define('Announcement', {
    ann_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    ann_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    ann_description: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'announcements',
    timestamps: false
  });

  return Announcement;
};