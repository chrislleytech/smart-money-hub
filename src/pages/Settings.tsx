// Página de Configurações MoneyPro

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Wallet, Tag, Bell } from 'lucide-react';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { BudgetSettings } from '@/components/settings/BudgetSettings';
import { CategorySettings } from '@/components/settings/CategorySettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';

const SettingsContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-display font-bold text-foreground">
            Configurações
          </h2>
          <p className="text-muted-foreground">
            Gerencie seu perfil, orçamentos e preferências
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="profile" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="budgets" className="gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Orçamentos</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="gap-2">
              <Tag className="w-4 h-4" />
              <span className="hidden sm:inline">Categorias</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notificações</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          <TabsContent value="budgets">
            <BudgetSettings />
          </TabsContent>

          <TabsContent value="categories">
            <CategorySettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

const Settings = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <SettingsProvider>
      <SettingsContent />
    </SettingsProvider>
  );
};

export default Settings;
