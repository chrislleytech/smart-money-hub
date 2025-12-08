// Componente de configurações de notificações

import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, AlertTriangle, Calendar, Mail } from 'lucide-react';

export function NotificationSettings() {
  const { settings, updateSettings, loading } = useSettings();

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    if (!settings) return;
    await updateSettings({ [key]: value });
  };

  if (loading || !settings) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-muted-foreground">Carregando configurações...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Preferências de Notificação
          </CardTitle>
          <CardDescription>
            Configure como e quando você deseja receber alertas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Notificações gerais */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <Label htmlFor="notifications" className="font-medium">
                  Notificações
                </Label>
                <p className="text-sm text-muted-foreground">
                  Ativar/desativar todas as notificações
                </p>
              </div>
            </div>
            <Switch
              id="notifications"
              checked={settings.notifications_enabled}
              onCheckedChange={(checked) => handleToggle('notifications_enabled', checked)}
            />
          </div>

          {/* Alertas de orçamento */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-warning" />
              </div>
              <div>
                <Label htmlFor="budgetAlerts" className="font-medium">
                  Alertas de Orçamento
                </Label>
                <p className="text-sm text-muted-foreground">
                  Avisos ao atingir 80% e 100% do limite
                </p>
              </div>
            </div>
            <Switch
              id="budgetAlerts"
              checked={settings.budget_alerts_enabled}
              onCheckedChange={(checked) => handleToggle('budget_alerts_enabled', checked)}
              disabled={!settings.notifications_enabled}
            />
          </div>

          {/* Lembretes */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Calendar className="w-5 h-5 text-accent" />
              </div>
              <div>
                <Label htmlFor="reminders" className="font-medium">
                  Lembretes de Registro
                </Label>
                <p className="text-sm text-muted-foreground">
                  Lembrar de registrar despesas diariamente
                </p>
              </div>
            </div>
            <Switch
              id="reminders"
              checked={settings.reminder_enabled}
              onCheckedChange={(checked) => handleToggle('reminder_enabled', checked)}
              disabled={!settings.notifications_enabled}
            />
          </div>

          {/* Info sobre notificações */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Notificações por Email</p>
                <p className="text-sm text-muted-foreground">
                  As notificações são exibidas no app. Para receber por email,
                  configure na seção de alertas avançados (em breve).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
