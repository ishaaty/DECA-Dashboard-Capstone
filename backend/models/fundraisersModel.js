const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Fundraiser = sequelize.define('Fundraiser', {
    fundraiser_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'fundraiser',
    timestamps: false
  });

  return Fundraiser;
};
