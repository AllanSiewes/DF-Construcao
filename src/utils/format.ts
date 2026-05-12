export const formatCurrency = (value: number, compact = false): string => {
  if (compact && Math.abs(value) >= 1000) {
    const formatted = (value / 1000).toFixed(1).replace('.', ',');
    return `R$ ${formatted}k`;
  }
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  });
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '-';
  const [year, month, day] = dateStr.split('T')[0].split('-');
  return `${day}/${month}/${year}`;
};

export const formatDateRelative = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Ontem';
  if (diff < 7) return `${diff} dias atrás`;
  return formatDate(dateStr);
};

export const formatPercent = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const sign = num > 0 ? '+' : '';
  return `${sign}${num.toFixed(1)}%`;
};

export const projectStatusLabel: Record<string, string> = {
  orcamento: 'Orçamento',
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
  pausado: 'Pausado',
};

export const projectStatusColor: Record<string, string> = {
  orcamento: '#F59E0B',
  em_andamento: '#3B82F6',
  concluido: '#22C55E',
  cancelado: '#EF4444',
  pausado: '#6A6F77',
};

export const projectTypeLabel: Record<string, string> = {
  fundacao: 'Fundação',
  alvenaria: 'Alvenaria',
  levantamento_paredes: 'Levantamento de Paredes',
  cobertura: 'Cobertura',
  reboco: 'Reboco Estrutural',
  completo: 'Obra Completa',
  outro: 'Outro',
};

export const paymentMethodLabel: Record<string, string> = {
  dinheiro: 'Dinheiro',
  pix: 'PIX',
  transferencia: 'Transferência',
  boleto: 'Boleto',
  cartao: 'Cartão',
  cheque: 'Cheque',
  outro: 'Outro',
};

export const transactionStatusLabel: Record<string, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  cancelado: 'Cancelado',
  atrasado: 'Atrasado',
};

export const transactionStatusColor: Record<string, string> = {
  pendente: '#F59E0B',
  pago: '#22C55E',
  cancelado: '#6A6F77',
  atrasado: '#EF4444',
};
