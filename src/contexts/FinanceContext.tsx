// Contexto de finanças do MoneyPro com Supabase

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Transaction, Category, MonthlyData, FinanceSummary } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface FinanceContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  categories: Category[];
  monthlyData: MonthlyData[];
  summary: FinanceSummary;
  isLoading: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Carregar transações do banco de dados
  const loadTransactions = useCallback(async () => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Erro ao carregar transações:', error);
        return;
      }

      const formattedTransactions: Transaction[] = (data || []).map(t => ({
        id: t.id,
        type: t.type as 'income' | 'expense',
        description: t.description,
        category: t.category,
        value: Number(t.value),
        date: t.date,
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Erro ao carregar transações:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Adicionar nova transação
  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type: transaction.type,
          description: transaction.description,
          category: transaction.category,
          value: transaction.value,
          date: transaction.date,
        })
        .select()
        .single();

      if (error) {
        console.error('Erro ao adicionar transação:', error);
        throw error;
      }

      const newTransaction: Transaction = {
        id: data.id,
        type: data.type as 'income' | 'expense',
        description: data.description,
        category: data.category,
        value: Number(data.value),
        date: data.date,
      };

      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
      throw error;
    }
  };

  // Deletar transação
  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao deletar transação:', error);
        throw error;
      }

      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
      throw error;
    }
  };

  // Calcular categorias dinamicamente
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    const colors: Record<string, string> = {
      'Alimentação': '#8B5CF6',
      'Transporte': '#A78BFA',
      'Moradia': '#581C87',
      'Lazer': '#C4B5FD',
      'Saúde': '#6D28D9',
      'Educação': '#7C3AED',
      'Compras': '#9333EA',
      'Outros': '#DDD6FE',
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
      color: colors[name] || '#9333EA',
    }));
  }, [transactions]);

  // Calcular dados mensais
  const monthlyData = useMemo((): MonthlyData[] => {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const currentMonth = new Date().getMonth();
    const months: MonthlyData[] = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === monthIndex;
      });

      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + t.value, 0);

      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + t.value, 0);

      months.push({
        month: monthNames[monthIndex],
        income,
        expense,
      });
    }

    return months;
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

    const allExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);
    const avgExpense = transactions.length > 0 ? allExpenses / 6 : 0;

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((acc, t) => acc + t.value, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => acc + t.value, 0);

    const budget = 4000;
    const budgetUsedPercent = budget > 0 ? Math.round((monthlyExpenses / budget) * 100) : 0;

    return {
      totalBalance: totalIncome - totalExpense,
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
        monthlyData,
        summary,
        isLoading,
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
