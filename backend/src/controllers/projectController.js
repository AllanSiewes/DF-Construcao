const { Project, Transaction, Category, sequelize } = require('../models');
const { Op } = require('sequelize');

const projectController = {
  async index(req, res) {
    try {
      const { status, search, page = 1, limit = 20 } = req.query;
      const where = { user_id: req.user.id };

      if (status) where.status = status;
      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { client: { [Op.like]: `%${search}%` } },
        ];
      }

      const { count, rows } = await Project.findAndCountAll({
        where,
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
      });

      // Append financial summary per project
      const projectsWithStats = await Promise.all(
        rows.map(async (project) => {
          const stats = await Transaction.findOne({
            where: { project_id: project.id },
            attributes: [
              [sequelize.fn('SUM', sequelize.literal("CASE WHEN type='receita' THEN amount ELSE 0 END")), 'total_receita'],
              [sequelize.fn('SUM', sequelize.literal("CASE WHEN type='despesa' THEN amount ELSE 0 END")), 'total_despesa'],
            ],
            raw: true,
          });
          return {
            ...project.toJSON(),
            total_receita: parseFloat(stats?.total_receita || 0),
            total_despesa: parseFloat(stats?.total_despesa || 0),
            lucro: parseFloat(stats?.total_receita || 0) - parseFloat(stats?.total_despesa || 0),
          };
        })
      );

      res.json({ projects: projectsWithStats, total: count, page: parseInt(page), limit: parseInt(limit) });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar projetos.', error: error.message });
    }
  },

  async show(req, res) {
    try {
      const project = await Project.findOne({
        where: { id: req.params.id, user_id: req.user.id },
        include: [
          {
            model: Transaction,
            as: 'transactions',
            include: [{ model: Category, as: 'category' }],
            order: [['date', 'DESC']],
          },
        ],
      });

      if (!project) return res.status(404).json({ message: 'Projeto não encontrado.' });

      const transactions = project.transactions || [];
      const total_receita = transactions.filter(t => t.type === 'receita').reduce((s, t) => s + parseFloat(t.amount), 0);
      const total_despesa = transactions.filter(t => t.type === 'despesa').reduce((s, t) => s + parseFloat(t.amount), 0);

      res.json({
        ...project.toJSON(),
        total_receita,
        total_despesa,
        lucro: total_receita - total_despesa,
        percentual_orcamento: project.budget > 0 ? ((total_despesa / project.budget) * 100).toFixed(1) : 0,
      });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar projeto.', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const project = await Project.create({ ...req.body, user_id: req.user.id });
      res.status(201).json({ project });
    } catch (error) {
      res.status(400).json({ message: 'Erro ao criar projeto.', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } });
      if (!project) return res.status(404).json({ message: 'Projeto não encontrado.' });

      await project.update(req.body);
      res.json({ project });
    } catch (error) {
      res.status(400).json({ message: 'Erro ao atualizar projeto.', error: error.message });
    }
  },

  async destroy(req, res) {
    try {
      const project = await Project.findOne({ where: { id: req.params.id, user_id: req.user.id } });
      if (!project) return res.status(404).json({ message: 'Projeto não encontrado.' });

      await project.destroy();
      res.json({ message: 'Projeto removido com sucesso.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover projeto.', error: error.message });
    }
  },
};

module.exports = projectController;
