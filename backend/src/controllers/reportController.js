const { Transaction, Project, Category, sequelize } = require('../models');
const { Op } = require('sequelize');

const reportController = {
  async dashboard(req, res) {
    try {
      const userId = req.user.id;
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      const toDate = (d) => d.toISOString().split('T')[0];

      const [monthStats, lastMonthStats, projectsCount, recentTransactions] = await Promise.all([
        Transaction.findOne({
          where: {
            user_id: userId,
            status: { [Op.ne]: 'cancelado' },
            date: { [Op.between]: [toDate(firstOfMonth), toDate(lastOfMonth)] },
          },
          attributes: [
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN type='receita' THEN amount ELSE 0 END")), 'receita'],
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN type='despesa' THEN amount ELSE 0 END")), 'despesa'],
          ],
          raw: true,
        }),
        Transaction.findOne({
          where: {
            user_id: userId,
            status: { [Op.ne]: 'cancelado' },
            date: { [Op.between]: [toDate(firstOfLastMonth), toDate(lastOfLastMonth)] },
          },
          attributes: [
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN type='receita' THEN amount ELSE 0 END")), 'receita'],
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN type='despesa' THEN amount ELSE 0 END")), 'despesa'],
          ],
          raw: true,
        }),
        Project.count({ where: { user_id: userId, status: 'em_andamento' } }),
        Transaction.findAll({
          where: { user_id: userId },
          include: [
            { model: Category, as: 'category' },
            { model: Project, as: 'project', attributes: ['id', 'name'] },
          ],
          order: [['date', 'DESC'], ['created_at', 'DESC']],
          limit: 10,
        }),
      ]);

      const receita = parseFloat(monthStats?.receita || 0);
      const despesa = parseFloat(monthStats?.despesa || 0);
      const lastReceita = parseFloat(lastMonthStats?.receita || 0);
      const lastDespesa = parseFloat(lastMonthStats?.despesa || 0);

      res.json({
        month: {
          receita,
          despesa,
          lucro: receita - despesa,
          margem: receita > 0 ? (((receita - despesa) / receita) * 100).toFixed(1) : 0,
        },
        lastMonth: {
          receita: lastReceita,
          despesa: lastDespesa,
          lucro: lastReceita - lastDespesa,
        },
        growth: {
          receita: lastReceita > 0 ? (((receita - lastReceita) / lastReceita) * 100).toFixed(1) : null,
          despesa: lastDespesa > 0 ? (((despesa - lastDespesa) / lastDespesa) * 100).toFixed(1) : null,
        },
        activeProjects: projectsCount,
        recentTransactions,
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar relatório.', error: error.message });
    }
  },

  async cashflow(req, res) {
    try {
      const { months = 6 } = req.query;
      const userId = req.user.id;
      const result = [];

      for (let i = parseInt(months) - 1; i >= 0; i--) {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        const toDate = (d) => d.toISOString().split('T')[0];

        const stats = await Transaction.findOne({
          where: {
            user_id: userId,
            status: { [Op.ne]: 'cancelado' },
            date: { [Op.between]: [toDate(start), toDate(end)] },
          },
          attributes: [
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN type='receita' THEN amount ELSE 0 END")), 'receita'],
            [sequelize.fn('SUM', sequelize.literal("CASE WHEN type='despesa' THEN amount ELSE 0 END")), 'despesa'],
          ],
          raw: true,
        });

        result.push({
          month: start.toLocaleString('pt-BR', { month: 'short', year: '2-digit' }),
          year: start.getFullYear(),
          monthIndex: start.getMonth(),
          receita: parseFloat(stats?.receita || 0),
          despesa: parseFloat(stats?.despesa || 0),
          lucro: parseFloat(stats?.receita || 0) - parseFloat(stats?.despesa || 0),
        });
      }

      res.json({ cashflow: result });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar fluxo de caixa.', error: error.message });
    }
  },

  async byCategory(req, res) {
    try {
      const { type = 'despesa', start_date, end_date } = req.query;
      const where = { user_id: req.user.id, type };
      if (start_date || end_date) {
        where.date = {};
        if (start_date) where.date[Op.gte] = start_date;
        if (end_date) where.date[Op.lte] = end_date;
      }

      const data = await Transaction.findAll({
        where,
        include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'color', 'icon'] }],
        attributes: [
          'category_id',
          [sequelize.fn('SUM', sequelize.col('amount')), 'total'],
          [sequelize.fn('COUNT', sequelize.col('Transaction.id')), 'count'],
        ],
        group: ['category_id', 'category.id'],
        raw: true,
        nest: true,
      });

      res.json({ categories: data });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao gerar relatório por categoria.', error: error.message });
    }
  },
};

module.exports = reportController;
