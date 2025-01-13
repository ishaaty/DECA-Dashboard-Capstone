const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Materials = sequelize.define('Materials', {
    materials_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    complete: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 0 // Assuming incomplete by default
    },
    feedback: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'materials',
    timestamps: false
  });

  return Materials;
};
