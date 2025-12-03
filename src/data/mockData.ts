// Dados mock para demonstração do MoneyPro

import { Transaction, Category, MonthlyData, FinanceSummary } from '@/types/finance';

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    description: 'Supermercado Extra',
    category: 'Alimentação',
    value: 450.00,
    date: '2025-01-01',
  },
  {
    id: '2',
    type: 'expense',
    description: 'Uber - Trabalho',
    category: 'Transporte',
    value: 85.50,
    date: '2025-01-01',
  },
  {
    id: '3',
    type: 'income',
    description: 'Salário',
    category: 'Salário',
    value: 5500.00,
    date: '2024-12-30',
  },
  {
    id: '4',
    type: 'expense',
    description: 'Netflix',
    category: 'Lazer',
    value: 55.90,
    date: '2024-12-28',
  },
  {
    id: '5',
    type: 'expense',
    description: 'Conta de Luz',
    category: 'Moradia',
    value: 180.00,
    date: '2024-12-27',
  },
  {
    id: '6',
    type: 'expense',
    description: 'Restaurante',
    category: 'Alimentação',
    value: 120.00,
    date: '2024-12-26',
  },
  {
    id: '7',
    type: 'expense',
    description: 'Combustível',
    category: 'Transporte',
    value: 200.00,
    date: '2024-12-25',
  },
  {
    id: '8',
    type: 'expense',
    description: 'Academia',
    category: 'Saúde',
    value: 99.90,
    date: '2024-12-24',
  },
];

export const mockCategories: Category[] = [
  { name: 'Alimentação', value: 570, color: '#8B5CF6' },
  { name: 'Transporte', value: 285.5, color: '#A78BFA' },
  { name: 'Moradia', value: 180, color: '#581C87' },
  { name: 'Lazer', value: 55.9, color: '#C4B5FD' },
  { name: 'Saúde', value: 99.9, color: '#6D28D9' },
];

export const mockMonthlyData: MonthlyData[] = [
  { month: 'Ago', income: 5500, expense: 3200 },
  { month: 'Set', income: 5500, expense: 3800 },
  { month: 'Out', income: 5800, expense: 3100 },
  { month: 'Nov', income: 5500, expense: 3500 },
  { month: 'Dez', income: 5500, expense: 3191.3 },
  { month: 'Jan', income: 0, expense: 535.5 },
];

export const mockSummary: FinanceSummary = {
  totalBalance: 15000.00,
  monthlyExpenses: 3500.00,
  monthlyIncome: 5500.00,
  forecast: 3000.00,
  budgetUsedPercent: 80,
};

export const categoryOptions = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Compras',
  'Outros',
];
