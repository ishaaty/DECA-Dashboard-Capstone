const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserCompXref = sequelize.define('UserCompXref', {
    xref_user_comp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    comp_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_comp_xrefcol: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'user_comp_xref',
    timestamps: false
  });

  return UserCompXref;
};
