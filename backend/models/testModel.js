const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Test = sequelize.define('Test', {
    idtest: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    teststring: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'test',
    timestamps: false
  });

  return Test;
};
