const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const About = sequelize.define('About', {
    idabout: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
  })
    // {
    //   idabout: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     autoIncrement: true,
    //     allowNull: true,
    //   },
    //   description: {
    //     type: DataTypes.TEXT,
    //     allowNull: false,
    //     defaultValue: '',
    //   },
    // },
    // {
    //   tableName: 'about',
    //   timestamps: false,
    // }
};