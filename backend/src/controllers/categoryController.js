const { Category } = require('../models');

const categoryController = {
  async index(req, res) {
    try {
      const { type } = req.query;
      const where = {};
      if (type) where.type = type;

      const categories = await Category.findAll({ where, order: [['name', 'ASC']] });
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar categorias.', error: error.message });
    }
  },

  async create(req, res) {
    try {
      const category = await Category.create(req.body);
      res.status(201).json({ category });
    } catch (error) {
      res.status(400).json({ message: 'Erro ao criar categoria.', error: error.message });
    }
  },

  async update(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ message: 'Categoria não encontrada.' });
      if (category.is_system) return res.status(403).json({ message: 'Categorias do sistema não podem ser editadas.' });
      await category.update(req.body);
      res.json({ category });
    } catch (error) {
      res.status(400).json({ message: 'Erro ao atualizar categoria.', error: error.message });
    }
  },

  async destroy(req, res) {
    try {
      const category = await Category.findByPk(req.params.id);
      if (!category) return res.status(404).json({ message: 'Categoria não encontrada.' });
      if (category.is_system) return res.status(403).json({ message: 'Categorias do sistema não podem ser removidas.' });
      await category.destroy();
      res.json({ message: 'Categoria removida.' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover categoria.', error: error.message });
    }
  },
};

module.exports = categoryController;
