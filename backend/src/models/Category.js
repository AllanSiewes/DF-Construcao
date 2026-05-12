const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('receita', 'despesa'),
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'tag',
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '#6A6F77',
  },
  is_system: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = Category;
