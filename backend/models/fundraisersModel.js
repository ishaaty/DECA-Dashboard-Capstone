const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Fundraiser = sequelize.define('Fundraiser', {
    fundraiser_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    fund_location: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    fund_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fund_description: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    fund_name: {
      type: DataTypes.STRING(45), 
      allowNull: false
    }
  }, {
    tableName: 'fundraisers',
    timestamps: false
  });

  return Fundraiser;
};
