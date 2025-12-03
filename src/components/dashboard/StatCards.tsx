// Cards de estatísticas do dashboard

import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { TrendingUp, TrendingDown, BarChart3, Wallet } from 'lucide-react';

export function StatCards() {
  const { summary } = useFinance();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const cards = [
    {
      title: 'Saldo Total',
      value: formatCurrency(summary.totalBalance),
      icon: Wallet,
      trend: 'up',
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-l-success',
    },
    {
      title: 'Despesas (Mês)',
      value: formatCurrency(summary.monthlyExpenses),
      icon: TrendingDown,
      trend: 'down',
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-l-destructive',
    },
    {
      title: 'Previsão',
      value: formatCurrency(summary.forecast),
      icon: BarChart3,
      trend: 'neutral',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-l-primary',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={`stat-card border-l-4 ${card.borderColor} animate-slide-up`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
              <p className={`text-2xl font-display font-bold mt-1 ${card.color}`}>
                {card.value}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-xl ${card.bgColor} flex items-center justify-center`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
