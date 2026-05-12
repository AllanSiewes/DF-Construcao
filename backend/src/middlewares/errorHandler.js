const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.stack);

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Dados inválidos.',
      errors: err.errors.map((e) => ({ field: e.path, message: e.message })),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Registro duplicado.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Erro interno do servidor.',
  });
};

module.exports = errorHandler;
