// Componente de configurações de orçamento

import React, { useState } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Wallet, Target, Plus, Trash2, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

const DEFAULT_CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Vestuário',
  'Outros'
];

export function BudgetSettings() {
  const { settings, categoryBudgets, updateSettings, addCategoryBudget, updateCategoryBudget, deleteCategoryBudget } = useSettings();
  const [monthlyBudget, setMonthlyBudget] = useState(settings?.monthly_budget?.toString() || '0');
  const [newCategory, setNewCategory] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleUpdateMonthlyBudget = async () => {
    const value = parseFloat(monthlyBudget) || 0;
    await updateSettings({ monthly_budget: value });
  };

  const handleAddCategoryBudget = async () => {
    if (!newCategory || !newLimit) {
      toast.error('Preencha a categoria e o limite');
      return;
    }

    const existing = categoryBudgets.find(b => b.category_name === newCategory);
    if (existing) {
      toast.error('Esta categoria já possui um orçamento');
      return;
    }

    await addCategoryBudget(newCategory, parseFloat(newLimit));
    setNewCategory('');
    setNewLimit('');
  };

  const handleUpdateCategoryBudget = async (id: string) => {
    if (!editValue) return;
    await updateCategoryBudget(id, parseFloat(editValue));
    setEditingId(null);
    setEditValue('');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const availableCategories = DEFAULT_CATEGORIES.filter(
    cat => !categoryBudgets.find(b => b.category_name === cat)
  );

  return (
    <div className="space-y-6">
      {/* Orçamento mensal geral */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Orçamento Mensal
          </CardTitle>
          <CardDescription>
            Defina o limite total de gastos mensais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="monthlyBudget">Limite Mensal (R$)</Label>
            <div className="flex gap-2">
              <Input
                id="monthlyBudget"
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="Ex: 3000"
              />
              <Button onClick={handleUpdateMonthlyBudget}>Salvar</Button>
            </div>
          </div>
          
          {settings?.monthly_budget ? (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span>Orçamento definido</span>
                <span className="font-semibold">{formatCurrency(settings.monthly_budget)}</span>
              </div>
              <Progress value={0} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Você receberá alertas ao atingir 80% e 100% do limite
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Orçamento por categoria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Orçamento por Categoria
          </CardTitle>
          <CardDescription>
            Defina limites específicos para cada categoria de gasto
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Formulário para adicionar novo */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex h-10 w-full sm:w-48 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Selecione...</option>
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <Input
              type="number"
              value={newLimit}
              onChange={(e) => setNewLimit(e.target.value)}
              placeholder="Limite (R$)"
              className="sm:w-32"
            />
            <Button onClick={handleAddCategoryBudget} className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar
            </Button>
          </div>

          {/* Lista de orçamentos por categoria */}
          <div className="space-y-3">
            {categoryBudgets.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum orçamento por categoria definido
              </p>
            ) : (
              categoryBudgets.map((budget) => (
                <div
                  key={budget.id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">{budget.category_name}</p>
                    {editingId === budget.id ? (
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-32 h-8"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateCategoryBudget(budget.id)}
                        >
                          Salvar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(null)}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Limite: {formatCurrency(budget.budget_limit)}
                      </p>
                    )}
                  </div>
                  {editingId !== budget.id && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingId(budget.id);
                          setEditValue(budget.budget_limit.toString());
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCategoryBudget(budget.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
