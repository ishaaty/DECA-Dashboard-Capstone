const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserFundXref = sequelize.define('UserFundXref', {
    user_fund_xref_id: {
      type: DataTypes.STRING(45),
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fundraiser_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(45),
      allowNull: false,
      defaultValue: 'default',
    }
  }, {
    tableName: 'user_fund_xref',
    timestamps: false
  });

  return UserFundXref;
};
