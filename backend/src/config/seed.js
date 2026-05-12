require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const { sequelize, User, Category, Project, Transaction } = require('../models');

const seed = async () => {
  await sequelize.sync({ force: true });

  // Create admin user
  const user = await User.create({
    name: 'Diego Ferreira',
    email: 'admin@dfconstrucoes.com.br',
    password: '123456',
    role: 'admin',
  });

  // System categories - Receitas
  const catReceitas = await Category.bulkCreate([
    { name: 'Pagamento de Obra', type: 'receita', icon: 'hard-hat', color: '#22c55e', is_system: true },
    { name: 'Adiantamento', type: 'receita', icon: 'wallet', color: '#16a34a', is_system: true },
    { name: 'Medição', type: 'receita', icon: 'clipboard-list', color: '#4ade80', is_system: true },
    { name: 'Outros (Receita)', type: 'receita', icon: 'plus-circle', color: '#86efac', is_system: true },
  ]);

  // System categories - Despesas
  const catDespesas = await Category.bulkCreate([
    { name: 'Material de Construção', type: 'despesa', icon: 'package', color: '#ef4444', is_system: true },
    { name: 'Mão de Obra', type: 'despesa', icon: 'users', color: '#f97316', is_system: true },
    { name: 'Equipamentos', type: 'despesa', icon: 'tool', color: '#eab308', is_system: true },
    { name: 'Transporte / Frete', type: 'despesa', icon: 'truck', color: '#8b5cf6', is_system: true },
    { name: 'Combustível', type: 'despesa', icon: 'droplet', color: '#06b6d4', is_system: true },
    { name: 'Alimentação', type: 'despesa', icon: 'coffee', color: '#f59e0b', is_system: true },
    { name: 'Impostos / Taxas', type: 'despesa', icon: 'file-text', color: '#6b7280', is_system: true },
    { name: 'Outros (Despesa)', type: 'despesa', icon: 'minus-circle', color: '#9ca3af', is_system: true },
  ]);

  // Sample projects
  const projects = await Project.bulkCreate([
    {
      name: 'Residência Silva',
      client: 'João Silva',
      address: 'Rua das Palmeiras, 123 - Jaraguá do Sul/SC',
      description: 'Construção residencial completa - 180m²',
      status: 'em_andamento',
      type: 'completo',
      budget: 85000,
      start_date: '2026-02-01',
      estimated_end_date: '2026-08-30',
      user_id: user.id,
    },
    {
      name: 'Galpão Industrial Souza',
      client: 'Carlos Souza',
      address: 'Rua Industrial, 456 - Jaraguá do Sul/SC',
      description: 'Fundação e levantamento de paredes - 400m²',
      status: 'em_andamento',
      type: 'fundacao',
      budget: 120000,
      start_date: '2026-03-15',
      estimated_end_date: '2026-09-15',
      user_id: user.id,
    },
    {
      name: 'Reforma Varanda Pereira',
      client: 'Maria Pereira',
      address: 'Av. Central, 789 - Jaraguá do Sul/SC',
      description: 'Reboco estrutural e alvenaria',
      status: 'concluido',
      type: 'reboco',
      budget: 18000,
      start_date: '2026-01-10',
      end_date: '2026-03-20',
      user_id: user.id,
    },
    {
      name: 'Cobertura Residencial Costa',
      client: 'Roberto Costa',
      address: 'Rua das Flores, 321 - Jaraguá do Sul/SC',
      description: 'Cobertura metálica - 90m²',
      status: 'orcamento',
      type: 'cobertura',
      budget: 32000,
      user_id: user.id,
    },
  ]);

  // Sample transactions for current month
  const now = new Date();
  const thisMonth = (day) => `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const lastMonth = (day) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 1, day);
    return d.toISOString().split('T')[0];
  };

  await Transaction.bulkCreate([
    // Current month - Receitas
    { type: 'receita', amount: 12000, description: 'Medição #3 - Residência Silva', date: thisMonth(5), payment_method: 'pix', status: 'pago', project_id: projects[0].id, category_id: catReceitas[2].id, user_id: user.id },
    { type: 'receita', amount: 35000, description: 'Adiantamento - Galpão Souza', date: thisMonth(2), payment_method: 'transferencia', status: 'pago', project_id: projects[1].id, category_id: catReceitas[1].id, user_id: user.id },
    { type: 'receita', amount: 8500, description: 'Saldo final - Varanda Pereira', date: thisMonth(8), payment_method: 'pix', status: 'pago', project_id: projects[2].id, category_id: catReceitas[0].id, user_id: user.id },

    // Current month - Despesas
    { type: 'despesa', amount: 4200, description: 'Cimento, areia e brita - Residência Silva', date: thisMonth(3), payment_method: 'boleto', status: 'pago', project_id: projects[0].id, category_id: catDespesas[0].id, user_id: user.id },
    { type: 'despesa', amount: 6500, description: 'Pedreiros semana 1 - Galpão Souza', date: thisMonth(7), payment_method: 'pix', status: 'pago', project_id: projects[1].id, category_id: catDespesas[1].id, user_id: user.id },
    { type: 'despesa', amount: 1800, description: 'Aluguel betoneira', date: thisMonth(4), payment_method: 'dinheiro', status: 'pago', project_id: projects[0].id, category_id: catDespesas[2].id, user_id: user.id },
    { type: 'despesa', amount: 650, description: 'Combustível - caminhonete', date: thisMonth(9), payment_method: 'dinheiro', status: 'pago', category_id: catDespesas[4].id, user_id: user.id },
    { type: 'despesa', amount: 3200, description: 'Tijolos e blocos - Galpão Souza', date: thisMonth(6), payment_method: 'pix', status: 'pago', project_id: projects[1].id, category_id: catDespesas[0].id, user_id: user.id },

    // Last month - Receitas
    { type: 'receita', amount: 18000, description: 'Pagamento parcial - Varanda Pereira', date: lastMonth(15), payment_method: 'transferencia', status: 'pago', project_id: projects[2].id, category_id: catReceitas[0].id, user_id: user.id },
    { type: 'receita', amount: 9500, description: 'Medição #2 - Residência Silva', date: lastMonth(20), payment_method: 'pix', status: 'pago', project_id: projects[0].id, category_id: catReceitas[2].id, user_id: user.id },

    // Last month - Despesas
    { type: 'despesa', amount: 5800, description: 'Material completo - Varanda Pereira', date: lastMonth(10), payment_method: 'boleto', status: 'pago', project_id: projects[2].id, category_id: catDespesas[0].id, user_id: user.id },
    { type: 'despesa', amount: 4200, description: 'Mão de obra - Varanda Pereira', date: lastMonth(25), payment_method: 'pix', status: 'pago', project_id: projects[2].id, category_id: catDespesas[1].id, user_id: user.id },
    { type: 'despesa', amount: 720, description: 'Alimentação equipe', date: lastMonth(12), payment_method: 'dinheiro', status: 'pago', category_id: catDespesas[5].id, user_id: user.id },
  ]);

  console.log('✅ Seed concluído com sucesso!');
  console.log('👤 Login: admin@dfconstrucoes.com.br / 123456');
  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
