// Componente de Análise Inteligente de Gastos (diferencial inovador)

import React, { useMemo } from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, TrendingDown, AlertCircle, Lightbulb, Target } from 'lucide-react';

interface Insight {
  type: 'warning' | 'tip' | 'success';
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function SmartAnalysis() {
  const { transactions, categories, summary } = useFinance();

  const insights = useMemo((): Insight[] => {
    const result: Insight[] = [];

    if (transactions.length === 0) {
      return [{
        type: 'tip',
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Comece a registrar',
        description: 'Registre suas primeiras transações para receber análises personalizadas!'
      }];
    }

    // Análise de categorias
    const sortedCategories = [...categories].sort((a, b) => b.value - a.value);
    const topCategory = sortedCategories[0];

    if (topCategory && summary.monthlyExpenses > 0) {
      const percentage = (topCategory.value / summary.monthlyExpenses) * 100;
      
      if (percentage > 40) {
        result.push({
          type: 'warning',
          icon: <AlertCircle className="w-5 h-5" />,
          title: `${percentage.toFixed(0)}% em ${topCategory.name}`,
          description: `Você gasta mais que a maioria dos usuários nessa categoria. Considere revisar esses gastos.`
        });
      }
    }

    // Análise de tendência
    const currentMonth = new Date().getMonth();
    const currentMonthTransactions = transactions.filter(t => {
      const transactionMonth = new Date(t.date).getMonth();
      return transactionMonth === currentMonth && t.type === 'expense';
    });

    const lastMonthTransactions = transactions.filter(t => {
      const transactionMonth = new Date(t.date).getMonth();
      return transactionMonth === currentMonth - 1 && t.type === 'expense';
    });

    const currentTotal = currentMonthTransactions.reduce((sum, t) => sum + t.value, 0);
    const lastTotal = lastMonthTransactions.reduce((sum, t) => sum + t.value, 0);

    if (lastTotal > 0) {
      const change = ((currentTotal - lastTotal) / lastTotal) * 100;
      
      if (change > 20) {
        result.push({
          type: 'warning',
          icon: <TrendingUp className="w-5 h-5" />,
          title: `Gastos ${change.toFixed(0)}% maiores`,
          description: 'Seus gastos este mês estão acima do mês anterior. Fique atento!'
        });
      } else if (change < -10) {
        result.push({
          type: 'success',
          icon: <TrendingDown className="w-5 h-5" />,
          title: `Economia de ${Math.abs(change).toFixed(0)}%`,
          description: 'Parabéns! Você está gastando menos que no mês passado. Continue assim!'
        });
      }
    }

    // Análise de delivery/alimentação fora
    const deliveryKeywords = ['delivery', 'ifood', 'rappi', 'uber eats', 'lanche', 'fast food'];
    const deliveryExpenses = transactions.filter(t => 
      t.type === 'expense' && 
      deliveryKeywords.some(k => t.description.toLowerCase().includes(k))
    );

    if (deliveryExpenses.length >= 5) {
      const deliveryTotal = deliveryExpenses.reduce((sum, t) => sum + t.value, 0);
      result.push({
        type: 'tip',
        icon: <Lightbulb className="w-5 h-5" />,
        title: 'Dica: Reduza delivery',
        description: `Você gastou R$ ${deliveryTotal.toFixed(0)} em delivery. Cozinhar em casa pode economizar até 60%!`
      });
    }

    // Meta de economia
    if (summary.monthlyIncome > 0) {
      const savingsRate = ((summary.monthlyIncome - summary.monthlyExpenses) / summary.monthlyIncome) * 100;
      
      if (savingsRate > 20) {
        result.push({
          type: 'success',
          icon: <Target className="w-5 h-5" />,
          title: `Taxa de poupança: ${savingsRate.toFixed(0)}%`,
          description: 'Excelente! Você está economizando mais de 20% da sua renda. Continue assim!'
        });
      } else if (savingsRate < 10 && savingsRate > 0) {
        result.push({
          type: 'warning',
          icon: <Target className="w-5 h-5" />,
          title: 'Aumente sua poupança',
          description: `Sua taxa de economia é de ${savingsRate.toFixed(0)}%. Tente chegar a pelo menos 20%.`
        });
      }
    }

    // Limite para 3 insights
    return result.slice(0, 3);
  }, [transactions, categories, summary]);

  const getInsightStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-warning/10 border-warning/30 text-warning';
      case 'success':
        return 'bg-success/10 border-success/30 text-success';
      default:
        return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-1.5 bg-primary/10 rounded-lg">
            <Brain className="w-5 h-5 text-primary" />
          </div>
          Análise Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {insights.map((insight, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 p-3 rounded-lg border ${getInsightStyles(insight.type)}`}
          >
            <div className="mt-0.5">{insight.icon}</div>
            <div>
              <p className="font-medium text-foreground">{insight.title}</p>
              <p className="text-sm text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
