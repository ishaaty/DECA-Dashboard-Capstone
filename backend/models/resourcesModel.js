const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Resources = sequelize.define('Resources', {
    resource_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    resource_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    web_url: {
      type: DataTypes.STRING(2083),
      allowNull: true
    },
    file_url: {
      type: DataTypes.STRING(2083),
      allowNull: true
    }
  }, {
    tableName: 'resources',
    timestamps: false
  });

  return Resources;
};
