const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Competition = sequelize.define('Competition', {
    competition_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    comp_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    comp_location: {
      type: DataTypes.STRING(45),
    },
    comp_date: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'competition',
    timestamps: false,
  });

  return Competition;
};