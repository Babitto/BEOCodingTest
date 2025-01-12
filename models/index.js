const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.js"); 

const User = sequelize.define("Users", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = { sequelize, User };
