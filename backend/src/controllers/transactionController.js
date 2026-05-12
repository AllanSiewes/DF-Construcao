const { Transaction, Category, Project, sequelize } = require('../models');
const { Op } = require('sequelize');

const transactionController = {
  async index(req, res) {
    try {
      const { type, project_id, category_id, status, start_date, end_date, page = 1, limit = 30 } = req.query;
      const where = { user_id: req.user.id };

      if (type) where.type = type;
      if (project_id) where.project_id = project_id;
      if (category_id) where.category_id = category_id;
      if (status) where.status = status;
      if (start_date || end_date) {
        where.date = {};
        if (start_date) where.date[Op.gte] = start_date;
        if (end_date) where.date[Op.lte] = end_date;
      }

      const { count, rows } = await Transaction.findAndCountAll({
        where,
        include: [
          { model: Category, as: 'category' },
          { model: Project, as: 'project', attributes: ['id', 'name', 'client'] },
        ],
        order: [['date', 'DESC'], ['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
      });

      res.json({ transactions: rows, total: count, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar transações.', error: error.message });
    }
  },

  async show(req, res) {
    try {
      const transaction = await Transaction.findOne({
        where: { id: req.params.id, user_id: req.user.id },
        include: [
          { model: Category, as: 'category' },
          { model: Project, as: 'project' },
        ],
      });
      if (!transaction) return res.status(404).json({ message: 'Transação não encontrada.' });
      res.json({ transaction });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar transação.', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const transaction = await Transaction.create({ ...req.body, user_id: req.user.id });
      const full = await Transaction.findByPk(transaction.id, {
        include: [{ model: Category, as: 'category' }, { model: Project, as: 'project', attributes: ['id', 'name', 'client'] }],
      });
      res.status(201).json({ transaction: full });
    } catch (error) {
      res.status(400).json({ message: 'Erro ao criar transação.', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const transaction = await Transaction.findOne({ where: { id: req.params.id, user_id: req.user.id } });
      if (!transaction) return res.status(404).json({ message: 'Transação não encontrada.' });

      await transaction.update(req.body);
      res.json({ transaction });
    } catch (error) {
      res.status(400).json({ message: 'Erro ao atualizar transação.', error: error.message });
    }
  },

  async destroy(req, res) {
    try {
      const transaction = await Transaction.findOne({ where: { id: req.params.id, user_id: req.user.id } });
      if (!transaction) return res.status(404).json({ message: 'Transação não encontrada.' });

      await transaction.destroy();
      res.json({ message: 'Transação removida com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover transação.', error: error.message });
    }
  },
};

module.exports = transactionController;
