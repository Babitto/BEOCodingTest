const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db.js"); 


const Documents = sequelize.define('Documents', {
    docId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileSize: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
  jobId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  portalId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW,
  }
}, {
  tableName: 'Documents',
  timestamps: true, 
});

module.exports = Documents;
