const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('receita', 'despesa'),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  payment_method: {
    type: DataTypes.ENUM('dinheiro', 'pix', 'transferencia', 'boleto', 'cartao', 'cheque', 'outro'),
    defaultValue: 'pix',
  },
  status: {
    type: DataTypes.ENUM('pendente', 'pago', 'cancelado', 'atrasado'),
    defaultValue: 'pago',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  project_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  category_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receipt_url: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Transaction;
