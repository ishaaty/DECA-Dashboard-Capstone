const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserFundXref = sequelize.define('UserFundXref', {
    user_fund_xref_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fundraiser_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    request_status: {
      type: DataTypes.STRING(45),
      allowNull: false,
    }
  }, {
    tableName: 'user_fund_xref',
    timestamps: false
  });

  return UserFundXref;
};
