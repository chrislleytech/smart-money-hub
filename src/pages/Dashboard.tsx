// Página principal do Dashboard MoneyPro

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { FinanceProvider } from '@/contexts/FinanceContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatCards } from '@/components/dashboard/StatCards';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { MonthlyChart } from '@/components/dashboard/MonthlyChart';
import { BudgetAlert } from '@/components/dashboard/BudgetAlert';
import { TransactionTable } from '@/components/dashboard/TransactionTable';
import { AddTransactionForm } from '@/components/dashboard/AddTransactionForm';

const DashboardContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Título e ação principal */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Dashboard Financeiro
            </h2>
            <p className="text-muted-foreground">
              Acompanhe suas finanças em tempo real
            </p>
          </div>
          <AddTransactionForm />
        </div>

        {/* Alerta de orçamento */}
        <BudgetAlert />

        {/* Cards de estatísticas */}
        <StatCards />

        {/* Gráficos lado a lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CategoryChart />
          <MonthlyChart />
        </div>

        {/* Tabela de transações */}
        <TransactionTable />
      </main>
    </div>
  );
};

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  // Se não está logado, redireciona para o login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <FinanceProvider>
      <DashboardContent />
    </FinanceProvider>
  );
};

export default Dashboard;
