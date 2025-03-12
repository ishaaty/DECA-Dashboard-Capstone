const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Announcements = sequelize.define('Announcements', {
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

  return Announcements;
};