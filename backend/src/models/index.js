const sequelize = require('../config/database');
const User = require('./User');
const Project = require('./Project');
const Transaction = require('./Transaction');
const Category = require('./Category');

// User associations
User.hasMany(Project, { foreignKey: 'user_id', as: 'projects' });
User.hasMany(Transaction, { foreignKey: 'user_id', as: 'transactions' });

// Project associations
Project.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
Project.hasMany(Transaction, { foreignKey: 'project_id', as: 'transactions' });

// Transaction associations
Transaction.belongsTo(User, { foreignKey: 'user_id', as: 'owner' });
Transaction.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
Transaction.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// Category associations
Category.hasMany(Transaction, { foreignKey: 'category_id', as: 'transactions' });

module.exports = { sequelize, User, Project, Transaction, Category };
