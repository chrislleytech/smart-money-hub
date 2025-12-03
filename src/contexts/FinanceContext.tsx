// Contexto de finanças do MoneyPro

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Transaction, Category, MonthlyData, FinanceSummary } from '@/types/finance';
import { mockTransactions, mockMonthlyData } from '@/data/mockData';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  categories: Category[];
  monthlyData: MonthlyData[];
  summary: FinanceSummary;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);

  // Adicionar nova transação
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Deletar transação
  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Calcular categorias dinamicamente
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    const colors: Record<string, string> = {
      'Alimentação': '#0066CC',
      'Transporte': '#3399FF',
      'Moradia': '#1a365d',
      'Lazer': '#63B3ED',
      'Saúde': '#4A5568',
      'Educação': '#2D3748',
      'Compras': '#718096',
      'Outros': '#A0AEC0',
      'Salário': '#22C55E',
    };

    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.value);
      });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#718096',
    }));
  }, [transactions]);

  // Calcular resumo financeiro
  const summary = useMemo((): FinanceSummary => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const currentMonthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const monthlyExpenses = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);

    const monthlyIncome = currentMonthTransactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.value, 0);

    // Calcular média de gastos para previsão
    const allExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);
    const avgExpense = allExpenses / 6; // Média dos últimos 6 meses

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.value, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);

    const budget = 4000; // Orçamento mensal definido
    const budgetUsedPercent = Math.round((monthlyExpenses / budget) * 100);

    return {
      totalBalance: totalIncome - totalExpense + 15000, // Saldo inicial de demonstração
      monthlyExpenses,
      monthlyIncome,
      forecast: Math.round(avgExpense),
      budgetUsedPercent: Math.min(budgetUsedPercent, 100),
    };
  }, [transactions]);

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        addTransaction,
        deleteTransaction,
        categories,
        monthlyData: mockMonthlyData,
        summary,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance deve ser usado dentro de um FinanceProvider');
  }
  return context;
}
