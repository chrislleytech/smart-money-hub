// Tipos do sistema MoneyPro

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  description: string;
  category: string;
  value: number;
  date: string;
}

export interface Category {
  name: string;
  value: number;
  color: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export interface FinanceSummary {
  totalBalance: number;
  monthlyExpenses: number;
  monthlyIncome: number;
  forecast: number;
  budgetUsedPercent: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
