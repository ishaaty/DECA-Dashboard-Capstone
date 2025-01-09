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
    fund_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    request_status: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    tableName: 'user_fund_xref',
    timestamps: false
  });

  return UserFundXref;
};
