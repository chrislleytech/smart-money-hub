// Alerta de orçamento

import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

export function BudgetAlert() {
  const { summary } = useFinance();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || summary.budgetUsedPercent < 70) {
    return null;
  }

  const isWarning = summary.budgetUsedPercent >= 70 && summary.budgetUsedPercent < 90;
  const isDanger = summary.budgetUsedPercent >= 90;

  return (
    <div 
      className={`
        rounded-xl p-4 flex items-center justify-between animate-slide-up
        ${isDanger ? 'bg-destructive/10 border border-destructive/30' : 'alert-warning'}
      `}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className={`w-5 h-5 ${isDanger ? 'text-destructive' : 'text-warning-foreground'}`} />
        <div>
          <p className={`font-semibold ${isDanger ? 'text-destructive' : 'text-warning-foreground'}`}>
            {isDanger ? 'Alerta Crítico!' : 'Atenção!'}
          </p>
          <p className={`text-sm ${isDanger ? 'text-destructive/80' : 'text-warning-foreground/80'}`}>
            Você já usou {summary.budgetUsedPercent}% do seu orçamento mensal. 
            {isDanger ? ' Cuidado!' : ' Fique atento!'}
          </p>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className={`p-1 rounded-lg transition-colors ${
          isDanger ? 'hover:bg-destructive/20 text-destructive' : 'hover:bg-warning-foreground/10 text-warning-foreground'
        }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
