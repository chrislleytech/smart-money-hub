// Contexto de configurações do usuário MoneyPro

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface UserSettings {
  id: string;
  monthly_budget: number;
  notifications_enabled: boolean;
  budget_alerts_enabled: boolean;
  reminder_enabled: boolean;
}

interface CategoryBudget {
  id: string;
  category_name: string;
  budget_limit: number;
}

interface CustomCategory {
  id: string;
  name: string;
  color: string;
}

interface SettingsContextType {
  settings: UserSettings | null;
  categoryBudgets: CategoryBudget[];
  customCategories: CustomCategory[];
  loading: boolean;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  addCategoryBudget: (category_name: string, budget_limit: number) => Promise<void>;
  updateCategoryBudget: (id: string, budget_limit: number) => Promise<void>;
  deleteCategoryBudget: (id: string) => Promise<void>;
  addCustomCategory: (name: string, color: string) => Promise<void>;
  updateCustomCategory: (id: string, name: string, color: string) => Promise<void>;
  deleteCustomCategory: (id: string) => Promise<void>;
  getCategoryBudget: (categoryName: string) => number;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>([]);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      // Load user settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (settingsError) throw settingsError;

      if (!settingsData) {
        // Create default settings
        const { data: newSettings, error: createError } = await supabase
          .from('user_settings')
          .insert({ user_id: user.id })
          .select()
          .single();

        if (createError) throw createError;
        setSettings(newSettings);
      } else {
        setSettings(settingsData);
      }

      // Load category budgets
      const { data: budgetsData, error: budgetsError } = await supabase
        .from('category_budgets')
        .select('*')
        .eq('user_id', user.id);

      if (budgetsError) throw budgetsError;
      setCategoryBudgets(budgetsData || []);

      // Load custom categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('custom_categories')
        .select('*')
        .eq('user_id', user.id);

      if (categoriesError) throw categoriesError;
      setCustomCategories(categoriesData || []);

    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!user || !settings) return;

    try {
      const { error } = await supabase
        .from('user_settings')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;
      setSettings({ ...settings, ...updates });
      toast.success('Configurações atualizadas!');
    } catch (error) {
      toast.error('Erro ao atualizar configurações');
    }
  };

  const addCategoryBudget = async (category_name: string, budget_limit: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('category_budgets')
        .insert({ user_id: user.id, category_name, budget_limit })
        .select()
        .single();

      if (error) throw error;
      setCategoryBudgets([...categoryBudgets, data]);
      toast.success('Orçamento de categoria adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar orçamento');
    }
  };

  const updateCategoryBudget = async (id: string, budget_limit: number) => {
    try {
      const { error } = await supabase
        .from('category_budgets')
        .update({ budget_limit })
        .eq('id', id);

      if (error) throw error;
      setCategoryBudgets(categoryBudgets.map(b => 
        b.id === id ? { ...b, budget_limit } : b
      ));
      toast.success('Orçamento atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar orçamento');
    }
  };

  const deleteCategoryBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('category_budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategoryBudgets(categoryBudgets.filter(b => b.id !== id));
      toast.success('Orçamento removido!');
    } catch (error) {
      toast.error('Erro ao remover orçamento');
    }
  };

  const addCustomCategory = async (name: string, color: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('custom_categories')
        .insert({ user_id: user.id, name, color })
        .select()
        .single();

      if (error) throw error;
      setCustomCategories([...customCategories, data]);
      toast.success('Categoria criada!');
    } catch (error) {
      toast.error('Erro ao criar categoria');
    }
  };

  const updateCustomCategory = async (id: string, name: string, color: string) => {
    try {
      const { error } = await supabase
        .from('custom_categories')
        .update({ name, color })
        .eq('id', id);

      if (error) throw error;
      setCustomCategories(customCategories.map(c => 
        c.id === id ? { ...c, name, color } : c
      ));
      toast.success('Categoria atualizada!');
    } catch (error) {
      toast.error('Erro ao atualizar categoria');
    }
  };

  const deleteCustomCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('custom_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCustomCategories(customCategories.filter(c => c.id !== id));
      toast.success('Categoria removida!');
    } catch (error) {
      toast.error('Erro ao remover categoria');
    }
  };

  const getCategoryBudget = (categoryName: string): number => {
    const budget = categoryBudgets.find(b => b.category_name === categoryName);
    return budget?.budget_limit || 0;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        categoryBudgets,
        customCategories,
        loading,
        updateSettings,
        addCategoryBudget,
        updateCategoryBudget,
        deleteCategoryBudget,
        addCustomCategory,
        updateCustomCategory,
        deleteCustomCategory,
        getCategoryBudget,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings deve ser usado dentro de um SettingsProvider');
  }
  return context;
}
