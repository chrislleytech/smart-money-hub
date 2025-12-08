// Componente de Barra de Progresso Financeiro

import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

export function FinancialProgress() {
  const { summary } = useFinance();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular progresso do orçamento
  const budgetUsed = summary.budgetUsedPercent;
  
  const getProgressColor = () => {
    if (budgetUsed >= 100) return 'bg-destructive';
    if (budgetUsed >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusIcon = () => {
    if (budgetUsed >= 100) return <AlertTriangle className="w-5 h-5 text-destructive" />;
    if (budgetUsed >= 80) return <AlertTriangle className="w-5 h-5 text-warning" />;
    return <CheckCircle className="w-5 h-5 text-success" />;
  };

  const getStatusMessage = () => {
    if (budgetUsed >= 100) return 'Orçamento excedido! Revise seus gastos.';
    if (budgetUsed >= 80) return 'Atenção! Você está próximo do limite.';
    if (budgetUsed >= 50) return 'Bom progresso. Continue controlando seus gastos.';
    return 'Excelente! Seus gastos estão sob controle.';
  };

  // Calcular economia mensal
  const monthlySavings = summary.monthlyIncome - summary.monthlyExpenses;
  const savingsRate = summary.monthlyIncome > 0 
    ? (monthlySavings / summary.monthlyIncome) * 100 
    : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Target className="w-5 h-5 text-primary" />
          </div>
          Progresso Financeiro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progresso do orçamento */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Uso do Orçamento Mensal</span>
            <span className="text-sm font-bold">{budgetUsed.toFixed(0)}%</span>
          </div>
          <div className="relative">
            <Progress 
              value={Math.min(budgetUsed, 100)} 
              className="h-4"
            />
            {/* Marcadores de 80% e 100% */}
            <div className="absolute top-0 left-[80%] w-0.5 h-4 bg-warning/50" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            {getStatusIcon()}
            <span className="text-muted-foreground">{getStatusMessage()}</span>
          </div>
        </div>

        {/* Resumo financeiro */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-success/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-xs text-muted-foreground">Receitas</span>
            </div>
            <p className="font-bold text-success">{formatCurrency(summary.monthlyIncome)}</p>
          </div>
          
          <div className="p-3 bg-destructive/10 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-destructive rotate-180" />
              <span className="text-xs text-muted-foreground">Despesas</span>
            </div>
            <p className="font-bold text-destructive">{formatCurrency(summary.monthlyExpenses)}</p>
          </div>
        </div>

        {/* Taxa de economia */}
        <div className="p-4 bg-muted/50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Economia do Mês</span>
            <span className={`text-sm font-bold ${monthlySavings >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(monthlySavings)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Progress 
              value={Math.max(0, Math.min(savingsRate, 100))} 
              className="h-2 flex-1"
            />
            <span className="text-xs text-muted-foreground w-12 text-right">
              {savingsRate.toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {savingsRate >= 20 
              ? '🎉 Meta de 20% atingida!' 
              : `Faltam ${(20 - savingsRate).toFixed(0)}% para a meta de economia`}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
